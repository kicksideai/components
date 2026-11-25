-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local library_fixtures = require("library_fixtures")
local security = require("security")
local json = require("json")
local uuid = require("uuid")
local database = require("database")

local function register(support)
    local test = support.test
    local actors = support.actors
    local state = support.state
    local now_ms = support.now_ms
    local caller = support.caller
    local invoke = support.invoke
    local terminal = support.terminal
    local query = support.query
    local change = support.change
    local body = support.body
    local template_request = support.template_request
    local capture_with = support.capture_with
    local refusal = support.refusal

    test.it("rejects excess recipients before calling Users", function()
        local admin, sender = actors.admin, actors.sender
        capture_with(admin)
        assert(change(admin, "driver", "app.mail_harness:second").success)
        local input = body()
        input.cc = {{user_id = "unavailable-without-users-authority"}}
        input.bcc = {"bcc@example.org"}
        local result, err = invoke(sender, "send", input)
        refusal(result, err, errors.INVALID, "too_many_recipients")
        test.eq(2, err:details().maximum)
    end)

    test.it("refuses excess recipients before queuing", function()
        local admin, sender = actors.admin, actors.sender
        capture_with(admin)
        assert(change(admin, "driver", "app.mail_harness:second").success)
        local input = body()
        input.cc = {"cc@example.org"}
        input.bcc = {"bcc@example.org"}
        local count_sql = "SELECT COUNT(*) AS n FROM mail_message WHERE subject=$1"
        input.subject = "Recipient limit test"
        local before = query(count_sql, {input.subject})[1].n
        local result, err = invoke(sender, "send", input)
        refusal(result, err, errors.INVALID, "too_many_recipients")
        test.eq("max_recipients", err:details().limit)
        test.eq(2, err:details().maximum)
        test.eq(before, query(count_sql, {input.subject})[1].n)
    end)

    test.it("bounds raw and rendered subjects and bodies before queuing", function()
        local admin, sender = actors.admin, actors.sender
        capture_with(admin)
        for _, case in ipairs({{"subject", 256, "subject_too_long"},
            {"text", 262145, "text_too_large"}, {"html", 262145, "html_too_large"}}) do
            local input = body()
            input[case[1]] = string.rep("a", case[2])
            local value, err = invoke(sender, "send", input)
            refusal(value, err, errors.INVALID, case[3])
        end
        local template = template_request()
        template.vars.subject = string.rep("é", 256)
        local value, err = invoke(sender, "send", template)
        refusal(value, err, errors.INVALID, "subject_too_long")
        local draft = {
            kind = "message", name = "rendered-text-boundary", from = {kind = "message", name = "notice"},
            text = "{{ block body() }}" .. string.rep("{{ vars.message }}", 65) .. "{{ end }}",
        }
        local preview = assert(library_fixtures.call(nil, "preview", {message = draft.name, create = draft}))
        draft.preview_id = assert(preview.preview_id)
        local amplifying = assert(library_fixtures.call(nil, "create", draft))
        library_fixtures.await_live(amplifying.seq)
        template.template = amplifying.name
        template.vars.subject = "Status"
        template.vars.message = string.rep("a", 4096)
        value, err = invoke(sender, "send", template)
        assert(library_fixtures.call(nil, "delete", {
            kind = amplifying.kind, name = amplifying.name, expected_revision = amplifying.revision,
        }))
        refusal(value, err, errors.INVALID, "text_too_large")
    end)

    test.it("lists and reads only the sender's messages unless the viewer holds log administration", function()
        local admin, sender, log_admin = actors.admin, actors.sender, actors.log_admin
        capture_with(admin)
        local other = caller({"kickside.mail.security:send_access"})
        local one = assert(invoke(sender, "send", body()))
        local two = assert(invoke(sender, "send", body()))
        local three = assert(invoke(other, "send", body()))
        local sent = terminal(sender, one)
        test.is_nil(sent.driver_id)
        test.is_nil(sent.provider_message_id)
        terminal(sender, two)
        terminal(other, three)
        local denied_value, denied_err = invoke(other, "get_message", one.message_id)
        refusal(denied_value, denied_err, errors.NOT_FOUND, "message_not_found")
        local page = assert(invoke(sender, "list_messages", {limit = 1, status = "sent"}))
        test.eq(two.message_id, page.items[1].message_id)
        test.is_nil(page.items[1].driver_id)
        test.is_nil(page.items[1].provider_message_id)
        test.is_true(page.has_more)
        local second = assert(invoke(sender, "list_messages", {limit = 1, status = "sent", cursor = page.next_cursor}))
        test.eq(one.message_id, second.items[1].message_id)
        test.is_false(second.has_more)
        test.is_nil(second.next_cursor)
        local expired_filter = assert(invoke(sender, "list_messages", {limit = 5, since = sent.created_at + 100000}))
        test.eq(0, #expired_filter.items)
        local others = assert(invoke(other, "list_messages", {limit = 5}))
        test.eq(1, #others.items)
        test.eq(three.message_id, others.items[1].message_id)
        local all = assert(invoke(log_admin, "list_messages", {limit = 200}))
        local visible = {}
        for _, row in ipairs(all.items) do visible[row.message_id] = row end
        test.is_true(visible[one.message_id] ~= nil and visible[three.message_id] ~= nil)
        test.eq("app.mail_harness:capture", visible[one.message_id].driver_id)
        local admin_row = assert(invoke(log_admin, "get_message", one.message_id))
        test.eq("app.mail_harness:capture", admin_row.driver_id)
        test.eq(one.message_id, assert(json.decode(admin_row.provider_message_id)).idempotency_key)
        test.eq(admin_row.provider_message_id, visible[one.message_id].provider_message_id)
    end)

    test.it("uses a character limit for valid UTF-8 Activity searches", function()
        local sender = actors.sender
        local at_limit = {limit = 1, q = string.rep("é", 256)}
        test.eq(0, #assert(invoke(sender, "list_messages", at_limit)).items)
        for _, q in ipairs({at_limit.q .. "é", "invalid" .. string.char(255), "nul" .. string.char(0)}) do
            local value, err = invoke(sender, "list_messages", {limit = 1, q = q})
            refusal(value, err, errors.INVALID, "invalid_request")
        end
    end)

    test.it("pages equal Activity timestamps by message ID within the caller's search", function()
        local sender, sender_id = actors.sender, actors.sender_id
        local timestamp = now_ms()
        local subject = "Same timestamp"
        local ids = {uuid.v4(), uuid.v4(), uuid.v4()}
        table.sort(ids, function(left, right) return left > right end)
        ids[4] = uuid.v4()
        local other_id = uuid.v4()
        assert(database.with_tx(function(tx)
            for index, id in ipairs({ids[1], ids[2], ids[3], ids[4], other_id}) do
                local created_at = index == 4 and timestamp - 1 or timestamp
                local _, err = tx:execute([[INSERT INTO mail_message
                    (id,created_at,status,finished_at,sent_at,sender,recipients,subject,from_address,attachments)
                    VALUES ($1,$2,'sent',$2,$2,$3,'{"to":["reader@example.org"]}',$4,'mail@example.org','[]')]],
                    {id, created_at, index == 5 and other_id or sender_id, subject})
                if err then return nil, err end
                state.settlement_rows[#state.settlement_rows + 1] = {id = id}
            end
            return true, nil
        end))

        local request = {limit = 1, status = "sent", q = "same timestamp"}
        for index, expected in ipairs(ids) do
            local page = assert(invoke(sender, "list_messages", request))
            test.eq(1, #page.items)
            test.eq(expected, page.items[1].message_id)
            test.eq(index == 4 and timestamp - 1 or timestamp, page.items[1].created_at)
            test.eq(#ids, page.total)
            test.eq(index < #ids, page.has_more)
            if index < #ids then test.not_nil(page.next_cursor) else test.is_nil(page.next_cursor) end
            request.cursor = page.next_cursor
        end
    end)
end

return {register = register}
