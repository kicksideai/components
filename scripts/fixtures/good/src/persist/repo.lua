-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local function get(db, id)
    return db:query([[
        WITH recent AS (SELECT id FROM acme_good_item ORDER BY id DESC LIMIT 10)
        SELECT i.id FROM acme_good_item i JOIN recent r ON r.id = i.id WHERE i.id = ?]], { id })
end
return { get = get }
