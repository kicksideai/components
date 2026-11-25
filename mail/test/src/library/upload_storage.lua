-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local fs = require("fs")
local ctx = require("ctx")
local threads_fixture = require("threads_fixture")

local function get(id)
    local volume, err = fs.get(id)
    if err then return nil, err end
    local storage = {}
    for _, method in ipairs({"stat", "exists", "readfile", "writefile", "mkdir", "mkdir_all", "pwd"}) do
        storage[method] = function(_, ...) return volume[method](volume, ...) end
    end
    function storage:open(path, mode)
        return volume:open(path, mode)
    end
    function storage:remove(path)
        local pause = ctx.get("mail_fixture_upload_pause")
        if pause and path == pause.path then threads_fixture.pause(pause.gate) end
        return volume:remove(path)
    end
    function storage:signed_url()
        return nil
    end
    return storage, nil
end

return {get = get}
