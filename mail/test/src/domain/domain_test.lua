-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local edit = require("edit")
local jet = require("jet")
local policy = require("policy")
local references = require("references")
local resource = require("resource")
local test = require("test")
local types = require("types")

return {run = test.run_cases(function()
    test.describe("Mail domain", function()
        test.it("expires preview and asset deadlines at the inclusive boundary", function()
            local deadline = 1000
            test.is_false(policy.expired(deadline, deadline - 1))
            test.is_true(policy.expired(deadline, deadline))
            test.is_true(policy.expired(deadline, deadline + 1))
        end)

        test.it("refuses one byte over the aggregate content limit before append", function()
            local limit = 512 * 1024
            local content = {kind = "part", name = "limit", html = string.rep(string.char(1), limit - 2),
                text = string.char(1), description = string.char(1)}
            test.is_nil(resource.check_content(content))
            content.description = content.description .. string.char(1)
            local err = assert(resource.check_content(content))
            test.eq(errors.INVALID, err:kind())
            test.eq("mail_resource_too_large", err:details().code)
        end)

        test.it("collects distinct literal base, part and asset references across the faces", function()
            local content: types.ResourceContent = {
                kind = "message", name = "notice", title = "Notice", description = "",
                schema = {type = "object", properties = {}}, samples = {},
                base = "standard",
                html = [[
                    {{- extends "/base/wrapper" }}
                    {{ include '/part/header' }}
                    {{ assets.logo }} {{ assets["logo-dark"] }}
                ]],
                text = [[{{ include "/part/footer" vars }} {{ assets['logo'] }}]],
                subject = [[{{ include "/part/header" }}]],
            }
            local refs = references.refs(content)
            test.eq(2, #refs.bases)
            test.eq("standard", refs.bases[1])
            test.eq("wrapper", refs.bases[2])
            test.eq(2, #refs.parts)
            test.eq("footer", refs.parts[1])
            test.eq("header", refs.parts[2])
            test.eq(2, #refs.assets)
            test.eq("logo", refs.assets[1])
            test.eq("logo-dark", refs.assets[2])
        end)

        test.it("hashes preview inputs independently of object key order", function()
            local first = {{kind = "part", name = "intro", samples = {name = "Ada", count = 1}}}
            local second = {{name = "intro", samples = {count = 1, name = "Ada"}, kind = "part"}}
            local original = assert(edit.preview_digest("restore", first, {["part/intro"] = 2}, 1))
            test.eq(original, assert(edit.preview_digest("restore", second, {["part/intro"] = 2}, 1)))
            test.is_true(original ~= assert(edit.preview_digest("restore", second, {["part/intro"] = 3}, 1)))
            test.is_true(original ~= assert(edit.preview_digest("restore", second, {["part/intro"] = 2}, 2)))
        end)

        test.it("builds Jet faces with a base and a separate subject entry", function()
            local message: types.ResourceContent = {kind = "message", name = "notice", base = "standard",
                title = "Notice", description = "", html = "HTML", text = "Text", subject = "Subject",
                schema = {type = "object", properties = {}}, samples = {}}
            local entries = jet.entries(message, "scratch:", "html-set", "text-set", {html = "original:html"})
            test.eq(3, #entries)
            test.eq("original:html", entries[1].id)
            test.eq("message/notice", entries[1].meta.name)
            test.eq("html-set", entries[1].data.set)
            test.eq('{{ extends "/base/standard" }}HTML', entries[1].data.source)
            test.eq('{{ extends "/base/standard" }}Text', entries[2].data.source)
            test.eq("scratch:message.notice.subject", entries[3].id)
            test.eq("message/notice.subject", entries[3].meta.name)
            test.eq("text-set", entries[3].data.set)
            test.eq("Subject", entries[3].data.source)
            local asset: types.ResourceContent = {kind = "asset", name = "logo", title = "Logo",
                description = "", html = "", text = "", schema = {type = "object", properties = {}}, samples = {}}
            test.eq(0, #jet.entries(asset, "scratch:", "html-set", "text-set"))
        end)

        test.it("uses the kind and stable name as the event subject", function()
            test.eq("part/header", resource.subject({kind = "part", name = "header"}))
            test.eq("message/header", resource.subject({kind = "message", name = "header"}))
        end)
    end)
end)}
