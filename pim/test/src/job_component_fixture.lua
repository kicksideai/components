-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local fixture = require("fixture")
local component = require("component")
return { get_private_context = fixture.get_private_context, ACCESS = component.ACCESS, validate_access = component.validate_access }
