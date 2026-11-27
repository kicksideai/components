-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local fs = require("fs")
local ctx = require("ctx")
local threads_fixture = require("threads_fixture")

local function get(id: string)
    local volume, err = fs.get(id)
    if err then return nil, err end
    local storage = {}
    function storage:stat(path: string)
        return volume:stat(path)
    end
    function storage:exists(path: string)
        return volume:exists(path)
    end
    function storage:readfile(path: string)
        return volume:readfile(path)
    end
    function storage:writefile(path: string, data, options)
        return volume:writefile(path, data, options)
    end
    function storage:mkdir(path: string)
        return volume:mkdir(path)
    end
    function storage:pwd()
        return volume:pwd()
    end
    function storage:open(path: string, mode: string)
        return volume:open(path, mode)
    end
    function storage:remove(path: string)
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
