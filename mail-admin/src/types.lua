-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}
type Record = { [string]: unknown }
-- A delivery driver as its module declares it, with the optional settings view tag the driver ships.
type Driver = { id: string, label: string, icon: string, description: string, settings_ns: string, settings_view: string? }
M.Record = Record
M.Driver = Driver
return M
