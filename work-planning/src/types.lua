-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local reads = require("reads")
local work = require("work")

type PreviewRequest = { board_id: string, sprint_id: string, rollover_id: string? }
type Snapshot = PreviewRequest & { head: integer, generation: integer, sprint_version: integer, members: { reads.EditMember } }
type Preview = { snapshot: Snapshot, token: string }
type CloseRequest = Preview & { key: string }
type AdoptionRequest = { board_id: string }
type ApplyAdoptionRequest = { review: work.TransitionAdoptionReview, token: string, key: string }
type SchemaRequest = { config: { issue_types: { string }? } }
type ItemTypeExtension = { id: string, fields: { string } }
type SchemaResult = { fragment: { item_types: { ItemTypeExtension } } }
type EstimateFields = { original: string, remaining: string }
type EstimateFieldsClient = {
    fields: (self: EstimateFieldsClient, request: { board_id: string }) -> (EstimateFields?, error?),
}

return {
    PreviewRequest = PreviewRequest, Snapshot = Snapshot, Preview = Preview, CloseRequest = CloseRequest,
    AdoptionRequest = AdoptionRequest, ApplyAdoptionRequest = ApplyAdoptionRequest,
    SchemaRequest = SchemaRequest, ItemTypeExtension = ItemTypeExtension, SchemaResult = SchemaResult,
    EstimateFields = EstimateFields, EstimateFieldsClient = EstimateFieldsClient,
}
