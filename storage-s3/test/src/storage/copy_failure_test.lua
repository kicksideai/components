-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local cloud_factory = require("cloud_factory")
local copier = require("copier")
local fs = require("fs")

local function source(bytes: string): any
    local position = 1
    return {
        stat = function() return { size = #bytes }, nil end,
        read = function(_, size)
            local chunk = bytes:sub(position, position + size - 1)
            position = position + #chunk
            return chunk, nil
        end,
        seek = function(_, _whence, offset) position = offset + 1; return offset, nil end,
        close = function() return true, nil end,
    }
end

local function copy(bytes: string): (any?, any?)
    local volume = assert(fs.get("app:uploads"))
    local paths = {}
    local staging = {
        open = function(_, path, mode) paths[path] = true; return volume:open(path, mode) end,
        remove = function(_, path) return volume:remove(path) end,
    }
    local result, err = copier.copy(source(bytes), assert(cloud_factory.get("test")), "object", "text/plain", staging)
    for path in pairs(paths) do
        local exists, exists_err = volume:exists(path)
        test.is_nil(exists_err)
        test.is_false(exists, "verification temporary file remains")
    end
    return result, err
end

return { run = test.run_cases(function()
    test.describe("storage-s3 copy verification", function()
        test.it("returns an upload error without deleting its source", function()
            cloud_factory.reset("upload_error")
            local copied, copy_err = copy("source bytes")
            test.is_nil(copied)
            test.not_nil(copy_err)
            test.is_true(errors.is(copy_err, errors.UNAVAILABLE))
        end)

        test.it("rejects a stored object with a mismatched size", function()
            cloud_factory.reset("head_mismatch")
            local copied, copy_err = copy("source bytes")
            test.is_nil(copied)
            test.not_nil(copy_err)
            test.is_true(errors.is(copy_err, errors.INVALID))
        end)

        test.it("rejects same-size corruption before allowing source cleanup", function()
            cloud_factory.reset("corrupt")
            local copied, copy_err = copy("source bytes")
            test.is_nil(copied)
            test.not_nil(copy_err)
            test.is_true(errors.is(copy_err, errors.INVALID))
        end)

        test.it("returns a verification download failure and removes its temporary file", function()
            cloud_factory.reset("download_error")
            local copied, copy_err = copy("source bytes")
            test.is_nil(copied)
            test.is_true(errors.is(copy_err, errors.UNAVAILABLE))
        end)

        for _, bytes in ipairs({ "", "source bytes", string.rep("a", 1024 * 1024 + 3) }) do
            test.it("verifies and releases staging for " .. tostring(#bytes) .. " bytes", function()
                cloud_factory.reset("normal")
                local copied, copy_err = copy(bytes)
                test.is_nil(copy_err, tostring(copy_err))
                test.is_true(copied)
                test.eq(cloud_factory.bytes("object"), bytes)
            end)
        end
    end)
end) }
