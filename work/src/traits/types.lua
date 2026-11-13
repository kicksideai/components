-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
type Map = { [string]: unknown }
type Tool = { id: string }
type Contribution = { tools: { Tool }, problems: { [string]: { code: string, message: string } }? }
return { Map = Map, Tool = Tool, Contribution = Contribution }
