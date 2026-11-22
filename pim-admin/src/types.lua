-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local pim_types = require("pim_types")
type Catalog = { get_schema: (self: Catalog, pim_types.GetSchemaRequest & { catalog_id: string }) -> (pim_types.SchemaView?, error?),
    policy_defaults: (self: Catalog, { catalog_id: string }) -> (pim_types.Policy?, error?) }
type PrincipalRef = { type: "user" | "group", id: string }
type PrincipalRefs = { refs: { PrincipalRef } }
type PrincipalLabel = { type: string, id: string, label: string, sublabel: string? }
type Directory = { resolve: (self: Directory, PrincipalRefs) -> ({ principals: { PrincipalLabel } }?, error?) }
return { Catalog = Catalog, PrincipalRefs = PrincipalRefs, Directory = Directory }
