-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local security = require("security")
local funcs = require("funcs")
local cloudstorage = require("cloudstorage")
local uuid = require("uuid")

local function member_read(path)
    local scope = assert(security.new_scope({
        assert(security.policy("kickside.storage_s3.security:runtime")),
        assert(security.policy("app.storage_s3:member_read_runtime")),
    }))
    return funcs.new():with_actor(assert(security.new_actor("storage-member", {}))):with_scope(scope)
        :call("app.storage_s3:member_read_probe", { path = path })
end

return {
    run = test.run_cases(function()
        test.describe("storage-s3 member cloud authority", function()
            test.it("denies a native entry outside the runtime policy", function()
                local result, err = member_read("s3://app.storage_s3:alternate_s3/ungranted")
                test.is_nil(err, tostring(err))
                test.is_true(result.denied, result.error)
                test.is_nil(result.content)
            end)
        end)
    end),
    relocated = test.run_cases(function()
        test.describe("storage-s3 relocated member reads", function()
            test.it("reads packed bytes through the bound runtime policy", function()
                local key = "member-read-" .. uuid.v4()
                local bytes = "relocated member content " .. key
                local cloud = assert(cloudstorage.get("app.storage_s3:s3"))
                assert(cloud:upload_object(key, bytes, {}))
                local result, err = member_read("s3://app.storage_s3:s3/" .. key)
                local _, delete_err = cloud:delete_objects({key})
                cloud:release()
                test.is_nil(delete_err, tostring(delete_err))
                test.is_nil(err, tostring(err))
                test.is_false(result.denied, result.error)
                test.eq(bytes, result.content)
            end)
        end)
    end),
}
