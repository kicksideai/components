# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
"""Measure production queries against the actual initial migration."""
import re
import sqlite3
import unittest
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
def named(values):
    """Binds positional values to the $1..$n placeholders the production queries use."""
    return {str(index): value for index, value in enumerate(values, 1)}
class QueryPlans(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        migration = (ROOT / "src/migrations/01_catalog.lua").read_text().split("local POSTGRES = {", 1)[1].split("local SQLITE", 1)[0]
        for statement in re.findall(r"\[\[(.*?)\]\]", migration, re.S):
            self.db.execute(statement)
        self.db.executemany("INSERT INTO kickside_pim_publication VALUES('catalog','web',?,?,'published',1,'2000')", [(f"{n:05}", f"{n:05}") for n in range(4000)])
    def tearDown(self):
        self.db.close()
    def test_asset_retention_seeks_only_collectible_versions(self):
        source = (ROOT / "src/persist/asset_rows.lua").read_text()
        self.db.execute("""INSERT INTO kickside_pim_catalog
            (catalog_id,generation,compiled,digest,layout_digest,item_table,applied_seq,product_count,item_count,trashed_count,tombstone_floor_seq,created_at,updated_at)
            VALUES('catalog',1,'{}','','','',1,0,0,0,0,'','')""")
        self.db.executemany("INSERT INTO kickside_pim_asset(catalog_id,asset_id,due_at,reaping) VALUES('catalog',?,?,?)",
                            [(f"{n:05}", None, 0) for n in range(10000)] +
                            [("due", "2000", 0), ("later", "2100", 0), ("reaping", "2000", 1)])
        for method, bindings, index in (
            ("due", ("catalog", "2026", 10), "kickside_pim_asset_due"),
            ("deadline", ("catalog", "2026"), "kickside_pim_asset_due"),
        ):
            query = re.search(rf"function M\.{method}.*?db:query\(\[\[(.*?)\]\]", source, re.S).group(1)
            plan = str(self.db.execute("EXPLAIN QUERY PLAN " + query, named(bindings)).fetchall())
            self.assertIn(index, plan)
            self.assertNotIn("TEMP B-TREE", plan)
            print(f"asset retention {method} plan:", plan)

    def test_release_seeks_product(self):
        source = (ROOT / "src/command/releases.lua").read_text()
        query = re.search(r"query\(\[\[(SELECT p\.channel, p\.release_id, r\.hash.*?)\]\]", source, re.S).group(1)
        plan = str(self.db.execute("EXPLAIN QUERY PLAN " + query, named(("catalog", "00100"))).fetchall())
        self.assertIn("catalog_id=? AND product_id=?", plan)
        print("release publication lookup plan:", plan)
    def test_proposal_quota_and_decision_use_indexed_access(self):
        source = (ROOT / "src/persist/proposal_rows.lua").read_text()
        quota = re.search(r"\[\[(SELECT COUNT\(\*\) AS n FROM.*?)\]\]", source, re.S).group(1)
        decision = re.search(r"\[\[(UPDATE kickside_pim_proposal.*?)\]\]", source, re.S).group(1)
        self.db.executemany("""INSERT INTO kickside_pim_proposal
            (catalog_id,proposal_id,origin,items,base,generation,status,created_by,created_at)
            VALUES('catalog',?,'{}','[]','{}',1,'pending','actor','2000')""", [(str(n),) for n in range(2000)])
        params = named(("catalog", 5))
        self.assertEqual(self.db.execute(quota, params).fetchone(), (5,))
        quota_plan = str(self.db.execute("EXPLAIN QUERY PLAN " + quota, params).fetchall())
        self.assertIn("SEARCH kickside_pim_proposal USING COVERING INDEX", quota_plan)
        self.assertIn("catalog_id=?", quota_plan)
        decision_plan = str(self.db.execute("EXPLAIN QUERY PLAN " + decision,
            named(("rejected", None, "reviewer", "2000", "catalog", "5"))).fetchall())
        self.assertIn("catalog_id=? AND proposal_id=?", decision_plan)
        print("proposal quota and decision plans:", quota_plan, decision_plan)
    def test_channel_cleanup_page_work_is_constant(self):
        source = (ROOT / "src/persist/schema_cleanup.lua").read_text()
        query = re.search(r"\[\[(SELECT product_id FROM kickside_pim_publication.*?)\]\]", source, re.S).group(1)
        steps = []
        for page in range(80):
            work = [0]
            def progress():
                work[0] += 1
                return 0
            self.db.set_progress_handler(progress, 1)
            rows = self.db.execute(query, named(("catalog", "web", 50))).fetchall()
            self.db.set_progress_handler(None, 0)
            self.assertEqual(len(rows), 50)
            steps.append(work[0])
            self.db.executemany("UPDATE kickside_pim_publication SET state='withdrawn' WHERE catalog_id='catalog' AND channel='web' AND product_id=?", rows)
        print("channel cleanup VM steps pages 1/20/80:", steps[0], steps[19], steps[79])
        # Page cost stays flat as withdrawn rows accumulate; a prefix rescan grows ~50x over 80 pages.
        self.assertLessEqual(max(steps), min(steps) * 1.25)
        plan = str(self.db.execute("EXPLAIN QUERY PLAN " + query, named(("catalog", "web", 50))).fetchall())
        self.assertNotIn("TEMP B-TREE", plan)
    def measure(self, query, params):
        steps = [0]
        def tick():
            steps[0] += 1
            return 0
        self.db.set_progress_handler(tick, 1)
        rows = self.db.execute(query, named(params)).fetchall()
        self.db.set_progress_handler(None, 0)
        return rows, steps[0]
    def test_catalog_maintenance_page_work_is_bounded(self):
        self.db.executemany("INSERT INTO kickside_pim_catalog(catalog_id,generation,compiled,digest,layout_digest,item_table,applied_seq,product_count,item_count,trashed_count,tombstone_floor_seq,created_at,updated_at) VALUES(?,1,'{}','','','',1,0,0,0,0,'','')",
                            [(f"{n:06}",) for n in range(100001)])
        self.db.execute("INSERT INTO kickside_pim_cleanup(catalog_id,cleaned) SELECT catalog_id,0 FROM kickside_pim_catalog WHERE catalog_id < '100000'")
        source = (ROOT / "src/persist/retention_rows.lua").read_text()
        query = re.search(r"function M.catalogs.*?db:query\(\[\[(.*?)\]\]", source, re.S).group(1)
        costs = []
        for cursor, inclusive in [("000000", 1), ("049999", 0), ("099999", 0)]:
            # One catalog slot plus one lookahead.
            _, steps = self.measure(query, (cursor, inclusive, 2))
            costs.append(steps)
        print("maintenance catalog page VM steps:", costs)
        self.assertLess(max(costs), 200, "catalog discovery must not walk a prefix to fill the page")

    def test_live_family_occupancy_is_an_indexed_existence_seek(self):
        source = (ROOT / "src/persist/store.lua").read_text()
        query = re.search(r"function M.family_occupied.*?db:query\(\[\[(.*?)\]\]", source, re.S).group(1)
        self.db.executemany(
            """INSERT INTO kickside_pim_product(catalog_id,product_id,sku,root_id,family,level,is_item,state,status,version,document,source_seq,created_seq,updated_seq)
            VALUES('catalog',?1,?1,?1,?2,0,1,?3,'active',1,'{}','{}',1,1)""",
            ((f"{state}-{n}", family, state)
             for family, state in (("occupied", "live"), ("trashed", "trashed")) for n in range(10000)),
        )
        self.db.execute("ANALYZE")
        present, hit = self.measure(query, ("catalog", "occupied"))
        missing, miss = self.measure(query, ("catalog", "before_occupied"))
        trashed, trashed_miss = self.measure(query, ("catalog", "trashed"))
        print("family occupancy VM steps for hit, miss, and trashed-only family:", hit, miss, trashed_miss)
        self.assertLess(max(hit, miss, trashed_miss), 100)
        self.assertEqual(len(present), 1)
        self.assertEqual(missing, [])
        self.assertEqual(trashed, [])
        plan = str(self.db.execute("EXPLAIN QUERY PLAN " + query, named(("catalog", "occupied"))).fetchall())
        print("family occupancy plan:", plan)
        self.assertIn("kickside_pim_product_live_family ((catalog_id,family)>(?,?))", plan)
        self.assertNotIn("TEMP B-TREE", plan)
        # Keep the one-catalog statistics above and check a candidate in the next catalog.
        self.db.execute(
            """INSERT INTO kickside_pim_product(catalog_id,product_id,sku,root_id,family,level,is_item,state,status,version,document,source_seq,created_seq,updated_seq)
            VALUES('next_catalog','other','other','other','trashed',0,1,'live','active',1,'{}','{}',1,1)"""
        )
        other_catalog, cross_catalog_miss = self.measure(query, ("catalog", "trashed"))
        print("family occupancy VM steps for a cross-catalog miss:", cross_catalog_miss)
        self.assertEqual(other_catalog, [])
        self.assertLess(cross_catalog_miss, 100)

    def test_publication_tuple_seek(self):
        self.db.execute("UPDATE kickside_pim_publication SET state='withdrawn'")
        self.db.executemany("INSERT INTO kickside_pim_publication VALUES('catalog','web',?,?,'withdrawn',1,'2000')", [(f"{n:05}", f"{n:05}") for n in range(4000,8000)])
        source = (ROOT / "src/persist/read_model.lua").read_text()
        query = re.search(r"function M.publications.*?db:query\(\[\[(.*?)\]\]", source, re.S).group(1)
        costs = []
        for cursor in ["00000", "04000", "07799"]:
            params = ("catalog", "web", 1, cursor, 200) if "(p.seq, p.product_id)" in query else ("catalog", "web", 1, 1, cursor, 200)
            plan = str(self.db.execute("EXPLAIN QUERY PLAN " + query, named(params)).fetchall())
            rows, steps = self.measure(query, params)
            self.assertEqual(len(rows), 200)
            costs.append(steps)
            self.assertNotIn("TEMP B-TREE", plan)
            self.assertIn("(seq,product_id)>", plan.replace(" ", ""))
        print("publication feed steps:", costs)
        self.assertLess(max(costs), 15000)
    def test_publication_expiry_and_floor_use_index_seeks(self):
        self.db.execute("UPDATE kickside_pim_publication SET state='withdrawn' WHERE product_id >= '03900'")
        retention = (ROOT / "src/persist/retention_rows.lua").read_text()
        expiry = re.search(r"function M.prune_publications.*?tx:query\(\[\[(.*?)\]\]", retention, re.S).group(1)
        params = ("catalog", "2001", 50)
        plan = str(self.db.execute("EXPLAIN QUERY PLAN " + expiry, named(params)).fetchall())
        self.assertIn("kickside_pim_publication_expiry (catalog_id=? AND updated_at<?)", plan)
        self.assertNotIn("TEMP B-TREE", plan)
        rows, steps = self.measure(expiry, params)
        self.assertEqual(len(rows), 50)
        self.assertLess(steps, 1000)
        self.db.execute("INSERT INTO kickside_pim_publication_floor VALUES('catalog','web',1,'03950')")
        read = (ROOT / "src/persist/read_model.lua").read_text()
        floor = re.search(r"function M.publication_floor.*?db:query\(\[\[(.*?)\]\]", read, re.S).group(1)
        # Positional binding matches the runtime's SQLite driver.
        params = ("catalog", "web", 1, "03949", 0, "")
        plan = str(self.db.execute("EXPLAIN QUERY PLAN " + floor, params).fetchall())
        self.assertIn("catalog_id=? AND channel=?", plan)
        self.assertEqual(self.db.execute(floor, params).fetchall(), [(1, "03950", 1)])
        self.assertEqual(self.db.execute(floor, ("catalog", "web", 1, "03949", 1, "03950")).fetchall(), [(1, "03950", 0)])
    def test_export_tuple_seek(self):
        self.db.executemany("INSERT INTO kickside_pim_product(catalog_id,product_id,sku,root_id,family,level,is_item,state,status,version,document,source_seq,created_seq,updated_seq) VALUES('catalog',?,?,?,'generic',0,1,'live','active',1,'{}','{}',1,1)", [(f"{n:05}", f"sku{n}", f"{n:05}") for n in range(8000)])
        source = (ROOT / "src/persist/read_model.lua").read_text()
        query = re.search(r"function M.export_page.*?db:query\(\[\[(.*?)\]\]", source, re.S).group(1)
        costs = []
        for cursor in ["00000", "03000", "06999"]:
            params = ("catalog", 0, cursor, 1000) if "(p.level, p.product_id)" in query else ("catalog", 0, 0, cursor, 1000)
            plan = str(self.db.execute("EXPLAIN QUERY PLAN " + query, named(params)).fetchall())
            rows, steps = self.measure(query, params)
            self.assertEqual(len(rows), 1000)
            costs.append(steps)
            self.assertNotIn("TEMP B-TREE", plan)
            self.assertIn("(level,product_id)>", plan.replace(" ", ""))
        print("product export steps:", costs)
        self.assertLess(max(costs), 40000)

    def test_merge_page_seeks_only_selected_holders(self):
        self.db.executemany("INSERT INTO kickside_pim_ref VALUES (?, ?, ?, '', ?, 'term', ?)", (
            (catalog, f"{product:05}", 2 if target == "v:other" else 1, path, target)
            for catalog, target in (("catalog", "v:from"), ("catalog", "v:other"), ("other", "v:from"))
            for product in range(25000)
            for path in ("1", "2")
        ))
        self.db.execute("ANALYZE")
        source = (ROOT / "src/persist/merge_rows.lua").read_text()
        holders = re.search(r"\[\[(SELECT DISTINCT product_id.*?)\]\]", source, re.S).group(1)
        page = re.search(r"\[\[(SELECT product_id, attribute_id, ctx, path.*?)\]\]", source, re.S).group(1)
        excluded = " AND product_id NOT IN ($4)"
        holders += excluded + " ORDER BY product_id LIMIT $5"
        query = page + holders + ") holders)" + excluded + " ORDER BY product_id"
        params = ("catalog", "term", "v:from", "00000", 500)
        plan = str(self.db.execute("EXPLAIN QUERY PLAN " + query, named(params)).fetchall())
        self.assertIn("kickside_pim_ref_target (catalog_id=? AND kind=? AND target=? AND product_id<?)", plan)
        rows, steps = self.measure(query, params)
        self.assertEqual([row[0] for row in rows], [f"{i:05}" for i in range(1, 501) for _ in range(2)])
        self.assertLess(steps, 60000)
        count, _ = self.measure("SELECT COUNT(*) FROM (" + holders + ") holders", (*params[:4], 20001))
        self.assertEqual(count, [(20001,)])

if __name__ == "__main__":
    unittest.main()
