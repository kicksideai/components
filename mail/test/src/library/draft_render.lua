-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local registry = require("registry")
local render = require("render")
local types = require("types")

local function with_sets<T>(html: string, text: string,
    run: (types.TemplateSet, types.TemplateSet) -> (T?, error?)): (T?, error?)
    return render.with_sets(html, text, function(html_set: types.TemplateSet, text_set: types.TemplateSet): (T?, error?)
        local park, err = ctx.get("mail_test_park_draft")
        if err and err:kind() ~= errors.NOT_FOUND then error(err) end
        if park then channel.new():receive() end
        local expected, expected_err = ctx.get("mail_test_draft_closure")
        if expected_err and expected_err:kind() ~= errors.NOT_FOUND then return nil, expected_err end
        if expected then
            local overlay, overlay_err = registry.overlay("kickside.mail.render:scratch")
            if overlay_err then return nil, overlay_err end
            local entries, entries_err = overlay:entries()
            if entries_err then return nil, entries_err end
            local names = {}
            for _, entry in ipairs(entries) do
                if entry.kind == "template.jet" then names[entry.meta.name] = true end
            end
            assert(names[expected.message], "The draft includes the selected message")
            assert(names[expected.base], "The draft includes the referenced base")
            assert(not names[expected.unrelated], "The draft excludes the unrelated part")
        end
        return run(html_set, text_set)
    end)
end

return {with_sets = with_sets, face_error = render.face_error, render_face = render.render_face, faces = render.faces}
