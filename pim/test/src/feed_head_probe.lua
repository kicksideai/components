-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local feed = require("feed")
local threads = require("threads")
local store=require("store")
local function run(input: { catalog_id: string, plugin: string, kind: string, token: string?, head: integer, mismatch:boolean?,interleave:boolean? }): (unknown, error?)
    threads.set_head(input.head)
    threads.set_mismatch(input.mismatch==true)
    store.set(input.interleave and "feed" or "")
    local out,err=feed.page(input.catalog_id,input)
    store.set("")
    threads.set_mismatch(false)
    return out,err
end
return {run=run}
