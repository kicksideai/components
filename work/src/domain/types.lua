-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local domain = require("domain")
local commands = require("commands")
local views = require("views")
type Map = { [string]: unknown }
type View = views.View
type PackView = { id: string, title: string, view: views.View, revision: integer? }
type Automation = { id: string, type: string, input: domain.JsonObject, revision: integer? }
type Data = { schema: domain.Declaration, processes: { domain.ProcessDecl }?, views: { PackView }, automations: { Automation },
    traits: { string }, requires: { string }, starter: { items: { commands.Op }, default: boolean } }
type Plugin = domain.PluginView
type Summary = { id: string, title: string?, version: string?, icon: string?, description: string?, digest: string?, requires: { string }?, plugins: { Plugin }?, problem: { code: string, message: string }? }
type Pack = { id: string, title: string, version: string, icon: string, description: string, digest: string, requires: { string }, plugins: { Plugin }, data: Data }
type Discovery = { packs: { Summary } }
type FleetRow = { board_id: string, pack: string, version: string, digest: string, outdated: boolean }
type Fleet = { boards: { FleetRow }, next: integer? }
type Request = { plugin_configs: { [string]: domain.JsonObject }?, board_id: string, pack: string, version: string?, expected_generation: integer, key: string?, starter: boolean?,
    maps: domain.StateMaps?, resolutions: { [string]: string }?, declaration: domain.Declaration?, trace_context: domain.TraceContext? }
type Conflict = { path: string, base: unknown, local_value: unknown, incoming: unknown }
type Plan = { prepared: commands.SchemaPlan?, plugin_configs: { [string]: domain.JsonObject }?, pack: string, version: string, digest: string, generation: integer, class: string, changes: { domain.SchemaChange },
    refused: { domain.SchemaChange }, migration: string?, declaration: domain.Declaration, conflicts: { Conflict }, maps: domain.StateMaps,
    views: { PackView }, automations: { Automation }, traits: { string }, plugins: { string }, base: Data, initial: boolean }
type Result = { operation_id: string, job_id: string, status: string, generation: integer, replayed: boolean? }


return { Map = Map, View = View, PackView = PackView, Automation = Automation, Data = Data, Plugin = Plugin, Pack = Pack, Summary = Summary, Discovery = Discovery, FleetRow = FleetRow, Fleet = Fleet,
    Request = Request, Conflict = Conflict, Plan = Plan, Result = Result }
