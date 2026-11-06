-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
return {delete = function(): (any?, error?)
    return nil, errors.new({kind = errors.INTERNAL, retryable = false, message = "fixture cleanup failure"})
end}
