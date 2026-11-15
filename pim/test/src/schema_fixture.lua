-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local TYPES = {
    quantity = { form = "quantity", indexes = { "none", "key", "number" } },
    text = { form = "text", indexes = { "none", "key", "text" } },
    integer = { form = "int", indexes = { "none", "key", "number" } },
    select = { form = "ref", target = "term", indexes = { "none", "key" } },
    rich_text = { form = "text", indexes = { "none", "text" } },
    identifier = { form = "text", indexes = { "none", "key" } },
    number = { form = "dec", indexes = { "none", "key", "number" } },
    boolean = { form = "bool", indexes = { "none", "key" } },
    date = { form = "time", indexes = { "none", "key" } },
    record = { form = "record", indexes = { "none" } },
    untargeted = { form = "ref", indexes = { "none", "key" } },
}
local function types(id: string): (unknown, error?)
    local t = TYPES[id]
    if not t then return nil, errors.new({ kind = errors.INVALID, message = "unknown" }) end
    return t, nil
end

local DECL = {
    dimensions = { { name = "locale", members = { "en", "de", "de-AT" }, fallback = { ["de-AT"] = { "de" } } } },
    vocabularies = { { code = "colors" } },
    aspects = { { namespace = "core", attributes = {
        { code = "name", type = "text", scope = { "locale" }, index = "text", index_contexts = { { locale = "en" } } },
        { code = "color", type = "select", vocabulary = "colors", index = "key" },
        { code = "size", type = "integer", index = "number" },
        { code = "rank", type = "integer" },
    } } },
    families = { { code = "shoe", aspects = { "core" }, variation = { { axes = { "core.color" } }, { axes = { "core.size" } } } } },
}


return { declaration = DECL, type_of = types }
