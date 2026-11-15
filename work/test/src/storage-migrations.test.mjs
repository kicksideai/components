// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import assert from 'node:assert/strict'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { run } from '../../scripts/module-rules.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const capture = `
local direction, engine = arg[2], arg[3]
local db = { execute = function(_, statement, params)
    for i, value in ipairs(params or {}) do statement = statement:gsub("%$" .. i, "'" .. value .. "'") end
    io.write(statement, "\\0"); return {}, nil
end }
package.preload.clock = function() return { now = function() return "2026-11-14T00:00:00.000000000Z" end } end
package.preload.operation_expiry = function()
    return { TERMINAL = "status IN ('done','cancelled','failed')", at = function(dialect)
        local captured = dialect == "postgres" and "(actor_context::jsonb ->> 'captured_at')" or "json_extract(actor_context, '$.captured_at')"
        return "(substr(" .. captured .. ", 1, 19) || '.000000000Z')"
    end }
end
package.preload.migration = function()
    return { define = function(fn)
        migration = function(_, body) body() end
        database = function(dialect, body) if dialect == engine then body() end end
        up = function(body) if direction == "up" then body(db) end end
        down = function(body) if direction == "down" then body(db) end end
        fn()
    end }
end
dofile(arg[1])
`

async function statements(name, direction, engine = 'sqlite') {
  const result = await run('lua', ['-', resolve(root, `src/migrations/${name}.lua`), direction, engine], {}, capture)
  return result.split('\0').filter(Boolean)
}

test('Work rollback removes every fixed table including board metadata', async () => {
  const up = await statements('01_work', 'up')
  const down = await statements('01_work', 'down')
  const result = await run('python3', ['-c', `
import json, sqlite3, sys
up, down = json.load(sys.stdin)
db = sqlite3.connect(':memory:')
for sql in up: db.execute(sql)
db.execute("INSERT INTO kickside_work_board_meta VALUES ('board','Title','','',1)")
for sql in down: db.execute(sql)
print(json.dumps(db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'kickside_work_%'").fetchall()))
`], {}, JSON.stringify([up, down]))
  assert.deepEqual(JSON.parse(result), [])
})

test('storage retirement preserves in-flight data and restores accurate counters on rollback', async () => {
  const predecessor = await statements('01_work', 'up')
  const up = await statements('02_retire_storage', 'up')
  const down = await statements('02_retire_storage', 'down')
  const bounded = await statements('04_bounded_retention', 'up')
  const boundedDown = await statements('04_bounded_retention', 'down')
  const result = await run('python3', ['-c', `
import json, sqlite3, sys
predecessor, up, down, bounded, bounded_down = json.load(sys.stdin)
db = sqlite3.connect(':memory:')
for statement in predecessor: db.execute(statement)
def insert(table, values):
    cols = db.execute("PRAGMA table_info("+table+")").fetchall()
    payload = {c[1]: (0 if c[2] == "INTEGER" else "") for c in cols if c[3] and c[4] is None}
    payload.update(values)
    db.execute("INSERT INTO "+table+" ("+",".join(payload)+") VALUES ("+",".join("?" for _ in payload)+")",list(payload.values()))
insert("kickside_work_board",dict(board_id="board",counter=42,item_count=99,open_count=99,trashed_count=99))
insert("kickside_work_change",dict(board_id="board",seq=1,n=1,kind="created",subject="i:a",after="accepted fact",ctx=""))
for id,life,category in [("a","live","started"),("b","live","completed"),("c","trashed","started")]:
    insert("kickside_work_item",dict(board_id="board",item_id=id,number=ord(id),life=life,category=category))
# Verify the predecessor has the same STRICT shape as published installs.
assert db.execute("SELECT strict FROM pragma_table_list WHERE name=\'kickside_work_board\'").fetchone()[0] == 1
db.commit()
db.execute('BEGIN')
for sql in up[:2]: db.execute(sql)
db.rollback()
assert {'item_count','open_count','trashed_count'} <= {row[1] for row in db.execute('PRAGMA table_info(kickside_work_board)')}
for sql in up: db.execute(sql)
columns = [row[1] for row in db.execute('PRAGMA table_info(kickside_work_board)')]
assert 'counter' in columns and not {'item_count','open_count','trashed_count'} & set(columns), columns
assert db.execute('SELECT board_id,counter FROM kickside_work_board').fetchall() == [('board',42)]
assert db.execute('SELECT board_id,after FROM kickside_work_change').fetchall() == [('board','accepted fact')]
assert db.execute('SELECT COUNT(*) FROM kickside_work_item').fetchone()[0] == 3
# A populated predecessor has neither completion state nor a failure timestamp.
db.execute("UPDATE kickside_work_item SET life='purged' WHERE item_id='c'")
insert("kickside_work_job",dict(board_id="board",job_id="failed-job",status="failed"))
db.commit()
db.execute('BEGIN')
for sql in bounded[:2]: db.execute(sql)
db.rollback()
assert 'purge_pending' not in {row[1] for row in db.execute('PRAGMA table_info(kickside_work_item)')}
for sql in bounded: db.execute(sql)
assert db.execute("SELECT purge_pending FROM kickside_work_item WHERE item_id='c'").fetchone()[0] == 1
assert db.execute("SELECT SUM(purge_pending) FROM kickside_work_item").fetchone()[0] == 1
assert db.execute("SELECT failed_at FROM kickside_work_job WHERE job_id='failed-job'").fetchone()[0] == '2026-11-14T00:00:00.000000000Z'
for sql in bounded_down: db.execute(sql)
assert 'failed_at' not in {row[1] for row in db.execute('PRAGMA table_info(kickside_work_job)')}
# The retirement rollback reconstructs counts using the retained life states.
db.execute("UPDATE kickside_work_item SET life='trashed' WHERE item_id='c'")
for sql in down: db.execute(sql)
print(json.dumps(db.execute('SELECT counter,item_count,open_count,trashed_count FROM kickside_work_board').fetchone()))
`], {}, JSON.stringify([predecessor, up, down, bounded, boundedDown]))
  assert.deepEqual(JSON.parse(result), [42, 2, 1, 1])
})

// The VM supplies a disposable database through its container's psql. No mocked
// PostgreSQL DDL: use the published predecessor on the actual engine.
test('populated PostgreSQL predecessor survives transactional retirement, restart and rollback',
  { skip: !process.env.WORK_MIGRATION_POSTGRES }, async () => {
    const predecessor = await statements('01_work', 'up', 'postgres')
    const up = await statements('02_retire_storage', 'up', 'postgres')
    const down = await statements('02_retire_storage', 'down', 'postgres')
    const bounded = await statements('04_bounded_retention', 'up', 'postgres')
    const boundedDown = await statements('04_bounded_retention', 'down', 'postgres')
    const cleanup = await statements('05_cleanup_seeks', 'up', 'postgres')
    const cleanupDown = await statements('05_cleanup_seeks', 'down', 'postgres')
    const schema = `work_upgrade_${process.pid}`
    async function psql(script) {
      const args = ['exec', '-i', 'kickside-test-pg', 'psql', '-X', '-qAt', '-v', 'ON_ERROR_STOP=1', '-U', 'kickside', '-d', 'kickside_test_work']
      return process.env.WORK_MIGRATION_SSH
        ? run('ssh', [process.env.WORK_MIGRATION_SSH, 'docker', ...args], {}, script)
        : run('docker', args, {}, script)
    }
    const seed = `
DO $fixture$
DECLARE entry record; columns text; literals text;
BEGIN
FOR entry IN SELECT * FROM (VALUES
 ('kickside_work_board','board_id','board'),
 ('kickside_work_item','item_id','a'),
 ('kickside_work_item','item_id','b'),
 ('kickside_work_item','item_id','c'),
 ('kickside_work_change','subject','i:a')) AS t(tab,key,val)
LOOP
 SELECT string_agg(quote_ident(column_name),',' ORDER BY ordinal_position),
        string_agg(CASE WHEN column_name='board_id' THEN quote_literal('board')
             WHEN column_name=entry.key THEN quote_literal(entry.val)
             WHEN column_name='number' THEN ascii(entry.val)::text
             WHEN data_type IN ('bigint','integer','smallint') THEN '1' ELSE quote_literal('') END,',' ORDER BY ordinal_position)
 INTO columns,literals FROM information_schema.columns
 WHERE table_schema=current_schema() AND table_name=entry.tab
 AND is_nullable='NO' AND column_default IS NULL;
 EXECUTE format('INSERT INTO %I (%s) VALUES (%s)',entry.tab,columns,literals);
END LOOP;
END $fixture$;
UPDATE kickside_work_board SET counter=42,item_count=99,open_count=99,trashed_count=99;
UPDATE kickside_work_item SET life=CASE WHEN item_id='c' THEN 'trashed' ELSE 'live' END,
 category=CASE WHEN item_id='b' THEN 'completed' ELSE 'started' END,document='{"1":{"p":"Before"}}';
UPDATE kickside_work_change SET after='accepted fact';
`
    await psql(`CREATE SCHEMA ${schema};`)
    try {
      await psql(`SET search_path TO ${schema};\n${predecessor.join(';\n')};\n${seed}`)
      // Aborted DDL is rolled back before retry. The next connection is a restart.
      await psql(`SET search_path TO ${schema}; BEGIN; ${up.slice(0,2).join(';')}; ROLLBACK;`)
      await psql(`SET search_path TO ${schema}; BEGIN; ${up.join(';')}; COMMIT;`)
      const result = await psql(`SET search_path TO ${schema};
SELECT counter FROM kickside_work_board;
SELECT after FROM kickside_work_change;
SELECT count(*) FROM kickside_work_item;
BEGIN; ${down.join(';')}; COMMIT;
SELECT counter||','||item_count||','||open_count||','||trashed_count FROM kickside_work_board;`)
      assert.deepEqual(result.trim().split('\n'), ['42','accepted fact','3','42,2,1,1'])
      await psql(`SET search_path TO ${schema}; BEGIN; ${up.join(';')}; COMMIT;`)
      await psql(`SET search_path TO ${schema};
UPDATE kickside_work_item SET life='purged' WHERE item_id='c';
INSERT INTO kickside_work_job (board_id,job_id,job_type,key,status) VALUES ('board','failed-job','migration','old','failed');
BEGIN; ${bounded.slice(0,2).join(';')}; ROLLBACK;`)
      await psql(`SET search_path TO ${schema}; BEGIN; ${bounded.join(';')}; COMMIT;`)
      await psql(`SET search_path TO ${schema};
CREATE INDEX kickside_work_comment_deleted ON kickside_work_comment (board_id,edited_at) WHERE deleted=1;
INSERT INTO kickside_work_comment (board_id,comment_id,item_id,body,mentions,author,version,deleted,created_at,edited_at)
 SELECT 'board','c'||n,'unrelated','body','[]','fixture',1,n%2,'2000','2000' FROM generate_series(1,20000) n;
INSERT INTO kickside_work_comment (board_id,comment_id,item_id,body,mentions,author,version,deleted,created_at)
 VALUES ('board','z-dead','purged','body','[]','fixture',1,0,'2000');
INSERT INTO kickside_work_link (board_id,from_id,type,to_board_id,to_id,at,seq)
 SELECT 'source','link'||n,'relates','unrelated','target','2000',1 FROM generate_series(1,20000) n;
INSERT INTO kickside_work_link (board_id,from_id,type,to_board_id,to_id,at,seq)
 VALUES ('a','same','relates','target-board','target-item','2000',1),('b','same','relates','target-board','target-item','2000',1);
`)
      await psql(`SET search_path TO ${schema}; BEGIN; ${cleanup.join(';')}; ROLLBACK;`)
      await psql(`SET search_path TO ${schema}; BEGIN; ${cleanup.join(';')}; COMMIT;`)
      const plan = await psql(`SET search_path TO ${schema}; ANALYZE kickside_work_comment; ANALYZE kickside_work_link;
EXPLAIN SELECT comment_id FROM kickside_work_comment WHERE board_id='board' AND item_id='purged' ORDER BY comment_id LIMIT 100;
EXPLAIN SELECT comment_id FROM kickside_work_comment WHERE board_id='board' AND deleted=1 AND edited_at<'2026' ORDER BY edited_at,comment_id LIMIT 100;
EXPLAIN SELECT board_id,from_id,type,to_board_id,to_id FROM kickside_work_link WHERE to_board_id='target-board' ORDER BY to_id,board_id,from_id,type LIMIT 100;`)
      assert.match(plan, /kickside_work_comment_purge/)
      assert.match(plan, /kickside_work_link_target/)
      assert.match(plan, /kickside_work_comment_deleted/)
      assert.doesNotMatch(plan, /Sort|Seq Scan/)
      const upgraded = await psql(`SET search_path TO ${schema};
SELECT SUM(purge_pending) FROM kickside_work_item;
SELECT failed_at FROM kickside_work_job WHERE job_id='failed-job';
SELECT count(*) FROM pg_indexes WHERE schemaname='${schema}' AND indexname='kickside_work_comment_purge';
BEGIN; ${cleanupDown.join(';')}; COMMIT;
BEGIN; ${boundedDown.join(';')}; COMMIT;
SELECT count(*) FROM information_schema.columns WHERE table_schema='${schema}' AND column_name IN ('purge_pending','failed_at');`)
      assert.deepEqual(upgraded.trim().split('\n'), ['1','2026-11-14T00:00:00.000000000Z','1','0'])
    } finally { await psql(`DROP SCHEMA ${schema} CASCADE;`) }
  })

test('purged comments and incoming board links have bounded ordered seeks on a populated board', async () => {
  const initial = await statements('01_work', 'up')
  // Extract published predecessor indexes; migration 03 also enrolls native jobs,
  // which this SQL-only access-path proof does not execute.
  const { readFile } = await import('node:fs/promises')
  const hardening = await readFile(resolve(root, 'src/migrations/03_hardening.lua'), 'utf8')
  const indexes = [...hardening.matchAll(/execute\(db,"(CREATE INDEX [^"]+)"\)/g)].map(m => m[1]).filter(sql => sql.includes('kickside_work_comment'))
  const { existsSync } = await import('node:fs')
  const upgrade = existsSync(resolve(root, 'src/migrations/05_cleanup_seeks.lua')) ? await statements('05_cleanup_seeks', 'up') : []
  const source = await readFile(resolve(root, 'src/retention/rows.lua'), 'utf8')
  assert.match(source, /local where=item_id and "item_id=\$2"/)
  assert.match(source, /local order=item_id and "comment_id"/)
  const lifecycle = await readFile(resolve(root, 'src/persist/lifecycle.lua'), 'utf8')
  assert.match(lifecycle, /"board_id, from_id, type, to_board_id, to_id", "to_board_id = \$1"/)
  assert.match(lifecycle, /"to_id, board_id, from_id, type"/)
  const rollback = upgrade.length ? await statements('05_cleanup_seeks', 'down') : []
  const result = await run('python3', ['-c', `
import json,sqlite3,sys
initial,indexes,upgrade,rollback=json.load(sys.stdin)
db=sqlite3.connect(':memory:')
for sql in initial+indexes: db.execute(sql)
for i in range(20000):
 db.execute("INSERT INTO kickside_work_comment (board_id,comment_id,item_id,body,mentions,author,version,deleted,created_at) VALUES (?,?,?,?,?,?,1,?,?)",('board',f'c{i:06d}','unrelated','body','[]','fixture',i%2,'2000'))
 db.execute("UPDATE kickside_work_comment SET edited_at='2000' WHERE comment_id=?",(f'c{i:06d}',))
db.execute("INSERT INTO kickside_work_comment (board_id,comment_id,item_id,body,mentions,author,version,deleted,created_at) VALUES ('board','z-dead','purged','body','[]','fixture',1,0,'2000')")
for i in range(20000):
 db.execute("INSERT INTO kickside_work_link VALUES (?,?,?,?,?,?,?)",('source',f'link{i:06d}','relates','unrelated','target','2000',1))
for source in ('a','b'):
 for kind in ('blocks','relates'):
  db.execute("INSERT INTO kickside_work_link VALUES (?,?,?,?,?,?,?)",(source,'same',kind,'target-board','target-item','2000',1))
db.commit()
# Transactional migration retry and populated rollback preserve predecessor indexes.
db.execute('BEGIN')
for sql in upgrade: db.execute(sql)
db.rollback()
assert not db.execute("SELECT 1 FROM sqlite_master WHERE name='kickside_work_comment_purge'").fetchall()
for sql in upgrade: db.execute(sql)
query='SELECT comment_id FROM kickside_work_comment WHERE board_id=$1 AND item_id=$2 ORDER BY comment_id LIMIT $3'
plans=[]
for analyzed in (False,True):
 if analyzed: db.execute('ANALYZE')
 plan=db.execute('EXPLAIN QUERY PLAN '+query,('board','purged',100)).fetchall()
 plans.append(plan)
 assert not any('TEMP B-TREE' in row[3] for row in plan),plan
 assert any('board_id=? AND item_id=?' in row[3] for row in plan),plan
 ticks=[0]
 def tick(): ticks[0]+=1;return 0
 db.set_progress_handler(tick,1)
 assert db.execute(query,('board','purged',100)).fetchall()==[('z-dead',)]
 db.set_progress_handler(None,0)
 assert ticks[0]<100, ticks
 deleted='SELECT comment_id FROM kickside_work_comment WHERE board_id=$1 AND deleted=1 AND edited_at<$2 ORDER BY edited_at,comment_id LIMIT $3'
 plan=db.execute('EXPLAIN QUERY PLAN '+deleted,('board','2026',100)).fetchall()
 assert not any('TEMP B-TREE' in row[3] for row in plan),plan
 assert any('kickside_work_comment_deleted' in row[3] for row in plan),plan
 incoming='SELECT board_id,from_id,type,to_board_id,to_id FROM kickside_work_link WHERE to_board_id=$1 ORDER BY to_id,board_id,from_id,type LIMIT $2'
 plan=db.execute('EXPLAIN QUERY PLAN '+incoming,('target-board',3)).fetchall()
 assert not any('TEMP B-TREE' in row[3] for row in plan),plan
 assert any('kickside_work_link_target' in row[3] and 'to_board_id=?' in row[3] for row in plan),plan
 rows=db.execute(incoming,('target-board',3)).fetchall()
 assert len(rows)==3 and len(set(rows))==3
for sql in rollback: db.execute(sql)
assert not db.execute("SELECT 1 FROM sqlite_master WHERE name='kickside_work_comment_purge'").fetchall()
assert db.execute("SELECT sql FROM sqlite_master WHERE name='kickside_work_link_target'").fetchone()[0].endswith('(to_board_id, to_id)')
assert db.execute('SELECT count(*) FROM kickside_work_comment').fetchone()[0]==20001
assert db.execute('SELECT count(*) FROM kickside_work_link').fetchone()[0]==20004
print(json.dumps(plans))
`], {}, JSON.stringify([initial, indexes, upgrade, rollback]))
  assert.ok(JSON.parse(result).length === 2)
})

// Tie-heavy populations expose a partial ORDER BY index even with LIMIT 1.
test('every age-retention class has a populated eligibility and complete-order seek', async () => {
  const { readFile } = await import('node:fs/promises')
  const { existsSync } = await import('node:fs')
  const initial = await statements('01_work', 'up')
  const bounded = await statements('04_bounded_retention', 'up')
  const hardening = await readFile(resolve(root, 'src/migrations/03_hardening.lua'), 'utf8')
  const indexes = [...hardening.matchAll(/execute\(db,"(CREATE INDEX [^"]+)"\)/g)].map(m => m[1])
  const cleanup = await statements('05_cleanup_seeks', 'up')
  const upgrade = existsSync(resolve(root, 'src/migrations/06_age_seeks.lua')) ? await statements('06_age_seeks', 'up') : []
  const downgrade = upgrade.length ? await statements('06_age_seeks','down') : []
  const result = await run('python3', ['-c', `
import json,sqlite3,sys
initial,bounded,indexes,cleanup,upgrade,downgrade=json.load(sys.stdin)
db=sqlite3.connect(':memory:')
for sql in initial: db.execute(sql)
db.execute("ALTER TABLE kickside_work_visibility ADD COLUMN at text NOT NULL DEFAULT ''")
for sql in indexes+bounded+cleanup+upgrade: db.execute(sql)
def insert(table,values):
 cols=db.execute('PRAGMA table_info(kickside_work_'+table+')').fetchall()
 payload={c[1]:(0 if c[2].upper() in ('INTEGER','BIGINT') else '') for c in cols if c[3] and c[4] is None}
 payload.update(values)
 db.execute('INSERT INTO kickside_work_'+table+' ('+','.join(payload)+') VALUES ('+','.join('?' for _ in payload)+')',list(payload.values()))
insert('board',dict(board_id='board',generation=30000))
for n in range(20000):
 key=f'{n:06d}'
 insert('change',dict(board_id='board',at='2000',seq=1,n=n,kind='field',subject='i:'+key))
 insert('receipt',dict(board_id='board',at='2000',command_key='plain/'+key))
 insert('key_alias',dict(board_id='board',at='2000',key=key))
 insert('interval',dict(board_id='board',ended_at='2000',item_id=key,field_id=1,start_seq=1))
 insert('generation',dict(board_id='board',applied_at='2000',generation=n))
 insert('approval',dict(board_id='board',at='2000',item_id=key,visit=1,actor='fixture'))
 insert('stage_run',dict(board_id='board',started='2000',item_id=key,visit=1,attempt=1))
 insert('job',dict(board_id='board',failed_at='2000',job_id=key,status='failed',job_type='migration'))
 insert('visibility',dict(board_id='board',at='2000',seq=n,item_id=key))
 insert('item',dict(board_id='baseline',item_id=key,number=n,life='live'))
 insert('visibility',dict(board_id='baseline',item_id=key,seq=n,at='2000'))
 insert('item',dict(board_id='board',item_id=key,number=n,life='purged',life_at='2000',purge_pending=0))
 insert('comment',dict(board_id='board',comment_id=key,item_id=key,deleted=1,edited_at='2000'))
 insert('operation',dict(board_id='board',operation_id=key,key=key,kind='bulk',status='done',actor_context=json.dumps(dict(captured_at='2000-01-01T00:00:00Z'))))
queries=[
 ('change','board_id=? AND at<?','at,seq,n'),
 ('receipt','board_id=? AND at<?','at,command_key'),
 ('key_alias','board_id=? AND at<?','at,key'),
 ('interval','board_id=? AND ended_at<?','ended_at,item_id,field_id,start_seq'),
 ('generation',"board_id=? AND applied_at<? AND generation<(SELECT generation FROM kickside_work_board WHERE board_id='board') AND NOT EXISTS (SELECT 1 FROM kickside_work_item i WHERE i.board_id='board' AND i.life IN ('live','trashed') AND i.process_generation<=kickside_work_generation.generation) AND NOT EXISTS (SELECT 1 FROM kickside_work_job j WHERE j.board_id='board' AND j.status BETWEEN 'pending' AND 'running')",'applied_at,generation'),
 ('approval',"board_id=? AND at<? AND NOT EXISTS (SELECT 1 FROM kickside_work_item i WHERE i.board_id='board' AND i.item_id=kickside_work_approval.item_id AND i.life<>'purged' AND COALESCE(json_extract(i.process_data,'$.visit'),i.visit)=kickside_work_approval.visit)",'at,item_id,visit,actor'),
 ('stage_run',"board_id=? AND COALESCE(finished,started)<? AND NOT EXISTS (SELECT 1 FROM kickside_work_item i WHERE i.board_id='board' AND i.item_id=kickside_work_stage_run.item_id AND i.life<>'purged')",'COALESCE(finished,started),item_id,visit,attempt'),
 ('job',"board_id=? AND status='failed' AND job_type NOT IN ('reindex','recompute') AND failed_at<?",'failed_at,job_id'),
 ('visibility','board_id=? AND seq>0 AND at<?','seq,item_id'),
 ('item',"board_id=? AND life<>'live' AND life='purged' AND purge_pending=0 AND life_at<?",'life_at,item_id'),
 ('comment','board_id=? AND deleted=1 AND edited_at<?','edited_at,comment_id'),
 ('operation',"board_id=? AND status IN ('done','cancelled','failed') AND (substr(json_extract(actor_context, '$.captured_at'), 1, 19) || '.000000000Z')<?","(substr(json_extract(actor_context, '$.captured_at'), 1, 19) || '.000000000Z'),operation_id"),
]
plans=[]
for analyzed in (False,True):
 if analyzed: db.execute('ANALYZE')
 for table,where,order in queries:
  sql='SELECT * FROM kickside_work_'+table+' WHERE '+where+' ORDER BY '+order+' LIMIT 1'
  plan=db.execute('EXPLAIN QUERY PLAN '+sql,('board','2026')).fetchall()
  assert not any('TEMP B-TREE' in row[3] for row in plan),(table,plan)
  ticks=[0]
  def tick(): ticks[0]+=1;return 0
  db.set_progress_handler(tick,1)
  assert len(db.execute(sql,('board','2026')).fetchall())==1,table
  db.set_progress_handler(None,0)
  assert ticks[0]<1000,(table,ticks,plan)
  plans.append([table,analyzed,ticks[0],plan])
for sql in downgrade: db.execute(sql)
assert db.execute("SELECT sql FROM sqlite_master WHERE name='kickside_work_change_at'").fetchone()[0].endswith('(board_id, at)')
assert db.execute('SELECT COUNT(*) FROM kickside_work_change').fetchone()[0]==20000
print(json.dumps(plans))
`], {}, JSON.stringify([initial,bounded,indexes,cleanup,upgrade,downgrade]))
  assert.equal(JSON.parse(result).length,24)
})

test('an idle page over 20000 visibility baselines examines only a keyset candidate page', async () => {
  const { readFile } = await import('node:fs/promises')
  const source = await readFile(resolve(root,'src/retention/rows.lua'),'utf8')
  const candidate = source.match(/local candidates,candidate_err=tx:query\(\[\[([\s\S]*?)\]\]/)?.[1]
  assert.ok(candidate,'visibility candidates must be limited before eligibility filtering')
  const deletion = source.match(/local deleted,delete_err=tx:query\(\[\[([\s\S]*?)\]\]/)?.[1]
  const age = source.match(/local aged, age_err = tx:query\(\[\[([\s\S]*?)\]\]/)?.[1]
  const initial = await statements('01_work','up')
  const bounded = await statements('04_bounded_retention','up')
  const result = await run('python3',['-c',`
import json,sqlite3,sys
initial,bounded,candidate,deletion,age=json.load(sys.stdin)
db=sqlite3.connect(':memory:')
for sql in initial: db.execute(sql)
db.execute("ALTER TABLE kickside_work_visibility ADD COLUMN at text NOT NULL DEFAULT ''")
db.execute("CREATE INDEX kickside_work_visibility_age ON kickside_work_visibility (board_id,at,seq)")
for sql in bounded: db.execute(sql)
cols=db.execute('PRAGMA table_info(kickside_work_item)').fetchall()
base={c[1]:(0 if c[2].upper() in ('INTEGER','BIGINT') else '') for c in cols if c[3] and c[4] is None}
for n in range(20000):
 key=f'{n:06d}'
 payload=dict(base,board_id='board',item_id=key,number=n,life='live')
 db.execute('INSERT INTO kickside_work_item ('+','.join(payload)+') VALUES ('+','.join('?' for _ in payload)+')',list(payload.values()))
 db.execute("INSERT INTO kickside_work_visibility VALUES (?,?,?,'{}','2000')",('board',key,20000+n))
# Future snapshots must also be candidate-limited before age eligibility.
for n in range(20000):
 db.execute("INSERT INTO kickside_work_visibility VALUES (?,?,?,'{}','2099')",('future',f'{n:06d}',n+1))
ticks=[0]
def future_tick():ticks[0]+=1;return 0
db.set_progress_handler(future_tick,1)
# Both selector forms share a five-parameter probe only after candidate limiting.
if 'at<$3' in age:
 db.execute(age,('future',0,'2026',100)).fetchall()
else:
 assert len(db.execute(age,('future',0,0,'',100)).fetchall())==100
db.set_progress_handler(None,0)
assert ticks[0]<10000,('future visibility scan',ticks)
# An obsolete row behind 19999 surviving baselines still gets collected.
db.execute("INSERT INTO kickside_work_visibility VALUES ('board','019999',39998,'{}','2000')")
metrics=[]
for analyzed in (False,True):
 if analyzed: db.execute('ANALYZE')
 for anchor in ((-1,''),(20049,'000049'),(39997,'019997')):
  ticks=[0]
  def tick():ticks[0]+=1;return 0
  db.set_progress_handler(tick,1)
  assert db.execute(age,('board',40000,40000,'',100)).fetchall()==[]
  rows=db.execute(candidate,('board',40000,*anchor,50)).fetchall()
  deleted=0
  for item,seq in rows:
   deleted+=len(db.execute(deletion,('board',item,seq,40000)).fetchall())
  db.set_progress_handler(None,0)
  assert len(rows)<=50 and ticks[0]<10000,(len(rows),ticks)
  metrics.append([analyzed,anchor,len(rows),deleted,ticks[0]])
 assert db.execute("SELECT COUNT(*) FROM kickside_work_visibility WHERE board_id='board'").fetchone()[0]==20000
print(json.dumps(metrics))
`],{},JSON.stringify([initial,bounded,candidate,deletion,age]))
  assert.equal(JSON.parse(result).length,6)
})

test('PostgreSQL age selectors use complete populated ordered indexes and survive rollback',
  {skip: !process.env.WORK_MIGRATION_POSTGRES}, async () => {
    const initial = await statements('01_work','up','postgres')
    const bounded = await statements('04_bounded_retention','up','postgres')
    const upgrade = await statements('06_age_seeks','up','postgres')
    const down = await statements('06_age_seeks','down','postgres')
    const schema = `work_age_${process.pid}`
    async function psql(script) {
      const args=['exec','-i','kickside-test-pg','psql','-X','-qAt','-v','ON_ERROR_STOP=1','-U','kickside','-d','kickside_test_work']
      return process.env.WORK_MIGRATION_SSH ? run('ssh',[process.env.WORK_MIGRATION_SSH,'docker',...args],{},script) : run('docker',args,{},script)
    }
    const key="lpad(n::text,6,'0')"
    const at="'2000'"
    const tables=[
      ['change',{seq:'1',n:'n',at}],
      ['receipt',{command_key:key,at}],
      ['key_alias',{key,at}],
      ['interval',{item_id:key,ended_at:at}],
      ['generation',{generation:'n',applied_at:at}],
      ['approval',{item_id:key,at}],
      ['stage_run',{item_id:key,started:at}],
      ['job',{job_id:key,status:"'failed'",job_type:"'migration'",failed_at:at}],
      ['item',{item_id:key,number:'n',life:"'purged'",life_at:at}],
      ['comment',{comment_id:key,deleted:'1',edited_at:at}],
      ['operation',{operation_id:key,key,kind:"'bulk'",status:"'done'",actor_context:`'${JSON.stringify({captured_at:'2000-01-01T00:00:00Z'})}'`}],
    ].map(([name,values])=>({name:`kickside_work_${name}`,values:{board_id:"'board'",...values}}))
    const queries=[
      ['change',"at<'2026'",'at,seq,n','change_at'],
      ['receipt',"at<'2026'",'at,command_key','receipt_expiry'],
      ['key_alias',"at<'2026'",'at,key','key_alias_expiry'],
      ['interval',"ended_at<'2026'",'ended_at,item_id,field_id,start_seq','interval_expiry'],
      ['generation',"applied_at<'2026'",'applied_at,generation','generation_expiry'],
      ['approval',"at<'2026'",'at,item_id,visit,actor','approval_age'],
      ['stage_run',"COALESCE(finished,started)<'2026'",'COALESCE(finished,started),item_id,visit,attempt','stage_run_age'],
      ['job',"status='failed' AND job_type NOT IN ('reindex','recompute') AND failed_at<'2026'",'failed_at,job_id','job_failed'],
      ['item',"life<>'live' AND life='purged' AND purge_pending=0 AND life_at<'2026'",'life_at,item_id','item_expiry'],
      ['comment',"deleted=1 AND edited_at<'2026'",'edited_at,comment_id','comment_deleted'],
      ['operation',"status IN ('done','cancelled','failed') AND (substr((actor_context::jsonb ->> 'captured_at'), 1, 19) || '.000000000Z')<'2026'","(substr((actor_context::jsonb ->> 'captured_at'), 1, 19) || '.000000000Z'),operation_id",'operation_expiry'],
      ['visibility',"seq>0 AND at<'2026'",'seq,item_id','visibility_floor'],
    ]
    await psql(`CREATE SCHEMA ${schema};`)
    try {
      await psql(`SET search_path TO ${schema}; ${initial.join(';')}; ${bounded.join(';')};
ALTER TABLE kickside_work_visibility ADD COLUMN at text NOT NULL DEFAULT '';
CREATE INDEX kickside_work_visibility_age ON kickside_work_visibility (board_id,at,seq);
CREATE INDEX kickside_work_comment_deleted ON kickside_work_comment (board_id,edited_at,comment_id) WHERE deleted=1;
DO $fixture$
DECLARE entry jsonb; columns text; expressions text;
BEGIN
FOR entry IN SELECT value FROM jsonb_array_elements($seed$${JSON.stringify(tables)}$seed$::jsonb)
LOOP
 SELECT string_agg(quote_ident(column_name),',' ORDER BY ordinal_position),
        string_agg(COALESCE(entry->'values'->>column_name,CASE WHEN data_type IN ('bigint','integer','smallint') THEN '0' ELSE quote_literal('') END),',' ORDER BY ordinal_position)
 INTO columns,expressions FROM information_schema.columns
 WHERE table_schema=current_schema() AND table_name=entry->>'name'
 AND ((is_nullable='NO' AND column_default IS NULL) OR entry->'values' ? column_name);
 EXECUTE format('INSERT INTO %I (%s) SELECT %s FROM generate_series(1,20000) n',entry->>'name',columns,expressions);
END LOOP;
END $fixture$;
INSERT INTO kickside_work_visibility SELECT 'board',lpad(n::text,6,'0'),n,'{}','2000' FROM generate_series(1,20000) n;
BEGIN; ${upgrade.join(';')}; ROLLBACK;
BEGIN; ${upgrade.join(';')}; COMMIT;`)
      for (const analyzed of [false,true]) {
        if(analyzed) await psql(`SET search_path TO ${schema}; ANALYZE;`)
        for(const [name,where,order,index] of queries) {
          const plan=await psql(`SET search_path TO ${schema}; EXPLAIN SELECT * FROM kickside_work_${name} WHERE board_id='board' AND ${where} ORDER BY ${order} LIMIT 1;`)
          assert.match(plan,new RegExp(`kickside_work_${index}`),`${name}: ${plan}`)
          assert.doesNotMatch(plan,/Sort|Seq Scan/,`${name}: ${plan}`)
        }
      }
      await psql(`SET search_path TO ${schema}; BEGIN; ${down.join(';')}; COMMIT;`)
      const kept=await psql(`SET search_path TO ${schema}; SELECT COUNT(*) FROM kickside_work_change; SELECT indexdef FROM pg_indexes WHERE schemaname='${schema}' AND indexname='kickside_work_change_at';`)
      assert.match(kept,/20000/);assert.match(kept,/\(board_id, at\)/)
    } finally { await psql(`DROP SCHEMA ${schema} CASCADE;`) }
  })


// Execute the actual candidate SQL builder and collection declarations under Lua;
// measure rows inspected against retained populations, not merely returned rows.
test('round 8 candidate protection and future deadlines stay bounded on 20000 retained rows', async () => {
  const {readFile} = await import('node:fs/promises')
  const source = await readFile(resolve(root,'src/retention/rows.lua'),'utf8')
  const expiry = await readFile(resolve(root,'src/persist/operation_expiry.lua'),'utf8')
  const builder = source.match(/function M.candidate_statement[^\n]*\n([\s\S]*?)\nend/)[1]
  const past = source.match(/local function past_visit[^\n]*\n([\s\S]*?)\nend/)[1]
  const entries = source.match(/local pages: \{types.Collection\} = (\{[\s\S]*?\n        \})/)[1]
  const constants = expiry.slice(expiry.indexOf('M.TERMINAL ='),expiry.indexOf('function M.at'))
  const captureCollections = async dialect => run('lua',['-'],{},`
local M={}
${constants}
local operation_expiry=M
function M.candidate_statement(name,projection,where,order,protection,seek,mark,later,equal_order)
${builder}
end
local function past_visit(name,dialect,counters)
${past}
end
local effective={tombstone_days=1,audit_days=1,interval_days=1}
local event_days,dialect=1,'${dialect}'
local pages=${entries}
for _,e in ipairs(pages) do
 local order=e.order or e.keys
 local projection='*' .. (e.age and (', ' .. e.age .. ' AS retention_at') or '')
 local columns=e.age .. ', ' .. e.keys
 local n=0
 for key in e.keys:gmatch('[%w_]+') do n=n+1 end
 local marks={}
 for i=1,n+1 do marks[i]='$' .. (i+2) end
 local seek=' AND (' .. columns .. ')>(' .. table.concat(marks,',') .. ')'
 local later=nil
 if e.age:find('COALESCE',1,true) then
  later=' AND ' .. e.age .. '>' .. marks[1]
  local rest={}
  for i=2,#marks do rest[#rest+1]=marks[i] end
  seek=' AND ' .. e.age .. '=' .. marks[1] .. ' AND (' .. e.keys .. ')>(' .. table.concat(rest,',') .. ')'
 end
 io.write(e.name,'\\0',M.candidate_statement(e.name,projection,e.where,order,e.protection or '1=1','','$3'),'\\0',M.candidate_statement(e.name,projection,e.where,order,e.protection or '1=1',seek,'$' .. (n+4),later,e.keys),'\\0')
end
`)
  const captured=await captureCollections('sqlite')
  const chunks=captured.split('\0').filter(Boolean)
  const queries=[]
  for(let i=0;i<chunks.length;i+=3)queries.push(chunks.slice(i,i+3))
  const initial=await statements('01_work','up')
  const bounded=await statements('04_bounded_retention','up')
  const age=await statements('06_age_seeks','up')
  const result=await run('python3',['-c',`
import json,sqlite3,sys
initial,bounded,age,queries=json.load(sys.stdin)
db=sqlite3.connect(':memory:');db.row_factory=sqlite3.Row
for q in initial+bounded+age:db.execute(q)
def insert(table,values):
 cols=db.execute('PRAGMA table_info('+table+')').fetchall()
 data={c[1]:(0 if c[2].upper() in ('INTEGER','BIGINT') else '') for c in cols if c[3] and c[4] is None}
 data.update(values)
 db.execute('INSERT INTO '+table+' ('+','.join(data)+') VALUES ('+','.join('?' for _ in data)+')',list(data.values()))
insert('kickside_work_board',dict(board_id='board',generation=30000))
insert('kickside_work_item',dict(board_id='board',item_id='item',life='live',process_generation=1,visit=1,process_data='{}'))
owner='11111111-1111-1111-1111-111111111111'
insert('kickside_work_operation',dict(board_id='board',operation_id=owner,kind='bulk',key='owner',status='pending'))
for n in range(20000):
 key=f'{n:06d}'
 for table,values in [
  ('generation',dict(generation=n+1,applied_at='2000')),
  ('approval',dict(item_id='item',visit=1,actor=key,at='2000')),
  ('stage_run',dict(item_id='item',visit=1,attempt=n,started='2000')),
  ('receipt',dict(command_key='bulk/'+owner+'/'+key,at='2000')),
  ('key_alias',dict(key=key,at='2000')),
  ('change',dict(seq=1,n=n,at='2000')),
  ('interval',dict(item_id=key,ended_at='2000')),
  ('job',dict(job_id=key,status='failed',job_type='reindex',failed_at='2000')),
 ]:insert('kickside_work_'+table,dict(board_id='board',**values))
metrics=[]
for analyzed in (False,True):
 if analyzed:db.execute('ANALYZE')
 for name,first,continued in queries:
  params=['board','2026',1]
  initial_row=db.execute(first,params).fetchone()
  assert initial_row is not None,name
  # Exact SQL pages at first/middle/last positions. The actual retained-row
  # keysets below include the age and every PK tie-breaker in production order.
  keys={
   'receipt':lambda n:['2000','bulk/'+owner+'/'+f'{n:06d}'],
   'key_alias':lambda n:['2000',f'{n:06d}'],
   'change':lambda n:['2000',1,n],
   'interval':lambda n:['2000',f'{n:06d}','',0],
   'generation':lambda n:['2000',n+1],
   'approval':lambda n:['2000','item',1,f'{n:06d}'],
   'stage_run':lambda n:['2000','item',1,n],
   'job':lambda n:['2000',f'{n:06d}'],
  }[name.removeprefix('kickside_work_')]
  for anchor in (None,9999,19998):
   q=first if anchor is None else continued
   args=params if anchor is None else ['board','2026',*keys(anchor),1]
   plan=[r[3] for r in db.execute('EXPLAIN QUERY PLAN '+q,args)]
   assert any('SEARCH '+name+' USING INDEX' in p for p in plan),(name,plan)
   if name!='kickside_work_stage_run':assert not any('TEMP B-TREE' in p for p in plan),(name,plan)
   ticks=[0]
   def tick():ticks[0]+=1;return 0
   db.set_progress_handler(tick,1);rows=db.execute(q,args).fetchall();db.set_progress_handler(None,0)
   assert len(rows)==1 and ticks[0]<1500,(name,anchor,ticks,plan)
   if name in ('kickside_work_receipt','kickside_work_generation','kickside_work_approval','kickside_work_stage_run'):assert rows[0]['eligible']==0,(name,dict(rows[0]))
   metrics.append([name,analyzed,anchor,ticks[0]])
print(json.dumps(metrics))
`],{},JSON.stringify([initial,bounded,age,queries]))
  const metrics=JSON.parse(result)
  console.log("round8 collection maxima",Object.fromEntries([...new Set(metrics.map(m=>m[0]))].map(name=>[name,Math.max(...metrics.filter(m=>m[0]===name).map(m=>m[3]))])))
  assert.equal(metrics.length,48)
  if (process.env.WORK_MIGRATION_POSTGRES) {
    const chunks=(await captureCollections('postgres')).split('\0').filter(Boolean)
    const owner='11111111-1111-1111-1111-111111111111'
    const keys={receipt:n=>['2000',`bulk/${owner}/${String(n).padStart(6,'0')}`],key_alias:n=>['2000',String(n).padStart(6,'0')],change:n=>['2000',1,n],interval:n=>['2000',String(n).padStart(6,'0'),'',0],generation:n=>['2000',n+1],approval:n=>['2000','item',1,String(n).padStart(6,'0')],stage_run:n=>['2000','item',1,n],job:n=>['2000',String(n).padStart(6,'0')]}
    const quote=value=>typeof value==='number'?String(value):`'${String(value).replaceAll("'","''")}'`
    const checks=[]
    for(let i=0;i<chunks.length;i+=3) {
      const name=chunks[i].replace('kickside_work_','')
      for(const anchor of [null,9999,19998]) {
        const args=anchor===null?['board','2026',1]:['board','2026',...keys[name](anchor),1]
        const q=chunks[i+(anchor===null?1:2)].replace(/\$(\d+)/g,(_,n)=>quote(args[Number(n)-1]))
        checks.push({name,sql:q,protected:['receipt','generation','approval','stage_run'].includes(name)})
      }
    }
    const pgInitial=await statements('01_work','up','postgres'),pgBounded=await statements('04_bounded_retention','up','postgres'),pgAge=await statements('06_age_seeks','up','postgres')
    const key="lpad((n-1)::text,6,'0')",at="'2000'"
    const tables=[
      ['board',{board_id:"'board'",generation:'30000'},1],
      ['item',{board_id:"'board'",item_id:"'item'",life:"'live'",process_generation:'1',visit:'1',process_data:"'{}'"},1],
      ['operation',{board_id:"'board'",operation_id:quote(owner),kind:"'bulk'",key:"'owner'",status:"'pending'",actor_context:"'{}'"},1],
      ['generation',{generation:'n',applied_at:at}],
      ['approval',{item_id:"'item'",visit:'1',actor:key,at}],
      ['stage_run',{item_id:"'item'",visit:'1',attempt:'n-1',started:at}],
      ['receipt',{command_key:`'bulk/${owner}/' || ${key}`,at}],
      ['key_alias',{key,at}],['change',{seq:'1',n:'n-1',at}],
      ['interval',{item_id:key,ended_at:at}],
      ['job',{job_id:key,status:"'failed'",job_type:"'reindex'",failed_at:at}],
    ].map(([name,values,count])=>({name:`kickside_work_${name}`,values:{board_id:"'board'",...values},count:count||20000}))
    const schema=`work_protected_${process.pid}`
    async function psql(script) {
      const args=['exec','-i','kickside-test-pg','psql','-X','-qAt','-v','ON_ERROR_STOP=1','-U','kickside','-d','kickside_test_work']
      return process.env.WORK_MIGRATION_SSH?run('ssh',[process.env.WORK_MIGRATION_SSH,'docker',...args],{},script):run('docker',args,{},script)
    }
    await psql(`CREATE SCHEMA ${schema};`)
    try {
      await psql(`SET search_path TO ${schema}; ${pgInitial.join(';')}; ${pgBounded.join(';')}; ${pgAge.join(';')};
DO $fixture$
DECLARE entry jsonb; columns text; expressions text;
BEGIN
FOR entry IN SELECT value FROM jsonb_array_elements($seed$${JSON.stringify(tables)}$seed$::jsonb)
LOOP
 SELECT string_agg(quote_ident(column_name),',' ORDER BY ordinal_position),
        string_agg(COALESCE(entry->'values'->>column_name,CASE WHEN data_type IN ('bigint','integer','smallint') THEN '0' ELSE quote_literal('') END),',' ORDER BY ordinal_position)
 INTO columns,expressions FROM information_schema.columns
 WHERE table_schema=current_schema() AND table_name=entry->>'name'
 AND ((is_nullable='NO' AND column_default IS NULL) OR entry->'values' ? column_name);
 EXECUTE format('INSERT INTO %I (%s) SELECT %s FROM generate_series(1,%s) n',entry->>'name',columns,expressions,entry->>'count');
END LOOP;
END $fixture$;
DO $plans$
DECLARE entry jsonb; plan jsonb; node jsonb; inspected numeric; eligible integer; analyzed integer;
BEGIN
FOR analyzed IN 0..1 LOOP
 IF analyzed=1 THEN
  FOR entry IN SELECT to_jsonb(t) FROM pg_tables t WHERE schemaname=current_schema() LOOP
   EXECUTE format('ANALYZE %I.%I',current_schema(),entry->>'tablename');
  END LOOP;
 END IF;
 FOR entry IN SELECT value FROM jsonb_array_elements($checks$${JSON.stringify(checks)}$checks$::jsonb) LOOP
  EXECUTE 'EXPLAIN (ANALYZE,BUFFERS,FORMAT JSON) ' || (entry->>'sql') INTO plan;
  FOR node IN WITH RECURSIVE nodes(n) AS (
    SELECT plan->0->'Plan' UNION ALL SELECT child FROM nodes,LATERAL jsonb_array_elements(COALESCE(n->'Plans','[]'::jsonb)) child
  ) SELECT n FROM nodes LOOP
   inspected=(COALESCE((node->>'Actual Rows')::numeric,0)+COALESCE((node->>'Rows Removed by Filter')::numeric,0)+COALESCE((node->>'Rows Removed by Index Recheck')::numeric,0))*COALESCE((node->>'Actual Loops')::numeric,0);
   IF inspected>100 THEN RAISE EXCEPTION 'unbounded protected % inspected=% plan=%',entry->>'name',inspected,plan; END IF;
  END LOOP;
  IF (entry->>'protected')::boolean THEN
   EXECUTE 'SELECT eligible FROM (' || (entry->>'sql') || ') checked' INTO eligible;
   IF eligible<>0 OR eligible IS NULL THEN RAISE EXCEPTION 'lost protection %',entry->>'name'; END IF;
  END IF;
 END LOOP;
END LOOP;
END $plans$;`)
      console.log('round8 PostgreSQL protected plans: 48 populated first/middle/late pages passed')
    } finally {await psql(`DROP SCHEMA ${schema} CASCADE;`)}
  }

})


test('round 8 every future deadline is one bounded populated index seek', async () => {
  const {readFile}=await import('node:fs/promises')
  const source=await readFile(resolve(root,'src/retention/rows.lua'),'utf8')
  const expiry=await readFile(resolve(root,'src/persist/operation_expiry.lua'),'utf8')
  const constants=expiry.slice(expiry.indexOf('M.TERMINAL ='),expiry.indexOf('function M.at'))
  const at=expiry.match(/function M.at[^\n]*\n([\s\S]*?)\nend/)[1]
  const deadline=source.slice(source.indexOf('function M.deadline'),source.lastIndexOf('return M'))
    .replace(/^function M.deadline[^\n]*/,'function M.deadline(db,board_id,effective)')
    .replace(/local earliest: integer\?/,'local earliest')
    .replace(/local params: domain.SqlParams/,'local params')
    .replace(/ :: integer/g,'')
  const captured=await run('lua',['-'],{},`
local M={}
${constants}
function M.at(dialect)
${at}
end
local operation_expiry=M
local policy={event_days=function()return 1,nil end}
local clock={offset=function()return '2026' end}
${deadline}
local db={type=function()return 'sqlite' end,query=function(_,q,params)
 io.write(q,'\\0',params[3] or '', '\\0');return {},nil
end}
M.deadline(db,'future',{trash_days=1,tombstone_days=1,audit_days=1,interval_days=1})
`)
  const bits=captured.split('\0');const queries=[]
  for(let i=0;i<bits.length-1;i+=2)queries.push([bits[i],bits[i+1]])
  assert.equal(queries.length,13)
  const initial=await statements('01_work','up'),bounded=await statements('04_bounded_retention','up'),age=await statements('06_age_seeks','up')
  const result=await run('python3',['-c',`
import json,sqlite3,sys
initial,bounded,age,queries=json.load(sys.stdin)
db=sqlite3.connect(':memory:')
for q in initial+bounded+age:db.execute(q)
db.execute("ALTER TABLE kickside_work_visibility ADD COLUMN at text NOT NULL DEFAULT ''")
db.execute('CREATE INDEX kickside_work_visibility_age ON kickside_work_visibility(board_id,at,seq)')
db.execute('CREATE INDEX kickside_work_comment_deleted ON kickside_work_comment(board_id,edited_at,comment_id) WHERE deleted=1')
def insert(table,values):
 cols=db.execute('PRAGMA table_info('+table+')').fetchall()
 data={c[1]:(0 if c[2].upper() in ('INTEGER','BIGINT') else '') for c in cols if c[3] and c[4] is None}
 data.update(values)
 db.execute('INSERT INTO '+table+' ('+','.join(data)+') VALUES ('+','.join('?' for _ in data)+')',list(data.values()))
insert('kickside_work_board',dict(board_id='future',generation=1,tombstone_floor_seq=30000))
for n in range(20000):
 key=f'{n:06d}'
 for name,values in [
  ('item',dict(item_id=key,number=n,life='purged' if n%2 else 'trashed',life_at='2099')),
  ('key_alias',dict(key=key,at='2099')),
  ('change',dict(seq=1,n=n,at='2099')),
  ('interval',dict(item_id=key,ended_at='2099')),
  ('generation',dict(generation=n+1,applied_at='2099')),
  ('visibility',dict(item_id=key,seq=n,at='2099')),
  ('comment',dict(comment_id=key,deleted=1,edited_at='2099')),
  ('receipt',dict(command_key=key,at='2099')),
  ('operation',dict(operation_id=key,kind='move',key=key,status='done',actor_context='{"captured_at":"2099-01-01T00:00:00Z"}')),
  ('approval',dict(item_id=key,at='2099')),
  ('stage_run',dict(item_id=key,started='2099')),
  ('job',dict(job_id=key,status='failed',failed_at='2099')),
 ]:insert('kickside_work_'+name,dict(board_id='future',**values))
metrics=[]
for analyzed in (False,True):
 if analyzed:db.execute('ANALYZE')
 for q,state in queries:
  args=['future','2026']+([state] if state else [])
  plan=db.execute('EXPLAIN QUERY PLAN '+q,args).fetchall()
  assert not any('TEMP B-TREE' in p[3] or p[3].startswith('SCAN kickside_work') for p in plan),(q,plan)
  ticks=[0]
  def tick():ticks[0]+=1;return 0
  db.set_progress_handler(tick,1);rows=db.execute(q,args).fetchall();db.set_progress_handler(None,0)
  assert len(rows)==1 and ticks[0]<1000,(q,ticks,plan)
  metrics.append([analyzed,q,ticks[0]])
print(json.dumps(metrics))
`],{},JSON.stringify([initial,bounded,age,queries]))
  console.log("round8 deadline maximum instructions",Math.max(...JSON.parse(result).map(m=>m[2])))
  assert.equal(JSON.parse(result).length,26)
})

// The runtime fixture exercises precisely the batch source in production, with
// deterministic platform clients; refuse stale generated source in that fixture.
test('round 8 plugin probe executes the current production callback source', async () => {
  const {readFile}=await import('node:fs/promises')
  const {parseYamlDocuments}=await import('../../scripts/module-rules.mjs')
  const [fixture]=await parseYamlDocuments([await readFile(resolve(root,'test/src/suites/round8.yaml'),'utf8')])
  const source=await readFile(resolve(root,'src/extensions/plugin_projections.lua'),'utf8')
  assert.equal(fixture.entries.find(e=>e.name==='round8_plugin_batch').source,'file://../round8_plugin_batch.lua')
  assert.equal(await readFile(resolve(root,'test/src/round8_plugin_batch.lua'),'utf8'),source)
})


test('round 8 retained operation and live-prefix discovery inspect candidate pages', async () => {
  const {readFile}=await import('node:fs/promises')
  const expiry=await readFile(resolve(root,'src/persist/operation_expiry.lua'),'utf8')
  const constants=expiry.slice(expiry.indexOf('M.TERMINAL ='),expiry.indexOf('function M.at'))
  const at=expiry.match(/function M.at[^\n]*\n([\s\S]*?)\nend/)[1]
  const selection=expiry.match(/function M.selection[^\n]*\n([\s\S]*?)\nend/)[1]
  const captured=await run('lua',['-'],{},`
local M={}
${constants}
function M.at(dialect)
${at}
end
function M.selection(dialect,named,continuing)
${selection}
end
io.write(M.selection('sqlite','',false),'\\0',M.selection('sqlite','',true),'\\0',M.selection('sqlite',' AND kind=$3 AND key=$4',false))
`)
  const operations=captured.split('\0')
  const lifecycle=await readFile(resolve(root,'src/persist/lifecycle.lua'),'utf8')
  const orphans=lifecycle.match(/local rows, err = db:query\(\[\[(SELECT p\.\*[\s\S]*?)\]\]/)[1]
  const initial=await statements('01_work','up'),bounded=await statements('04_bounded_retention','up'),age=await statements('06_age_seeks','up')
  const result=await run('python3',['-c',`
import json,sqlite3,sys
initial,bounded,age,operations,orphans=json.load(sys.stdin)
db=sqlite3.connect(':memory:');db.row_factory=sqlite3.Row
for q in initial+bounded+age:db.execute(q)
def insert(table,values):
 cols=db.execute('PRAGMA table_info('+table+')').fetchall()
 data={c[1]:(0 if c[2].upper() in ('INTEGER','BIGINT') else '') for c in cols if c[3] and c[4] is None}
 data.update(values)
 db.execute('INSERT INTO '+table+' ('+','.join(data)+') VALUES ('+','.join('?' for _ in data)+')',list(data.values()))
insert('kickside_work_board',dict(board_id='board'))
for n in range(20000):
 key=f'{n:06d}'
 insert('kickside_work_operation',dict(board_id='board',operation_id=key,kind='move',key=key,status='done',actor_context='{"captured_at":"2000-01-01T00:00:00Z"}'))
 insert('kickside_work_item',dict(board_id='board',item_id=key,number=n,life='live',move_id=key))
 insert('kickside_work_prefix',dict(board_id='board',prefix=key))
metrics=[]
for analyzed in (False,True):
 if analyzed:db.execute('ANALYZE')
 for anchor in (None,9999,19998):
  q=operations[anchor is not None]
  args=['board','2026']+(['2000-01-01T00:00:00.000000000Z',f'{anchor:06d}'] if anchor is not None else [])
  ticks=[0]
  def tick():ticks[0]+=1;return 0
  db.set_progress_handler(tick,1);rows=db.execute(q,args).fetchall();db.set_progress_handler(None,0)
  assert len(rows)==1 and rows[0]['eligible']==0 and ticks[0]<1500,(anchor,ticks)
  metrics.append(['operation',analyzed,anchor,ticks[0]])
 ticks=[0]
 db.set_progress_handler(tick,1);rows=db.execute(operations[2],['board','2026','move','019999']).fetchall();db.set_progress_handler(None,0)
 assert len(rows)==1 and rows[0]['eligible']==0 and ticks[0]<1000,ticks
 metrics.append(['named',analyzed,'019999',ticks[0]])
 for anchor in ('','009999','019998'):
  db.execute("UPDATE kickside_work_retention SET orphan_after=? WHERE owner_id='work'",(anchor,))
  ticks=[0]
  db.set_progress_handler(tick,1);rows=db.execute(orphans,[1]).fetchall();db.set_progress_handler(None,0)
  assert len(rows)==1 and rows[0]['present']==1 and ticks[0]<1000,(anchor,ticks)
  metrics.append(['prefix',analyzed,anchor,ticks[0]])
print(json.dumps(metrics))
`],{},JSON.stringify([initial,bounded,age,operations,orphans]))
  console.log("round8 operation/prefix maxima",Object.fromEntries(["operation","named","prefix"].map(name=>[name,Math.max(...JSON.parse(result).filter(m=>m[0]===name).map(m=>m[3]))])))
  assert.equal(JSON.parse(result).length,14)
})


test('round 8 remaining retention selectors use bounded seeks through 20000 retained rows', async () => {
  const {readFile}=await import('node:fs/promises')
  const rows=await readFile(resolve(root,'src/retention/rows.lua'),'utf8')
  const lifecycle=await readFile(resolve(root,'src/persist/lifecycle.lua'),'utf8')
  const classes=rows.match(/local classes = (\{[\s\S]*?\n        \})/)[1]
  const associated=rows.match(/local associated = (\{[\s\S]*?\n        \})/)[1]
  const owned=lifecycle.match(/local TABLES[^=]*= (\{[\s\S]*?\n\})/)[1]
  const selection=lifecycle.match(/local selection = ([^\n]+)/)[1]
  const captured=await run('lua',['-'],{},`
local board_id,id='board','missing'
local names={set='retention_test_set',item='retention_test_item'}
local classes=${classes}
local associated=${associated}
for _,e in ipairs(associated) do
 e.where='board_id = $1 AND (' .. e.where .. ')';e.params={board_id};classes[#classes+1]=e
end
local owned=${owned}
for _,e in ipairs(owned) do e.where='board_id=$1';e.params={board_id};classes[#classes+1]=e end
classes[#classes+1]={name=names.set,keys='item_id,col,value_key',where='1=1',params={}}
classes[#classes+1]={name=names.item,keys='item_id',where='1=1',params={}}
classes[#classes+1]={name='kickside_work_change',keys='seq,n',where="board_id=$1 AND kind='query_value'",params={board_id}}
for _,e in ipairs(classes) do
 local name,keys,where,order=e.name,e.keys,e.where,e.order
 local params={}
 for i,value in ipairs(e.params)do params[i]=value end
 params[#params+1]=1
 local selection=${selection}
 io.write(selection,'\\0',#params,'\\0')
end
`)
  const bits=captured.split('\0'),queries=[]
  for(let i=0;i<bits.length-1;i+=2)queries.push([bits[i],Number(bits[i+1])===3?['board','missing',1]:Number(bits[i+1])===2?['board',1]:[1]])
  for(const [fn,args] of [['boards',['009999',0,1]],['trash',['board','2026',1]],['collect',['board']]]) {
    const section=rows.slice(rows.indexOf(`function M.${fn}(`))
    queries.push([section.match(/db:query\(\[\[([\s\S]*?)\]\]/)[1],args])
  }
  queries.push([rows.match(/local tombs,tomb_err=db:query\(\[\[([\s\S]*?)\]\]/)[1],['board','2026',1]])
  const initial=await statements('01_work','up'),bounded=await statements('04_bounded_retention','up'),age=await statements('06_age_seeks','up'),seeks=await statements('05_cleanup_seeks','up')
  initial.push(...(await statements('02_retire_storage','up')).filter(q=>q.startsWith('CREATE INDEX')))
  const result=await run('python3',['-c',`
import json,sqlite3,sys
initial,bounded,age,seeks,queries=json.load(sys.stdin)
db=sqlite3.connect(':memory:')
for q in initial+bounded+age:db.execute(q)
db.execute("ALTER TABLE kickside_work_visibility ADD COLUMN at text NOT NULL DEFAULT ''")
db.execute('CREATE INDEX kickside_work_comment_deleted ON kickside_work_comment(board_id,edited_at) WHERE deleted=1')
for q in seeks:db.execute(q)
db.execute('CREATE TABLE retention_test_set(item_id TEXT,col TEXT,value_key TEXT,PRIMARY KEY(item_id,col,value_key))')
db.execute('CREATE TABLE retention_test_item(item_id TEXT PRIMARY KEY)')
def insert(table,values):
 cols=db.execute('PRAGMA table_info('+table+')').fetchall()
 data={c[1]:(0 if c[2].upper() in ('INTEGER','BIGINT') else '') for c in cols if c[3] and c[4] is None}
 data.update(values)
 db.execute('INSERT INTO '+table+' ('+','.join(data)+') VALUES ('+','.join('?' for _ in data)+')',list(data.values()))
for n in range(20000):
 key=f'{n:06d}'
 insert('kickside_work_board',dict(board_id=key))
 insert('kickside_work_board_meta',dict(board_id=key))
 for name,values in [
  ('receipt',dict(command_key=key,at='2099')),
  ('key_alias',dict(key=key,at='2099')),
  ('generation',dict(generation=n+1,applied_at='2099')),
  ('visibility',dict(item_id=key,seq=n,at='2099')),
  ('operation',dict(operation_id=key,key=key,kind='bulk',status='pending')),
  ('item',dict(item_id=key,number=n,life=('live','trashed','purged')[n%3],life_at='2099',purge_pending=0)),
  ('field_usage',dict(field_id=n,items=1)),
  ('plugin',dict(plugin=key,active=1,revision=1,applied_revision=1)),
  ('job',dict(job_id=key,status='pending')),
  ('comment',dict(comment_id=key,item_id=key,deleted=n%2,edited_at='2099')),
  ('change',dict(seq=1,n=n,kind='item',at='2099')),
  ('interval',dict(item_id=key)),
  ('approval',dict(item_id=key)),
  ('stage_run',dict(item_id=key)),
  ('link',dict(from_id=key,type='relates',to_board_id='another',to_id=key)),
 ]:insert('kickside_work_'+name,dict(board_id='board',**values))
 db.execute('INSERT INTO retention_test_set VALUES (?,?,?)',(key,'column','value'))
 db.execute('INSERT INTO retention_test_item VALUES (?)',(key,))
queries.extend([
 ["SELECT comment_id FROM kickside_work_comment WHERE board_id=$1 AND item_id=$2 ORDER BY comment_id LIMIT $3",['board','missing',1]],
 ["SELECT comment_id FROM kickside_work_comment WHERE board_id=$1 AND deleted=1 AND edited_at<$2 ORDER BY edited_at,comment_id LIMIT $3",['board','2026',1]],
])
metrics=[]
for analyzed in (False,True):
 if analyzed:db.execute('ANALYZE')
 for q,args in queries:
  plan=db.execute('EXPLAIN QUERY PLAN '+q,args).fetchall()
  assert not any('TEMP B-TREE' in row[3] for row in plan),(q,plan)
  ticks=[0]
  def tick():ticks[0]+=1;return 0
  db.set_progress_handler(tick,1);result=db.execute(q,args).fetchall();db.set_progress_handler(None,0)
  assert len(result)<=1 and ticks[0]<1000,(q,ticks,plan)
  metrics.append([analyzed,q,ticks[0]])
print(json.dumps(metrics))
`],{},JSON.stringify([initial,bounded,age,seeks,queries]))
  console.log('round8 remaining-selector maximum instructions',Math.max(...JSON.parse(result).map(m=>m[2])))
  assert.equal(JSON.parse(result).length,68)
})

test('retention page performs no inspection after its budget is exhausted', async () => {
  const {readFile}=await import('node:fs/promises')
  const source=await readFile(resolve(root,'src/persist/lifecycle.lua'),'utf8')
  const body=source.match(/function M.page[^\n]*\n([\s\S]*?)\nend/)[1].replace('local params: types.SqlParams','local params')
  const result=await run('lua',['-'],{},`
local M={}
function M.page(tx,name,keys,where,args,limit,order)
${body}
end
local calls=0
local db={query=function()calls=calls+1;return {},nil end}
local n,more,err=M.page(db,'owned','id','board_id=$1',{'board'},0)
assert(n==0 and err==nil)
assert(calls==0,'exhausted retention budget still inspected a candidate')
assert(more==true,'exhausted budget requires a new allowance to discover completion')
io.write('bounded')
`)
  assert.equal(result,'bounded')
})

test('rank replay retains its population while bulk work excludes permanent identities', async () => {
  const {readFile}=await import('node:fs/promises')
  const jobs=await readFile(resolve(root,'src/persist/job_rows.lua'),'utf8')
  const admission=jobs.split('function M.population(')[1].match(/"(SELECT COUNT\(\*\)[^"]+)"/)[1]
  const work=jobs.split('function M.work_population(')[1].match(/"(SELECT COUNT\(\*\)[^"]+)"/)[1]
  const folding=(await readFile(resolve(root,'src/persist/fold_rank.lua'),'utf8')).split('function M.apply_rebalanced(')[1]
  const total=folding.match(/"(SELECT COUNT\(\*\)[^"]+)"/)[1]
  const selected=folding.match(/"(SELECT item_id, rank[^"]+)"/)[1]
  const result=await run('python3',['-c',`
import json,sqlite3,sys
admission,total,selected,work=json.load(sys.stdin)
db=sqlite3.connect(':memory:')
db.execute('CREATE TABLE kickside_work_item(board_id TEXT,item_id TEXT,rank TEXT,life TEXT,PRIMARY KEY(board_id,item_id))')
db.execute("INSERT INTO kickside_work_item VALUES ('board','live','a','live'),('board','retired','z','purged')")
print(json.dumps([db.execute(admission,['board']).fetchone()[0],db.execute(total,['board']).fetchone()[0],[r[0] for r in db.execute(selected,['board',10,0])],db.execute(work,['board']).fetchone()[0]]))
`],{},JSON.stringify([admission,total,selected,work]))
  assert.deepEqual(JSON.parse(result),[2,2,['live','retired'],1])
})

test('completed prefix inspection is independent of PostgreSQL key collation', {skip: !process.env.WORK_MIGRATION_POSTGRES}, async () => {
  const {readFile}=await import('node:fs/promises')
  const lifecycle=await readFile(resolve(root,'src/persist/lifecycle.lua'),'utf8')
  const statement=lifecycle.match(/local rows, err = db:query\(\[\[(SELECT p\.\*[\s\S]*?)\]\]/)[1].replaceAll('$1','1')
  const schema=`work_phase_${process.pid}`
  async function psql(script) {
    const args=['exec','-i','kickside-test-pg','psql','-X','-qAt','-v','ON_ERROR_STOP=1','-U','kickside','-d','kickside_test_work']
    return process.env.WORK_MIGRATION_SSH?run('ssh',[process.env.WORK_MIGRATION_SSH,'docker',...args],{},script):run('docker',args,{},script)
  }
  await psql(`CREATE SCHEMA ${schema}; SET search_path TO ${schema};
CREATE TABLE kickside_work_board(board_id text PRIMARY KEY);
CREATE TABLE kickside_work_prefix(prefix text PRIMARY KEY,board_id text,claim_version integer);
CREATE TABLE kickside_work_retention(owner_id text PRIMARY KEY,orphan_after text);
INSERT INTO kickside_work_board VALUES ('board');
INSERT INTO kickside_work_retention VALUES ('work','~');
INSERT INTO kickside_work_prefix SELECT 'W'||lpad(n::text,8,'0'),'board',1 FROM generate_series(1,20000)n;`)
  try {
    const count=await psql(`SET search_path TO ${schema}; SELECT count(*) FROM (${statement}) candidates;`)
    assert.equal(count.trim(),'0','a completed phase must not compare its marker against prefix keys')
    const plan=JSON.parse(await psql(`SET search_path TO ${schema}; EXPLAIN (ANALYZE,BUFFERS,FORMAT JSON) ${statement};`))
    function inspect(node) {
      if(node['Relation Name']==='kickside_work_prefix')assert.equal(node['Actual Loops'],0)
      for(const child of node.Plans||[])inspect(child)
    }
    inspect(plan[0].Plan)
  } finally {await psql(`DROP SCHEMA ${schema} CASCADE;`)}
})
