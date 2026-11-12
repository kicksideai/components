-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

type Json = nil | boolean | number | string | {Json} | {[string]: Json}
type TextPart = {type: string, text: string}
type ImagePart = {type: string, source: {type: string, mime_type: string, data: string}}
type UserContent = string | {TextPart | ImagePart}

type PageRange = {first: integer, last: integer}
type PageSet = {upload_id: string, revision: string, checksum: string, count: integer, states: {[integer]: string}, images: PageImageHolder}
type PageImage = {page: integer, revision: string, image_checksum: string, bytes: string, mime_type: string, size: integer}
type PageImageHolder = {bytes: integer, clock: integer, entries: {[integer]: {image: PageImage, used: integer}}}
type PageSpan = {page: integer?, text: string}
type Chunk = {id: string?, ordinal: integer, section_id: string, heading_path: string, content: string,
    page_start: integer?, page_end: integer?, page_spans: {PageSpan}}
type Field = {name: string, group: string, description: string, type: string, strategy: string,
    search_within: string, evidence_required: boolean, validation_hints: string, expected_format: string,
    item: Field?, properties: {Field}?, enum_values: {string}?}
type Evidence = {quote: string, section: string, page: integer, image_checksum: string,
    source_revision: string, found: boolean?}
type Verification = {kind: string, status: string, checks: {[string]: string}}
type PageValue = {name: string, path: string, value: Json?, confidence: number, evidence: {Evidence}, verified: boolean,
    missing: boolean, failed: boolean, error: Json?, complete: boolean?, reason: string?, codes: {string}?,
    extraction_kind: string, source_revision: string, verification: Verification}
type ExtractConfig = {model: string, max_output_tokens: integer, max_fields_per_call: integer, max_pages: integer, temperature: number?}
type VerifyConfig = {model: string, enabled: boolean, check_support: boolean, check_quotes: boolean,
    check_completeness: boolean?, max_tokens: integer?, temperature: number?}
type PageConfig = {fields: {Field}, stages: {extract: ExtractConfig, verify: VerifyConfig}, retrieval: {split_headings: boolean}}
type PageRun = {config: PageConfig, page_images: PageSet, document: {id: string}, page_range: PageRange?,
    regions: {[string]: {integer}}, values: {PageValue}, budget_dropped: {[string]: boolean}?,
    field_errors: {[string]: error}?, pool: {provenance: {[integer]: Provenance}}}
type PageCall = {fields: {Field}, passages: {Chunk}}
type Provenance = {fields: {[string]: boolean}, cited: {[string]: boolean}, excluded: {[string]: boolean}, rank: number?}
type PageCandidate = {ordinal: integer, image: PageImage?}
type PageAllocation = (unknown, {PageCandidate}, {string}, ({PageCandidate}) -> boolean) -> ({PageCandidate}, {[string]: integer})
type SupportLine = (Field, PageValue, string?) -> string
type PageStep = {meter: unknown, message: string?, status: string?}

return {}
