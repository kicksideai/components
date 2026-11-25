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
        local expected, expected_err = ctx.get("mail_test_expected_scratch_entries")
        if expected_err and expected_err:kind() ~= errors.NOT_FOUND then return nil, expected_err end
        if expected then
            local overlay, overlay_err = registry.overlay("kickside.mail.render:scratch")
            if overlay_err then return nil, overlay_err end
            local entries, entries_err = overlay:entries()
            if entries_err then return nil, entries_err end
            if #entries ~= expected then
                return nil, errors.new({kind = errors.INTERNAL, details = {code = "scratch_entry_count"},
                    message = "Expected " .. tostring(expected) .. " scratch entries, found " .. tostring(#entries)})
            end
        end
        return run(html_set, text_set)
    end)
end

return {with_sets = with_sets, face_error = render.face_error, render_face = render.render_face, faces = render.faces}
