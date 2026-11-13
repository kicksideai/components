-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local reads = require("reads")
local domain = require("domain")
type Sort = domain.Sort
type View = {
    type: string, where: domain.Where?, order: reads.Order?, group_by: string?, sub_group_by: string?,
    scopes: { domain.ScopeQuery }?, columns: { string }?, card: domain.JsonObject?, config: domain.JsonObject?,
}
type ViewContext = { board_id: string, view: View }
type CreateViewRequest = { board_id: string, view: View, title: string?, personal: boolean? }
type SaveViewRequest = { view_id: string, view: View, title: string? }
type RenameViewRequest = { view_id: string, title: string }
type DeleteViewResult = { view_id: string, deleted: boolean, in_progress: boolean }
type RunViewRequest = { view_id: string, limit: integer?, after: domain.Cursor?, min_seq: integer? }
type ViewResult = { view_id: string }
type SavedView = { view_id: string, board_id: string, title: string, view: View }
type ViewList = { views: { SavedView }, after: string? }
type ListViewsRequest = { board_id: string, after: string?, limit: integer? }

type SyncRequest = { board_id: string, deadline: domain.Deadline }
return { SyncRequest = SyncRequest, RenameViewRequest = RenameViewRequest, DeleteViewResult = DeleteViewResult, SavedView = SavedView, ViewList = ViewList, ListViewsRequest = ListViewsRequest, Sort = Sort, View = View, ViewContext = ViewContext, CreateViewRequest = CreateViewRequest, SaveViewRequest = SaveViewRequest,
    RunViewRequest = RunViewRequest, ViewResult = ViewResult }
