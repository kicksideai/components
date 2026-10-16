-- Persistence for app_user_identities: the link between a provider identity
-- (provider + subject) and a local app_users account. One account may have many
-- identities; (provider, subject) is unique.

local sql = require("sql")
local uuid = require("uuid")
local time = require("time")
local consts = require("sso_consts")

local M = {}

local function get_db()
    local db, err = sql.get(consts.db_id())
    if err then
        return nil, "Failed to connect to database: " .. err
    end
    return db
end

-- Booleans round-trip as 0/1 on SQLite and as native booleans on Postgres.
local function to_bool(v)
    return v == true or v == 1 or v == "1" or v == "t" or v == "true"
end

-- Wall-clock timestamps are stored as RFC3339 UTC strings in TEXT columns,
-- identical on SQLite and Postgres (see migrations 01/02).
local function now_value()
    return time.now():utc():format_rfc3339()
end

local function map_row(row)
    if not row then return nil end
    row.email_verified = to_bool(row.email_verified)
    return row
end

-- find_by_subject returns the identity for (provider, subject), or nil.
function M.find_by_subject(provider, subject)
    if not provider or not subject then
        return nil, "provider and subject are required"
    end

    local db, err = get_db()
    if err then return nil, err end

    local query = sql.builder.select("id", "provider", "subject", "user_id", "email", "email_verified", "created_at", "last_login_at")
        :from(consts.TABLE)
        :where("provider = ? AND subject = ?", provider, tostring(subject))

    local rows, qerr = query:run_with(db):query()
    db:release()

    if qerr then
        return nil, "Database operation failed: " .. qerr
    end
    if #rows == 0 then
        return nil
    end
    return map_row(rows[1])
end

-- list_by_user returns every identity linked to a user_id.
function M.list_by_user(user_id)
    if not user_id then
        return nil, "user_id is required"
    end

    local db, err = get_db()
    if err then return nil, err end

    local query = sql.builder.select("id", "provider", "subject", "user_id", "email", "email_verified", "created_at", "last_login_at")
        :from(consts.TABLE)
        :where("user_id = ?", user_id)
        :order_by("created_at ASC")

    local rows, qerr = query:run_with(db):query()
    db:release()

    if qerr then
        return nil, "Database operation failed: " .. qerr
    end
    for i = 1, #rows do
        map_row(rows[i])
    end
    return rows
end

-- create inserts a new identity and returns it. Relies on the UNIQUE(provider,
-- subject) constraint to reject duplicates.
function M.create(data)
    if not data or not data.provider or not data.subject or not data.user_id then
        return nil, "provider, subject and user_id are required"
    end

    local db, err = get_db()
    if err then return nil, err end

    local id = uuid.v4()
    local verified = data.email_verified and true or false
    local stored_verified
    if db:type() == sql.type.SQLITE then
        stored_verified = verified and 1 or 0
    else
        stored_verified = verified
    end

    local ts = now_value()
    local insert = sql.builder.insert(consts.TABLE)
        :set_map({
            id = id,
            provider = data.provider,
            subject = tostring(data.subject),
            user_id = data.user_id,
            email = data.email and data.email:lower() or nil,
            email_verified = stored_verified,
            created_at = ts,
            last_login_at = ts,
        })

    local _, ierr = insert:run_with(db):exec()
    db:release()

    if ierr then
        return nil, "Database operation failed: " .. ierr
    end

    return {
        id = id,
        provider = data.provider,
        subject = tostring(data.subject),
        user_id = data.user_id,
        email = data.email and data.email:lower() or nil,
        email_verified = verified,
    }
end

-- touch_login stamps last_login_at on an identity.
function M.touch_login(id)
    if not id then return false, "id is required" end

    local db, err = get_db()
    if err then return false, err end

    local update = sql.builder.update(consts.TABLE)
        :set("last_login_at", now_value())
        :where("id = ?", id)

    local _, uerr = update:run_with(db):exec()
    db:release()

    if uerr then
        return false, "Database operation failed: " .. uerr
    end
    return true
end

-- count_by_user returns how many identities a user has (for the unlink guard).
function M.count_by_user(user_id)
    if not user_id then return 0, "user_id is required" end

    local db, err = get_db()
    if err then return 0, err end

    local rows, qerr = sql.builder.select("COUNT(*) AS n")
        :from(consts.TABLE)
        :where("user_id = ?", user_id)
        :run_with(db):query()
    db:release()

    if qerr then
        return 0, "Database operation failed: " .. qerr
    end
    return tonumber(rows[1] and rows[1].n) or 0
end

-- delete_for_user_provider removes a single provider link for a user.
function M.delete_for_user_provider(user_id, provider)
    if not user_id or not provider then
        return false, "user_id and provider are required"
    end

    local db, err = get_db()
    if err then return false, err end

    local _, derr = sql.builder.delete(consts.TABLE)
        :where("user_id = ? AND provider = ?", user_id, provider)
        :run_with(db):exec()
    db:release()

    if derr then
        return false, "Database operation failed: " .. derr
    end
    return true
end

-- delete_by_user removes every identity for a user (user.deleted cleanup). The FK
-- cascade also covers this, but the module deletes explicitly so the hook is
-- self-contained and order-independent.
function M.delete_by_user(user_id)
    if not user_id then return false, "user_id is required" end

    local db, err = get_db()
    if err then return false, err end

    local _, derr = sql.builder.delete(consts.TABLE)
        :where("user_id = ?", user_id)
        :run_with(db):exec()
    db:release()

    if derr then
        return false, "Database operation failed: " .. derr
    end
    return true
end

return M
