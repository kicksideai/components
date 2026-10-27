-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local cloud_factory = require("cloud_factory")
local copier = require("copier")

local function source(bytes: string): any
    local read = false
    return {
        stat = function() return { size = #bytes }, nil end,
        read = function(_, _size)
            if read then return "", nil end
            read = true
            return bytes, nil
        end,
        close = function() return true, nil end,
    }
end

return { run = test.run_cases(function()
    test.describe("storage-s3 copy verification", function()
        test.it("returns an upload error without deleting its source", function()
            cloud_factory.reset("upload_error")
            local reader = source("source bytes")
            local copied, copy_err = copier.copy(reader, assert(cloud_factory.get("test")), "object", "text/plain")
            test.is_nil(copied)
            test.not_nil(copy_err)
            test.is_true(errors.is(copy_err, errors.UNAVAILABLE))
        end)

        test.it("rejects a stored object with a mismatched size", function()
            cloud_factory.reset("head_mismatch")
            local copied, copy_err = copier.copy(source("source bytes"), assert(cloud_factory.get("test")), "object", "text/plain")
            test.is_nil(copied)
            test.not_nil(copy_err)
            test.is_true(errors.is(copy_err, errors.INVALID))
        end)
    end)
end) }
