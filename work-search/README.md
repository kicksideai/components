<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Work Search

Work Search adds lexical issue search to Work on SQLite and PostgreSQL. It requires
`kickside/work` 0.1.17 or newer and `kickside/search-index` 0.1.4 or newer. Install
`kickside/work-search` and bind `kickside.work_search:target_db` to a SQL database
with SQLite FTS5 or PostgreSQL full-text search support.

The `kickside.work_search:issue_board` pack activates `kickside.work_search:plugin`
and adopts `kickside.work_search:text`. On an existing board, use Work's schema
plan and apply operations to activate the plugin and adopt one scope:

- `kickside.work_search:text` indexes the current issue key and the plain-text
  `title` and `description` field codes. Both fields must be readable by every
  board reader.
- `kickside.work_search:key` indexes issue keys for boards with missing or
  restricted text fields.

Use WorkFindItems or `board.query` with `{ "where": { "match": "search text" } }`.
Combine `match` with ordinary Work filters and pass the returned Work cursor to
the next query. Search collects at most 2,000 lexical candidates in the active generation, then
verifies up to 1,000 current, visible matches for Work to filter and order.
An overflow returns `UNAVAILABLE/search_verification_budget`. An exact current issue key can be
searched in any ASCII letter case. The Work Search trait exposes the read tools
and the Work Search administration trait exposes schema and pack tools. Enable
them with the `kickside.work_search:tool_access` policy. Work enforces board
administration on schema and pack changes.

Search returns `search_indexing` while the current schema's index is being built.
`board.plugin_context` reports the projection's lifecycle and cursor. A parked
worker returns `search_unavailable`. If Work changes during verification or too
many candidates require verification, the query returns a retryable error.
The state feed indexes items visible to the registered projection actor. On a
board with item visibility and administrator bypass, an administrator's projection
can cover all live items.
Search stores live lexical rows and feeds' continuation positions. It keeps a
serving generation and space for one replacement, drains old rows in bounded
pages, and does not store search queries or hit history.
