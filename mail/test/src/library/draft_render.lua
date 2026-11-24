-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local render = require("render")
local types = require("types")

local function with_sets<T>(html: string, text: string,
    run: (types.TemplateSet, types.TemplateSet) -> (T?, error?)): (T?, error?)
    return render.with_sets(html, text, function(html_set: types.TemplateSet, text_set: types.TemplateSet): (T?, error?)
        local park, err = ctx.get("mail_test_park_draft")
        if err and err:kind() ~= errors.NOT_FOUND then error(err) end
        if park then channel.new():receive() end
        return run(html_set, text_set)
    end)
end

return {with_sets = with_sets, face_error = render.face_error, faces = render.faces}
