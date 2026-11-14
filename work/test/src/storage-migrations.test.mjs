// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import assert from 'node:assert/strict'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { run } from '../../scripts/module-rules.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const capture = `
local direction = arg[2]
local db = { execute = function(_, statement) io.write(statement, "\\0"); return {}, nil end }
package.preload.operation_expiry = function()
    return { TERMINAL = "status IN ('done','cancelled','failed')", at = function() return "actor_context" end }
end
package.preload.migration = function()
    return { define = function(fn)
        migration = function(_, body) body() end
        database = function(dialect, body) if dialect == "sqlite" then body() end end
        up = function(body) if direction == "up" then body(db) end end
        down = function(body) if direction == "down" then body(db) end end
        fn()
    end }
end
dofile(arg[1])
`

async function statements(name, direction) {
  const result = await run('lua', ['-', resolve(root, `src/migrations/${name}.lua`), direction], {}, capture)
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
  const up = await statements('02_retire_storage', 'up')
  const down = await statements('02_retire_storage', 'down')
  const result = await run('python3', ['-c', `
import json, sqlite3, sys
up, down = json.load(sys.stdin)
db = sqlite3.connect(':memory:')
db.executescript("""
CREATE TABLE kickside_work_board (board_id text PRIMARY KEY, counter bigint, item_count bigint, open_count bigint, trashed_count bigint);
INSERT INTO kickside_work_board VALUES ('board', 42, 99, 99, 99);
CREATE TABLE kickside_work_change (board_id text, seq bigint, n integer, kind text, payload text, ctx text);
INSERT INTO kickside_work_change VALUES ('board',1,1,'created','accepted fact','');
CREATE TABLE kickside_work_item (board_id text, item_id text, life text, category text);
INSERT INTO kickside_work_item VALUES ('board','a','live','started'),('board','b','live','completed'),('board','c','trashed','started');
""")
for sql in up: db.execute(sql)
columns = [row[1] for row in db.execute('PRAGMA table_info(kickside_work_board)')]
assert columns == ['board_id', 'counter'], columns
assert db.execute('SELECT * FROM kickside_work_board').fetchall() == [('board',42)]
assert db.execute('SELECT board_id,payload FROM kickside_work_change').fetchall() == [('board','accepted fact')]
assert db.execute('SELECT COUNT(*) FROM kickside_work_item').fetchone()[0] == 3
for sql in down: db.execute(sql)
print(json.dumps(db.execute('SELECT counter,item_count,open_count,trashed_count FROM kickside_work_board').fetchone()))
`], {}, JSON.stringify([up, down]))
  assert.deepEqual(JSON.parse(result), [42, 2, 1, 1])
})
