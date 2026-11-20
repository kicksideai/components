-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local shape = require("shape")
local types = require("types")
return {
    config = shape.tolerant(assert(json.decode([==[{"type":"object","properties":{"board_id":{"type":"string","minLength":1,"maxLength":255,"description":"Exact Work board component id."},"template_id":{"type":"string","minLength":1,"maxLength":64,"pattern":"^[a-z][a-z0-9_-]*$","description":"Board-local template id."},"version":{"type":"string","minLength":1,"maxLength":36,"pattern":"^[0-9a-f-]{36}$","description":"An exact immutable template version from the catalog."}},"required":["board_id","template_id","version"],"additionalProperties":false}]==])) :: types.Map),
    input = shape.tolerant(assert(json.decode([==[{"type":"object","properties":{"overrides":{"type":"object","maxProperties":200,"additionalProperties":{},"description":"Work field codes mapped to values accepted on create."}},"required":[],"additionalProperties":false}]==])) :: types.Map),
}
