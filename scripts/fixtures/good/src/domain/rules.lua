-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- SELECT in a comment is not SQL usage; neither is pcall(f) here.
local message = "select an item from the list"
local note = "pcall(f) in a string is text"
return { message = message, note = note }
