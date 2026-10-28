-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local extractors = require("extractors")
local evals = require("evals")
local repository = require("repository")

local OPS = {
    create = function(dto: any): (any?, error?) return extractors.create(dto.input) end,
    get = function(dto: any): (any?, error?) return extractors.get(dto.id) end,
    update = function(dto: any): (any?, error?) return extractors.update(dto.id, dto.input) end,
    add_case = function(dto: any): (any?, error?) return extractors.add_case(dto.id, dto.input) end,
    delete_case = function(dto: any): (any?, error?) return extractors.delete_case(dto.id, dto.case_id) end,
    delete = function(dto: any): (any?, error?) return extractors.delete(dto.id) end,
    list = function(_dto: any): (any?, error?) return extractors.list() end,
    start_eval = function(dto: any): (any?, error?) return evals.start(dto.id) end,
    list_evals = function(dto: any): (any?, error?) return evals.list(dto.id) end,
    get_eval = function(dto: any): (any?, error?) return evals.get(dto.id, dto.eval_id) end,
    queue_eval = function(dto: any): (any?, error?)
        return repository.add_eval(dto.id, { config_revision = 0, fields = "[]", actor_id = "user:x", actor_context = "{}" }, dto.cases)
    end,
}

return { run = function(dto: any): (any?, error?) return OPS[dto.op](dto) end }
