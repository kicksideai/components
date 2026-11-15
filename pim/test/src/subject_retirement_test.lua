-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test=require("test")
local fixture=require("fixture")
local trash_fixture=require("trash_fixture")
local store=require("store")
local funcs=require("funcs")
local jobs=require("jobs")
local time=require("time")
local security=require("security")
local registry=require("registry")
local scoped=require("scoped")
local OLD="2000-01-01T00:00:00Z"
local function subjects(h)
    local db=assert(store.open())
    local rows=assert(db:query("SELECT subject,version FROM kickside_thread_subject WHERE thread_id=$1",{h.id}))
    assert(db:release())
    local out={}
    for _,row in ipairs(rows) do out[row.subject]=tonumber(row.version) end
    return out
end
local function age(h,state)
    trash_fixture.exec("UPDATE kickside_pim_product SET state_at=$1 WHERE catalog_id=$2 AND state=$3",{OLD,h.id,state})
end
local function tombs(h)
    local db=assert(store.open())
    local n=tonumber(assert(db:query("SELECT COUNT(*) AS n FROM kickside_pim_product WHERE catalog_id=$1 AND state='purged'",{h.id}))[1].n)
    assert(db:release());return n
end
local function define()
    test.describe("permanent product subject retirement",function()
        test.it("retires bounded product and release pages while retaining live and reusable term subjects",function()
            local h=fixture.catalog()
            assert(h.call("apply_schema",{declaration={channels={{id="web"}}}}))
            local items={}
            for n=1,40 do items[n]={product={sku="retire-"..n},create={}} end
            local created=assert(h.call("apply",{items=items}))
            local release,remove={},{}
            for _,out in ipairs(created.outcomes) do
                test.eq(out.outcome,"created")
                release[#release+1]={product={id=out.product_id},expect_version=1}
                remove[#remove+1]={product={id=out.product_id},expect_version=1,delete=true}
            end
            local keeper=assert(h.call("apply",{items={{product={sku="keeper"},create={}}}})).outcomes[1].product_id
            local published=assert(h.call("release",{items=release}))
            for _,out in ipairs(published.outcomes) do test.eq(out.outcome,"released") end
            assert(h.call("release",{items={{product={id=keeper},expect_version=1}}}))
            local before=subjects(h)
            test.not_nil(before["r:"..keeper])
            for _,item in ipairs(release) do test.not_nil(before["r:"..item.product.id]) end
            assert(h.call("apply",{items=remove}))
            age(h,"trashed");assert(fixture.retain());assert(h.call("settle",{}));age(h,"purged")
            test.eq(tombs(h),40)
            local one=trash_fixture.run_owner(h)
            test.is_true(one.needs_continue)
            local remaining=tombs(h)
            test.is_true(remaining<40 and remaining>=28,"charge three subject seeks plus each tombstone deletion against the 50-row catalog share")
            assert(fixture.retain());test.eq(tombs(h),0)
            local after=subjects(h)
            for _,item in ipairs(release) do
                test.is_nil(after["p:"..item.product.id]);test.is_nil(after["r:"..item.product.id]);test.is_nil(after["model-release:"..item.product.id])
                local stale=assert(h.call("apply",{items={{product={id=item.product.id},expect_version="any",restore=true}}}))
                test.eq(stale.outcomes[1].outcome,"invalid")
            end
            test.eq(after["p:"..keeper],before["p:"..keeper]);test.eq(after["r:"..keeper],before["r:"..keeper])
            for name,version in pairs(before) do if name:sub(1,2)=="t:" then test.eq(after[name],version) end end
            -- Expiry of individual releases never ends a live product's release subject.
            trash_fixture.exec("UPDATE kickside_pim_release SET created_at=$1 WHERE catalog_id=$2",{OLD,h.id})
            assert(fixture.retain());test.eq(subjects(h)["r:"..keeper],before["r:"..keeper])
            assert(h.call("apply",{items={{term={vocabulary="colors",code="moss"},retired=true}}}))
            local term_version=subjects(h)["t:colors:moss"]
            trash_fixture.exec("UPDATE kickside_pim_term SET retired_at=$1 WHERE catalog_id=$2 AND vocabulary='colors' AND code='moss'",{OLD,h.id})
            assert(fixture.retain());test.eq(subjects(h)["t:colors:moss"],term_version)
            assert(h.call("apply",{items={{term={vocabulary="colors",code="moss"},labels={en="Reused"}}}}))
            test.eq(subjects(h)["t:colors:moss"],term_version+1)
        end)
        test.it("retires the model-release producer only after permanent model purge",function()
            local h=fixture.catalog();fixture.boot(h)
            local model=assert(h.call("get",{product={sku="RDG"}})).product
            local queued=assert(h.call("release",{items={{product={id=model.product_id},expect_version=model.version}}}))
            local job_id=queued.outcomes[1].job_id;test.not_nil(job_id)
            local done=false
            for _=1,600 do
                if assert(jobs.get_job(job_id)).status=="done" then done=true;break end
                time.after("50ms"):receive()
            end
            test.is_true(done);test.not_nil(subjects(h)["model-release:"..model.product_id])
            local db=assert(store.open())
            local rows=assert(db:query("SELECT product_id,version FROM kickside_pim_product WHERE catalog_id=$1 AND state='live' ORDER BY level DESC,product_id",{h.id}));assert(db:release())
            for _,row in ipairs(rows) do assert(h.call("apply",{items={{product={id=row.product_id},expect_version=tonumber(row.version),delete=true}}})) end
            age(h,"trashed");assert(fixture.retain());assert(h.call("settle",{}));age(h,"purged");assert(fixture.retain())
            test.eq(tombs(h),0);local after=subjects(h)
            test.is_nil(after["model-release:"..model.product_id]);test.is_nil(after["p:"..model.product_id])
        end)
        test.it("keeps the durable tombstone after an ambiguous retirement and retries missing names",function()
            local h=fixture.catalog()
            local id=assert(h.call("apply",{items={{product={sku="ambiguous"},create={}}}})).outcomes[1].product_id
            trash_fixture.trash(h,"ambiguous");age(h,"trashed");assert(fixture.retain());assert(h.call("settle",{}));age(h,"purged")
            local db=assert(store.open())
            assert(db:execute("UPDATE kickside_pim_retention SET catalog_id=$1,inclusive=1,product_after='',pending=0,deadline_ms=NULL WHERE owner_id='pim'",{h.id}));assert(db:release())
            local out=assert(funcs.call("app:retirement_ambiguous_owner",{}))
            test.is_true(out.success);test.is_true(#out.blocked>0);test.eq(tombs(h),1)
            test.is_nil(subjects(h)["p:"..id],"Core completed before the injected lost reply")
            trash_fixture.run_owner(h);test.eq(tombs(h),0)
        end)
        test.it("keeps retirement authority exclusively in the exact-class retention owner scope",function()
            local policy=assert(security.policy("kickside.pim.security:subject_retirement"))
            local actor=security.new_actor("probe",{})
            test.eq(policy:evaluate(actor,"threads.subjects.retire","pim.catalog"),"allow")
            test.eq(policy:evaluate(actor,"threads.subjects.retire","work.board"),"undefined")
            local entry=assert(registry.get("kickside.pim.security:subject_retirement"))
            test.is_true(entry.meta.private);test.is_true(entry.meta.service_only)
            local members=assert(security.named_scope("kickside.security.groups:members"))
            test.is_false(members:contains("kickside.pim.security:subject_retirement"))
            local owner=assert(registry.get("kickside.pim.retention:owner"))
            local found=false
            for _,id in ipairs(owner.data.security.policies) do if id=="kickside.pim.security:subject_retirement" then found=true end end
            test.is_true(found)
            local member=scoped.member()
            local h=scoped.catalog(member)
            local executor=funcs.new():with_actor(member.actor):with_scope(member.scope:with(assert(security.policy("app:retirement_probe_call"))))
            local out,err=executor:call("app:retirement_member_call",{catalog_id=h.id})
            test.is_nil(out);test.not_nil(err);test.eq(err:kind(),errors.PERMISSION_DENIED)
            test.not_nil(tostring(err):find("subject retirement denied",1,true),tostring(err))
        end)
    end)
end
return {run=test.run_cases(define)}
