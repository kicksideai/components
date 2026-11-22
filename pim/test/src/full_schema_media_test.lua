-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local fixture = require("fixture")
local json = require("json")
local registry = require("registry")
local retention_rows = require("retention_rows")
local scoped = require("scoped")
local sql = require("sql")
local steps = require("steps")
local test = require("test")
local time = require("time")
local types = require("types")
local catalog_fixture = require("catalog_fixture")
local base64 = require("base64")
local hash = require("hash")
local http_client = require("http_client")
local fs = require("fs")
local funcs = require("funcs")
local uuid = require("uuid")

type Map = { [string]: unknown }

local function call(h: fixture.Handle, op: string, request: unknown): Map
    local out, err = h.call(op, request)
    assert(out and not err, op .. ": " .. tostring(err) .. " " .. json.encode(err and err:details() or {}))
    return out :: Map
end

local function refused(h: fixture.Handle, op: string, request: unknown, kind: string, code: string?): error
    local out, err = h.call(op, request)
    test.is_nil(out)
    local problem = assert(err)
    test.eq(problem:kind(), kind, tostring(problem))
    if code then test.eq(problem:details().code, code, tostring(problem)) end
    return problem
end

local function catalog(session: scoped.Session?): fixture.Handle
    local h = session and scoped.catalog(session, true) or fixture.catalog({ bare = true })
    local declaration = assert(registry.get("app:full_schema")).data
    local request = { declaration = declaration, expected_generation = 1 }
    local plan = call(h, "plan_schema", request) :: types.SchemaPlanResult
    test.eq(plan.class, "additive")
    test.eq(#plan.refused, 0)
    test.eq(call(h, "apply_schema", request).generation, 2)
    local terms = call(h, "apply", { items = {
        { term = { vocabulary = "categories", code = "goods" }, labels = { en = "Goods" } },
        { term = { vocabulary = "categories", code = "boots" }, parent = "goods", labels = { en = "Boots", de = "Stiefel" } },
        { term = { vocabulary = "categories", code = "old" }, parent = "goods", retired = true },
        { term = { vocabulary = "finishes", code = "oak" }, labels = { en = "Oak" } },
        { term = { vocabulary = "finishes", code = "ash" }, labels = { en = "Ash" } },
    } })
    test.is_true(terms.applied, json.encode(terms))
    return h
end

local function edit(h: fixture.Handle, sku: string, patch: Map): types.Outcome
    patch.product = { sku = sku }
    patch.expect_version = steps.version(h, sku)
    return call(h, "apply", { items = { patch } }).outcomes[1] :: types.Outcome
end

local function outcome(result: types.Outcome, expected: string, code: string?)
    test.eq(result.outcome, expected, json.encode(result))
    if code then test.eq(assert(result.findings)[1].code, code, json.encode(result)) end
end

local function create(h: fixture.Handle, sku: string, entries: { types.ValueEntry }?): types.Outcome
    return steps.one(h, { product = { sku = sku }, create = { family = "standalone" }, set = entries })
end

local function release(h: fixture.Handle, sku: string, channels: { string }): types.Outcome
    return call(h, "release", { items = { { product = { sku = sku }, channels = channels,
        expect_version = steps.version(h, sku) } } }).outcomes[1] :: types.Outcome
end

local function snapshot(h: fixture.Handle, id: string?): types.ReleaseRecord
    return call(h, "get_release", { release_id = assert(id) }).release :: types.ReleaseRecord
end

local PNG = assert(base64.decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jk9sAAAAASUVORK5CYII="))

local function send_media(session: scoped.Session, method: string, path: string, body: string?, content_type: string?)
    return assert(http_client.request(method, scoped.api_url() .. path, {
        body = body, headers = {Authorization = "Bearer " .. session.token, ["Content-Type"] = content_type},
    }))
end

local function upload(session: scoped.Session, filename: string, mime: string, bytes: string): string
    local boundary = "pim-media-" .. uuid.v4()
    local body = "--" .. boundary .. '\r\nContent-Disposition: form-data; name="file"; filename="' .. filename .. '"'
        .. "\r\nContent-Type: " .. mime .. "\r\n\r\n" .. bytes .. "\r\n--" .. boundary .. "--\r\n"
    local response = send_media(session, "POST", "/uploads", body, "multipart/form-data; boundary=" .. boundary)
    test.is_true(response.status_code >= 200 and response.status_code < 300, response.body)
    local id = (assert(json.decode(response.body)) :: {uuid: string}).uuid
    assert(id, response.body)
    for _ = 1, 200 do
        local complete = catalog_fixture.count_rows([[SELECT COUNT(*) AS n FROM kickside_uploads
            WHERE uuid=$1 AND storage_state='completed']], {id})
        if complete == 1 then return id end
        time.sleep("25ms")
    end
    error("upload did not complete " .. id)
end

local function attach(h: fixture.Handle, id: string): string
    local asset = call(h, "adopt_asset", {upload_id = id}).asset :: types.Ref
    test.eq(asset.ref[1], "asset")
    return asset.ref[2]
end

local function media_value(id: string): types.ValueEntry
    return {attr = "item.packages", value = {{title = "Pack", details = {targets = {image = { ref = { "asset", id } }}}}}}
end

local function upload_exists(id: string): boolean
    return catalog_fixture.count_rows("SELECT COUNT(*) AS n FROM kickside_uploads WHERE uuid=$1", {id}) == 1
end

local function stored_path(id: string): string
    local db = assert(sql.get("app:db"))
    local rows = assert(db:query("SELECT storage_path FROM kickside_uploads WHERE uuid=$1", {id}))
    db:release()
    return rows[1].storage_path
end

local function retention_until(catalog_id: string, done: () -> boolean)
    for _ = 1, 80 do
        -- Start each bounded owner pass at the catalog whose assets we are checking.
        local db = assert(sql.get("app:db"))
        local cursor_err = retention_rows.advance(db, {catalog_id = catalog_id, inclusive = 1, product_after = ""})
        db:release()
        assert(not cursor_err, tostring(cursor_err))
        local result, err = funcs.call("kickside.pim.retention:owner", {})
        assert(not err and result and result.success, tostring(err) .. " " .. json.encode(result))
        for _, blocked in ipairs(result.blocked or {}) do
            assert(blocked.component_id ~= catalog_id, tostring(blocked.error))
        end
        if done() then return end
        time.sleep("10ms")
    end
    error("media retention did not drain")
end

local function catalog_projection_inputs(): { {type: string, via: string} }
    for _, declaration in ipairs(assert(registry.get("kickside.pim.binding:catalog")).meta.projections) do
        if declaration.kind == "kickside.pim:catalog_model" then
            local inputs = {}
            for _, event in ipairs(declaration.events.input) do
                inputs[#inputs + 1] = {type = event.type, via = "thread"}
            end
            return inputs
        end
    end
    error("catalog projection declaration missing")
end

local function media_cases()
    test.it("adopts media through the catalog cursor while other cursors of the same kind are paused", function()
        local owner = scoped.member()
        local h = catalog(owner)
        local inputs = catalog_projection_inputs()
        for _, address in ipairs({
            {projection_key = "default", cursor_key = "sibling"},
            {projection_key = "archive", cursor_key = "default"},
        }) do
            call(h, "register_catalog_projection", {inputs = inputs, projection_key = address.projection_key, cursor_key = address.cursor_key})
            local paused = call(h, "pause_plugin_projection", {kind = "kickside.pim:catalog_model",
                projection_key = address.projection_key, cursor_key = address.cursor_key})
            test.eq(paused.status, "paused")
        end
        local source = upload(owner, "sibling.png", "image/png", PNG)
        local asset = attach(h, source)
        test.eq(send_media(owner, "GET", "/uploads/" .. asset .. "/raw").body, PNG)
        test.eq(catalog_fixture.count_rows([[SELECT COUNT(*) AS n FROM kickside_projection_cursor
            WHERE thread_id=$1 AND status='paused']], {h.id}), 2)
    end)

    test.it("requires the materialized reservation before copying a personal upload", function()
        local owner = scoped.member()
        local h = catalog(owner)
        local source = upload(owner, "reservation.png", "image/png", PNG)
        local current, previous = catalog_projection_inputs(), {}
        for _, input in ipairs(current) do
            if input.type ~= "kickside.pim.events:asset.reserved" and input.type ~= "kickside.pim.events:assets.reaping" then
                previous[#previous + 1] = input
            end
        end
        test.eq(#previous + 2, #current)
        call(h, "register_catalog_projection", {inputs = previous})
        refused(h, "adopt_asset", {upload_id = source}, errors.CONFLICT, "asset_reservation_unavailable")
        test.eq(catalog_fixture.count_rows("SELECT COUNT(*) AS n FROM kickside_pim_asset WHERE catalog_id=$1", {h.id}), 0)
        test.eq(catalog_fixture.count_rows("SELECT COUNT(*) AS n FROM kickside_uploads WHERE actor_id=$1",
            {"upload-component:" .. h.id}), 0)
        test.eq(send_media(owner, "GET", "/uploads/" .. source .. "/raw").body, PNG)

        call(h, "register_catalog_projection", {inputs = current})
        local asset = attach(h, source)
        test.eq(catalog_fixture.count_rows([[SELECT COUNT(*) AS n FROM kickside_pim_asset
            WHERE catalog_id=$1 AND asset_id=$2 AND adopting=0]], {h.id, asset}), 1)
        test.eq(send_media(owner, "GET", "/uploads/" .. asset .. "/raw").body, PNG)
    end)

    test.it("refuses a missing nested catalog asset as an invalid reference", function()
        local h = catalog()
        outcome(create(h, "MEDIA-MISSING", {media_value("missing")}), "invalid", "invalid_reference")
    end)

    test.it("reads catalog media as a reader, snapshots immutable bytes and collects replaced and deleted assets", function()
        local owner, reader = scoped.member(), scoped.member()
        local h = catalog(owner)
        local personal = upload(owner, "primary.png", "image/png", PNG)
        local first = attach(h, personal)
        local first_raw = "/uploads/" .. first .. "/raw"
        outcome(create(h, "MEDIA", {{attr = "item.category", value = "boots"}, media_value(first)}), "created")
        test.eq(send_media(reader, "GET", first_raw).status_code, 403)
        local grant = call(h, "grant", {subject_id = reader.id, mask = 1})
        test.is_true(grant.success, json.encode(grant))
        local live = assert(reader.call("get", {product = {sku = "MEDIA"}}, h.id)) :: types.GetResult
        local packs = (live.values["item.packages"].value :: unknown) :: {{details: {targets: {image: types.Ref}}}}
        test.eq(packs[1].details.targets.image.ref[2], first)
        local version_bytes = send_media(reader, "GET", first_raw)
        test.eq(version_bytes.status_code, 200, version_bytes.body)
        test.eq(version_bytes.body, PNG)
        test.eq(send_media(owner, "DELETE", "/uploads/" .. personal).status_code, 200)
        test.eq(send_media(reader, "GET", first_raw).body, PNG)

        local previous = release(h, "MEDIA", {"web"})
        outcome(previous, "released")
        local captured = snapshot(h, previous.release_id)
        local link = assert(assert(captured.snapshot.links)["asset:" .. first])
        test.eq(assert(link.data).checksum, hash.sha256(PNG))
        test.eq(assert(link.data).content_type, "image/png")
        test.eq(assert(link.data).size, #PNG)

        local replacement_bytes = PNG .. "replacement"
        local second = attach(h, upload(owner, "replacement.png", "image/png", replacement_bytes))
        test.is_true(first ~= second)
        outcome(edit(h, "MEDIA", {set = {media_value(second)}}), "updated")
        outcome(release(h, "MEDIA", {"web"}), "released")
        outcome(edit(h, "MEDIA", {unset = {{attr = "item.packages"}}}), "updated")
        local first_path = stored_path(first)
        local db = assert(sql.get("app:db"))
        assert(db:execute("UPDATE kickside_pim_release SET created_at='2000-01-01T00:00:00Z' WHERE catalog_id=$1 AND release_id=$2",
            {h.id, previous.release_id}))
        db:release()
        test.eq(snapshot(h, previous.release_id).hash, captured.hash)
        test.eq(send_media(reader, "GET", first_raw).body, PNG)
        retention_until(h.id, function() return not upload_exists(first) end)
        test.is_false(assert(fs.get("app:exports")):exists(first_path))
        local fence_id = "kickside.pim.events:assets.reaping"
        local schema = assert(registry.get(fence_id)).data.schema
        local fenced, reserved = false, false
        for _, event in ipairs(call(h, "events", {}).events) do
            if event.type == fence_id then
                local body = type(event.body) == "string" and assert(json.decode(event.body)) or event.body
                test.is_true(json.validate(schema, body))
                fenced = fenced or body.ids[1] == first
            elseif event.type == "kickside.pim.events:asset.reserved" then
                local body = type(event.body) == "string" and assert(json.decode(event.body)) or event.body
                local reservation_schema = assert(registry.get(event.type)).data.schema
                test.is_true(json.validate(reservation_schema, body))
                reserved = reserved or body.asset_id == first
            end
        end
        test.is_true(fenced)
        test.is_true(reserved)
        test.eq(send_media(reader, "GET", first_raw).status_code, 404)
        outcome(edit(h, "MEDIA", {set = {media_value(first)}}), "invalid", "invalid_reference")
        test.eq(send_media(reader, "GET", "/uploads/" .. second .. "/raw").body, replacement_bytes)

        local second_path = stored_path(second)
        test.is_true(call(h, "delete_component", {}).success)
        retention_until(h.id, function() return not upload_exists(second) end)
        test.is_false(assert(fs.get("app:exports")):exists(second_path))
    end)

    test.it("refuses cross-catalog, foreign, wrong-type, oversized and deleted upload references", function()
        local owner, other = scoped.member(), scoped.member()
        local h, foreign = catalog(owner), catalog(other)
        local source = upload(owner, "photo.png", "image/png", PNG)
        local asset = attach(h, source)
        outcome(create(foreign, "FOREIGN", {media_value(asset)}), "invalid", "invalid_reference")
        refused(foreign, "adopt_asset", {upload_id = source}, errors.PERMISSION_DENIED, "asset_adoption_denied")
        outcome(create(h, "PERSONAL", {media_value(source)}), "invalid", "invalid_reference")

        local text_asset = attach(h, upload(owner, "notes.txt", "text/plain", "shoe notes"))
        outcome(create(h, "WRONG-TYPE", {media_value(text_asset)}), "invalid", "asset_media_type")
        local large = attach(h, upload(owner, "large.png", "image/png", PNG .. string.rep("x", 128)))
        outcome(create(h, "TOO-LARGE", {media_value(large)}), "invalid", "asset_too_large")

        test.eq(send_media(owner, "DELETE", "/uploads/" .. source).status_code, 200)
        refused(h, "adopt_asset", {upload_id = source}, errors.NOT_FOUND, "upload_not_found")
    end)
end

local function define()
    test.describe("full schema media", media_cases)
    test.describe("full schema agent tools", function()
        test.it("adopts a personal upload through the agent tool with catalog WRITE", function()
            local owner, member = scoped.member(), scoped.member()
            local h = catalog(owner)
            local source = upload(member, "agent-photo.png", "image/png", PNG)
            local tool_id = "kickside.pim.traits:adopt_asset"
            local meta = assert(registry.get(tool_id)).meta
            local input_schema = assert(json.decode(meta.input_schema))
            local request = {upload_id = source}
            test.is_true(json.validate(input_schema, request))
            test.is_false(json.validate(input_schema, {catalog_id = h.id}))
            test.is_false(json.validate(input_schema, {upload_id = "not-a-uuid"}))

            local executor = funcs.new():with_actor(member.actor):with_scope(member.scope):with_context({catalog_id = h.id})
            call(h, "grant", {subject_id = member.id, mask = 1})
            local denied, access_err = executor:call(tool_id, request)
            test.is_nil(denied)
            test.eq(assert(access_err):kind(), errors.PERMISSION_DENIED)

            call(h, "grant", {subject_id = member.id, mask = 3})
            local result, err = executor:call(tool_id, request)
            assert(result and not err, tostring(err))
            test.is_true(json.validate(assert(json.decode(meta.output_schema)), result))
            local asset = result.asset :: types.Ref
            test.eq(asset.ref[1], "asset")
            test.is_true(asset.ref[2] ~= source)
            local applied, apply_err = executor:call("kickside.pim.traits:apply", {items = {
                {product = {sku = "AGENT-MEDIA"}, create = {family = "standalone"}, set = {media_value(asset.ref[2])}},
            }})
            assert(applied and not apply_err, tostring(apply_err))
            outcome(applied.outcomes[1] :: types.Outcome, "created")

            local foreign = upload(owner, "foreign-photo.png", "image/png", PNG)
            local refused_asset, owner_err = executor:call(tool_id, {upload_id = foreign})
            test.is_nil(refused_asset)
            test.eq(assert(owner_err):kind(), errors.PERMISSION_DENIED)
            test.eq(assert(owner_err):details().code, "asset_adoption_denied")
        end)
    end)
end

return { run = test.run_cases(define) }
