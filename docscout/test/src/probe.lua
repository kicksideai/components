-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local extractors=require("extractors")
return {run=function(dto)
    if dto.op=="create" then return extractors.create(dto.input) end
    if dto.op=="get" then return extractors.get(dto.id) end
    if dto.op=="update" then return extractors.update(dto.id,dto.input) end
    if dto.op=="add_case" then return extractors.add_case(dto.id,dto.input) end
    if dto.op=="delete_case" then return extractors.delete_case(dto.id,dto.case_id) end
    if dto.op=="delete" then return extractors.delete(dto.id) end
    return extractors.list()
end}
