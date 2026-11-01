-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local extractors = require("extractors")
local evals = require("evals")
local repository = require("repository")
local contract = require("contract")
local security = require("security")
local json = require("json")
local execution_identity = require("execution_identity")
local processing = require("processing")
local retention = require("retention")
local funcs = require("funcs")
local data = require("data")

local OPS = {
    maintenance = function(dto: any): (any?, error?) return funcs.call(dto.id, {}) end,
    retention = function(_dto: any): (any?, error?) return retention.window() end,
    content = function(dto: any): (any?, error?) return processing.content(dto.upload_id) end,
    contract_run = function(dto: any): (any?, error?)
        local definition, err = contract.get("kickside.docscout:extraction")
        if err then return nil, err end
        local instance, open_err = definition:with_actor(security.actor()):with_scope(security.scope()):open("kickside.docscout:engine")
        if open_err then return nil, open_err end
        return instance:run(dto.input)
    end,
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
    raw_eval = function(dto: any): (any?, error?) return repository.get_eval(dto.eval_id, true) end,
    queue_eval = function(dto: any): (any?, error?)
        local snapshot, err = extractors.get(dto.id)
        if err then return nil, err end
        local identity, identity_err = execution_identity.capture()
        if identity_err then return nil, identity_err end
        local row, row_err = execution_identity.to_row(identity)
        if row_err then return nil, row_err end
        row.config_revision, row.fields, row.config_snapshot = snapshot.expected_revision, assert(json.encode(snapshot.config.fields)), assert(json.encode(snapshot.config))
        return repository.add_eval(dto.id, row, dto.cases, function(tx: any, dbtype: string, eval_id: string): (error?, {[string]: string}?)
            local receipts, admit_err = data.admit_eval_jobs(tx, dbtype, dto.id, eval_id, dto.cases)
            if admit_err then return admit_err end
            if dto.refuse then
                return errors.new({ kind = errors.UNAVAILABLE, retryable = false, message = "admission refused", details = { code = "admission_refused" } })
            end
            return nil, receipts
        end)
    end,
}

return { run = function(dto: any): (any?, error?) return (OPS[dto.op] :: any)(dto) end }
