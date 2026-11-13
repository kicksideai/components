-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Chunked bulk writes: rows beyond one statement's parameter limit land in
-- several statements, column expressions wrap their placeholder, a suffix
-- applies to every chunk, and deletes stay inside their scope.
local test = require("test")
local sql = require("sql")
local bulk = require("bulk")
local storage = require("storage")
local types = require("types")

local function db(): sql.DB
    local handle, err = sql.get("app:db")
    assert(handle, tostring(err))
    return handle
end

local function count(h: sql.DB, statement: string, params: types.SqlParams): integer
    local rows, err = h:query(statement, params)
    assert(rows, tostring(err))
    return math.tointeger(tonumber(rows[1].n)) :: integer
end

local function fresh(h: sql.DB)
    assert(h:execute("DROP TABLE IF EXISTS bulk_probe", {}))
    assert(h:execute("CREATE TABLE bulk_probe (scope TEXT NOT NULL, id TEXT NOT NULL, n INTEGER NOT NULL, PRIMARY KEY (scope, id))", {}))
end

local COLUMNS: { storage.Column } = { { name = "scope" }, { name = "id" }, { name = "n" } }

local function define()
    test.describe("bulk", function()
        test.it("inserts more rows than one statement may bind", function()
            local h = db()
            fresh(h)
            local rows: { types.SqlParams } = {}
            for i = 1, 25000 do rows[i] = { "a", "id" .. i, i } end
            test.is_nil(bulk.insert(h, "bulk_probe", COLUMNS, rows))
            test.eq(count(h, "SELECT COUNT(*) AS n FROM bulk_probe WHERE scope = $1", { "a" }), 25000)
            test.eq(count(h, "SELECT SUM(n) AS n FROM bulk_probe WHERE scope = $1", { "a" }), 25000 * 25001 // 2)
            h:release()
        end)

        test.it("applies a suffix to every chunk and wraps column expressions", function()
            local h = db()
            fresh(h)
            local rows: { types.SqlParams } = {}
            for i = 1, 12000 do rows[i] = { "a", "id" .. i, 1 } end
            test.is_nil(bulk.insert(h, "bulk_probe", COLUMNS, rows))
            test.is_nil(bulk.insert(h, "bulk_probe", COLUMNS, rows, " ON CONFLICT (scope, id) DO UPDATE SET n = bulk_probe.n + excluded.n"))
            test.eq(count(h, "SELECT SUM(n) AS n FROM bulk_probe", {}), 24000)
            test.is_nil(bulk.insert(h, "bulk_probe", { { name = "scope" }, { name = "id" }, { name = "n", expr = "(%s * 10)" } }, { { "b", "x", 4 } }))
            test.eq(count(h, "SELECT n FROM bulk_probe WHERE scope = $1", { "b" }), 40)
            test.is_nil(bulk.insert(h, "bulk_probe", COLUMNS, {}))
            h:release()
        end)

        test.it("deletes only the listed ids inside the scope", function()
            local h = db()
            fresh(h)
            local rows: { types.SqlParams } = {}
            for i = 1, 100 do
                rows[#rows + 1] = { "a", "id" .. i, i }
                rows[#rows + 1] = { "b", "id" .. i, i }
            end
            test.is_nil(bulk.insert(h, "bulk_probe", COLUMNS, rows))
            local ids: { string } = {}
            for i = 1, 40000 do ids[i] = "id" .. i end
            test.is_nil(bulk.delete_in(h, "bulk_probe", "scope = $1", { "a" }, "id", ids))
            test.eq(count(h, "SELECT COUNT(*) AS n FROM bulk_probe WHERE scope = $1", { "a" }), 0)
            test.eq(count(h, "SELECT COUNT(*) AS n FROM bulk_probe WHERE scope = $1", { "b" }), 100)
            test.is_nil(bulk.delete_in(h, "bulk_probe", nil, {}, "id", {}))
            test.eq(count(h, "SELECT COUNT(*) AS n FROM bulk_probe", {}), 100)
            h:release()
        end)
    end)
end

return { run = test.run_cases(define) }
