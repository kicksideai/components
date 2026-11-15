-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local links = require("links")
local fixture = require("registry_fixture")
local seams = require("seams")
local plugins = require("plugins")
local scopes = require("scopes")

local function define()
    test.describe("extension registry failures", function()
        test.it("refuses two link owners claiming one kind as a deterministic configuration error", function()
            for _ = 1, 2 do
                local kinds, err = links.kinds()
                test.is_nil(kinds)
                test.not_nil(err)
                test.eq(err:kind(), errors.INTERNAL)
                test.eq(err:details().code, "internal")
                test.eq(err:details().kind, "duplicate.location")
                test.is_false(err:retryable())
            end
        end)

        for _, kind in ipairs({ errors.PERMISSION_DENIED, errors.UNAVAILABLE, errors.INTERNAL }) do
            test.it("preserves " .. kind .. " from registry lookups", function()
                fixture.set(errors.new({ kind = kind, retryable = false, message = "registry refuses lookup", details = { code = "registry_probe", entry = "private" } }))
                for _, load in ipairs({ seams.load_type, plugins.load, scopes.load }) do
                    local value, err = load("private:entry")
                    test.is_nil(value)
                    test.eq(err:kind(), kind)
                    test.is_false(err:retryable())
                    test.eq(err:details().code, "registry_probe")
                end
                local present, err = seams.is_check("private:entry")
                test.is_false(present)
                test.eq(err:kind(), kind)
                for _, list in ipairs({ seams.find_types, plugins.list, scopes.find }) do
                    local value, lerr = list()
                    test.is_nil(value)
                    test.eq(lerr:kind(), kind)
                end
            end)
        end
        test.it("translates only explicit absence into unknown declarations", function()
            for _, absent in ipairs({ false, true }) do
                fixture.set(absent and errors.new({ kind = errors.NOT_FOUND, message = "absent", details = { code = "entry_absent" } }) or nil)
                for _, load in ipairs({ seams.load_type, plugins.load, scopes.load }) do
                    local value, err = load("private:entry")
                    test.is_nil(value)
                    test.eq(err:kind(), errors.INVALID)
                    test.not_nil(err:details().code)
                end
                local present, err = seams.is_check("private:entry")
                test.is_false(present)
                test.is_nil(err)
            end
        end)
    end)
end
return { run = test.run_cases(define) }
