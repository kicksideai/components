-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local test = require("test")
local values = require("values")
local types = require("types")

local function define()
    test.describe("instant precision", function()
        test.it("refuses malformed RFC3339 fractional syntax", function()
            for _, raw in ipairs({ "2026-01-01T00:00:00.Z", "2026-01-01T00:00:00123Z" }) do
                local value, err = values.normalize({ form = "time", cardinality = "one", config = {} }, raw)
                test.is_nil(value)
                test.not_nil(err)
                test.eq(err:kind(), errors.INVALID)
                test.not_nil(err:details().code)
            end
        end)
        test.it("normalizes equivalent instants without discarding fractions", function()
            local shape = { form = "time", cardinality = "one", config = {} }
            test.eq(values.normalize(shape, "2026-01-01T00:00:00.5Z"), "2026-01-01T00:00:00.500000000Z")
            test.eq(values.normalize(shape, "2026-01-01T00:00:00Z"), "2026-01-01T00:00:00.000000000Z")
            local _, err = values.normalize(shape, "2026-01-01T00:00:00.1234567891Z")
            test.not_nil(err)
        end)
    end)

    test.describe("value forms", function()
        test.it("reduces decimals and renders exact keys", function()
            local v = (assert(values.normalize({ form = "dec", cardinality = "one", config = {} }, "12.500") :: types.Dec))
            test.eq(v.m, 125)
            test.eq(v.e, -1)
            test.eq(values.key("dec", v), "12.5")
            test.eq(values.key("dec", (assert(values.normalize({ form = "dec", cardinality = "one", config = {} }, "-0.05") :: types.Dec))), "-0.05")
            test.eq(values.key("dec", (assert(values.normalize({ form = "dec", cardinality = "one", config = {} }, "3000") :: types.Dec))), "3000")
        end)
        test.it("orders at the declared scale and refuses extra precision", function()
            local v = (assert(values.normalize({ form = "dec", cardinality = "one", config = {} }, "0.742") :: types.Dec))
            test.eq(values.order("dec", v, { scale = 3 }), 742)
            local _, err = values.order("dec", v, { scale = 2 })
            test.not_nil(err)
            test.eq(values.order("int", 9007199254740991, { scale = 0 }), 9007199254740991)
        end)
        test.it("keeps int64 order values exact", function()
            local v = (assert(values.normalize({ form = "dec", cardinality = "one", config = {} }, "123456789012.345") :: types.Dec))
            test.eq(values.order("dec", v, { scale = 3 }), 123456789012345)
        end)
        test.it("deduplicates and sorts sets by key", function()
            local attr = { form = "text", cardinality = "set", config = {} }
            local v = values.members(attr, assert(values.normalize(attr, { "b", "a", "b" })))
            test.eq(#v, 2)
            test.eq(v[1], "a")
        end)
        test.it("compares records independently of key order", function()
            test.is_true(values.equal({ a = 1, b = { c = 2, d = 3 } }, { b = { d = 3, c = 2 }, a = 1 }))
            test.eq(values.canonical({ b = 1, a = { 2, 3 } }), '{"a":[2,3],"b":1}')
            test.is_false(values.equal({ a = 1 }, { a = 2 }))
        end)
        test.it("compares quantities exactly in the canonical unit and orders them at scale", function()
            local attr = { form = "quantity", cardinality = "one", config = { units = { kg = "1", g = "0.001", lb = "0.45359237" }, canonical = "kg", scale = 3 } }
            local pound = (assert(values.normalize(attr, "1 lb") :: types.Quantity))
            test.eq(pound.u, "lb")
            local grams = (assert(values.normalize(attr, { value = "453.59237", unit = "g" }) :: types.Quantity))
            test.eq((values.key("quantity", pound, attr.config)), (values.key("quantity", grams, attr.config)))
            test.eq(values.key("quantity", pound, attr.config), "0.45359237 kg")
            test.eq(values.order("quantity", pound, attr.config), 454)
            test.eq(values.order("quantity", (assert(values.normalize(attr, "900 g") :: types.Quantity)), attr.config), 900)
            test.not_nil(select(2, values.normalize(attr, "2 stone")))
        end)
        test.it("rejects floats, NUL and bad times", function()
            test.not_nil(select(2, values.normalize({ form = "dec", cardinality = "one", config = {} }, 1.5)))
            test.not_nil(select(2, values.normalize({ form = "text", cardinality = "one", config = {} }, "a\0b")))
            test.not_nil(select(2, values.normalize({ form = "time", cardinality = "one", config = {} }, "2026-11-03 10:00")))
            test.is_nil(select(2, values.normalize({ form = "time", cardinality = "one", config = {} }, "2026-11-03T10:00:00Z")))
        end)
    end)

    test.describe("value edge cases", function()
        local DEC: types.ValueShape = { form = "dec", cardinality = "one", config = {} }
        local INT: types.ValueShape = { form = "int", cardinality = "one", config = {} }
        local TEXT: types.ValueShape = { form = "text", cardinality = "one", config = {} }
        local function ok(shape: types.ValueShape, raw: unknown): types.Value
            local v, err = values.normalize(shape, raw)
            assert(not err, tostring(raw) .. ": " .. tostring(err))
            return v :: types.Value
        end
        local function bad(shape: types.ValueShape, raw: unknown)
            local _, err = values.normalize(shape, raw)
            test.not_nil(err, "expected refusal of " .. tostring(raw))
        end
        local function dec(raw: unknown): types.Dec return ok(DEC, raw) :: types.Dec end

        test.it("parses decimals at their bounds", function()
            test.eq(dec("1.").m, 1)
            for _, raw in ipairs({ ".5", "1e3", "+1", "1,5", "", "abc" }) do bad(DEC, raw) end
            test.eq(values.key("dec", dec("-0.0")), "0")
            test.eq(values.key("dec", dec("000")), "0")
            local tenth = dec("0.10")
            test.eq(tenth.m, 1)
            test.eq(tenth.e, -1)
            test.eq(values.key("dec", tenth), "0.1")
            test.eq(values.key("dec", dec("100")), "100")
            dec("999999999999999")
            bad(DEC, "9999999999999999")
            dec("0.000000000001")
            bad(DEC, "0.0000000000001")
            bad(DEC, { m = 1.5, e = 0 })
            bad(DEC, { m = 1 })
            bad(DEC, { m = "1", e = 0 })
            local ten = dec({ m = 10, e = 0 })
            test.eq(ten.m, 1)
            test.eq(ten.e, 1)
            bad(DEC, { m = 1, e = 13 })
            dec({ m = 1, e = 12 })
        end)

        test.it("accepts only plain integers within 2^53", function()
            test.eq(ok(INT, "12"), 12)
            test.eq(ok(INT, "12.0"), 12)
            test.eq(ok(INT, 12.0), 12)
            test.eq(ok(INT, 9007199254740991), 9007199254740991)
            for _, raw in ipairs({ "abc", "0x10", "1e3", " 42 ", "12.5", "" }) do bad(INT, raw) end
            bad(INT, true)
            bad(INT, 9007199254740992)
            bad(INT, -9007199254740992)
            bad(INT, math.mininteger)
            bad(INT, math.maxinteger)
        end)

        test.it("refuses malformed UTF-8 and keeps empty text as a value", function()
            for _, raw in ipairs({ "\192\128", "\237\160\128", "\245\128\128\128", "\226\130", "\128", "a\0b" }) do bad(TEXT, raw) end
            ok(TEXT, "\244\143\191\191")
            bad(TEXT, "\244\144\128\128")
            test.eq(ok(TEXT, ""), "")
        end)

        test.it("folds ASCII case for insensitive keys and limits keys to 256 bytes", function()
            local cfg: types.FieldConfig = { case = "insensitive" }
            test.eq((values.key("text", "AB", cfg)), (values.key("text", "ab", cfg)))
            test.eq(values.key("text", string.rep("a", 256)), string.rep("a", 256))
            test.not_nil(select(2, values.key("text", string.rep("a", 257))))
        end)

        test.it("accepts booleans and calendar times only", function()
            local BOOL: types.ValueShape = { form = "bool", cardinality = "one", config = {} }
            local TIME: types.ValueShape = { form = "time", cardinality = "one", config = {} }
            bad(BOOL, "true")
            bad(BOOL, 1)
            ok(TIME, "2026-11-03T10:00:00.123Z")
            ok(TIME, "2024-02-29")
            for _, raw in ipairs({ "2026-11-03T10:00:00+02:00", "2026-11-3", "2026-11-03T10:00Z", "2026-02-30", "2026-13-01",
                "2025-02-29", "2026-00-10", "2026-11-03T24:00:00Z", "2026-11-03T10:60:00Z" }) do bad(TIME, raw) end
        end)

        test.it("refuses a form it does not normalize", function()
            bad({ form = "banana", cardinality = "one", config = {} }, "x")
            bad({ form = "counter", cardinality = "one", config = {} }, 1)
        end)

        test.it("validates references and their targets", function()
            local ASSET: types.ValueShape = { form = "ref", cardinality = "one", config = { target = "asset" } }
            ok(ASSET, { ref = { "asset", "a1" } })
            ok({ form = "ref", cardinality = "one", config = { target = "component" } }, { ref = { "component", "c1" } })
            bad(ASSET, { ref = { "foo", "x" } })
            bad(ASSET, { ref = { "asset", "" } })
            bad(ASSET, { ref = { "asset", 5 } })
            bad(ASSET, { ref = { "", "x" } })
            bad(ASSET, { ref = "x" })
            bad({ form = "ref", cardinality = "one", config = {} }, { ref = { "asset", "a1" } })
            bad({ form = "ref", cardinality = "one", config = { target = "term" } }, { ref = { "product", "p1" } })
        end)

        test.it("parses quantities and orders them in the canonical unit", function()
            local cfg: types.FieldConfig = { units = { kg = "1", g = "0.001", lb = "0.45359237" }, canonical = "kg", scale = 3 }
            local Q: types.ValueShape = { form = "quantity", cardinality = "one", config = cfg }
            for _, raw in ipairs({ "1kg", " 1 kg ", { value = "1", unit = "kg" }, { v = "1", u = "kg" } } :: { unknown }) do
                local q = ok(Q, raw) :: types.Quantity
                test.eq(q.u, "kg")
                test.eq(q.v.m, 1)
            end
            for _, raw in ipairs({ "1 KG", "1", "kg", "1.2.3 kg", { value = 1.5, unit = "kg" } } :: { unknown }) do bad(Q, raw) end
            test.eq(values.order("quantity", ok(Q, "-1 kg") :: types.Quantity, cfg), -1000)
            test.eq((values.key("quantity", ok(Q, "0.5 kg") :: types.Quantity, cfg)), (values.key("quantity", ok(Q, "500 g") :: types.Quantity, cfg)))
            test.eq(values.order("quantity", ok(Q, "2 lb") :: types.Quantity, cfg), 907)
            test.eq(values.order("quantity", ok(Q, "1.0005 kg") :: types.Quantity, cfg), 1001)
            test.not_nil(select(2, values.order("dec", dec("0.7405"), { scale = 3 })))
            local huge = ok(Q, "999999999999999 lb") :: types.Quantity
            test.not_nil(select(2, values.key("quantity", huge, cfg)))
        end)

        test.it("bounds order values by range and int64", function()
            test.eq(values.order("int", 9007199254740991, { scale = 2 }), 900719925474099100)
            test.not_nil(select(2, values.order("int", 9007199254740991, { scale = 4 })))
            local cfg: types.FieldConfig = { scale = 2, range = { 0, 100 } }
            test.eq(values.order("dec", dec("100"), cfg), 10000)
            test.not_nil(select(2, values.order("dec", dec("100.01"), cfg)))
            test.not_nil(select(2, values.order("dec", dec("-1"), cfg)))
            test.not_nil(select(2, values.order("text", "a")))
            test.not_nil(select(2, values.key("record", { a = 1 })))
        end)

        test.it("normalizes lists and sets by their rules", function()
            local LIST: types.ValueShape = { form = "text", cardinality = "list", config = {} }
            local SET: types.ValueShape = { form = "text", cardinality = "set", config = {} }
            local list = values.members(LIST, ok(LIST, { "b", "a", "b" }))
            test.eq(#list, 3)
            test.eq(list[1], "b")
            test.eq(#values.members(SET, ok(SET, {})), 0)
            bad(SET, "a")
            local big: { string } = {}
            for i = 1, 1000 do big[i] = "m" .. i end
            ok(SET, big)
            big[1001] = "m1001"
            bad(SET, big)
            bad(LIST, big)
            local ISET: types.ValueShape = { form = "int", cardinality = "set", config = {} }
            local ints = values.members(ISET, ok(ISET, { 9, 10, 10 }))
            test.eq(#ints, 2)
            test.eq(ints[1], 10)
            local RSET: types.ValueShape = { form = "ref", cardinality = "set", config = { target = "term" } }
            test.eq(#values.members(RSET, ok(RSET, { { ref = { "term", "c:a" } }, { ref = { "term", "c:a" } } })), 1)
            local cfg: types.FieldConfig = { units = { kg = "1", g = "0.001", lb = "0.45359237" }, canonical = "kg" }
            local QSET: types.ValueShape = { form = "quantity", cardinality = "set", config = cfg }
            test.eq(#values.members(QSET, ok(QSET, { "1 lb", "453.59237 g" })), 1)
            bad({ form = "record", cardinality = "set", config = { members = { a = { form = "int" } } } }, { { a = 1 } })
            bad(SET, { string.rep("x", 257) })
        end)

        test.it("validates records member by member", function()
            local REC: types.ValueShape = { form = "record", cardinality = "one", config = { members = {
                n = { form = "int" }, tags = { form = "text", cardinality = "set" },
                inner = { form = "record", members = { x = { form = "int" } } } } } }
            ok(REC, {})
            bad(REC, { unknown = 1 })
            local r = ok(REC, { tags = { "b", "a", "a" }, inner = { x = "2" } }) :: types.Record
            test.eq(#(r.tags :: { types.Scalar }), 2)
            test.eq((r.inner :: types.Record).x, 2)
            local _, err = values.normalize(REC, { n = "x" })
            test.is_true(tostring(err):find("n:", 1, true) ~= nil)
            bad({ form = "record", cardinality = "one", config = {} }, { a = 1 })
            bad(REC, "text")
        end)

        test.it("renders canonical text and decimal strings", function()
            test.eq(values.canonical({ [1] = 1, [3] = 3 }), '{"1":1,"3":3}')
            test.is_true(values.equal({}, {}))
            test.eq(assert(json.decode(values.canonical("é"))), "é")
            test.eq(values.dec_string({ m = -5, e = -3 }), "-0.005")
            test.eq(values.dec_string({ m = 123, e = -5 }), "0.00123")
            test.eq(values.dec_string({ m = 12, e = 2 }), "1200")
        end)
    end)
end

return { run = test.run_cases(define) }
