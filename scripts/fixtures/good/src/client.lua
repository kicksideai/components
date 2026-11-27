-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local function open() return contract.get("acme.good:items") end
return { open = open }
