-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")

type CheckDigestLookup = (string) -> (string?, error?)
type ScopeLookup = (string) -> (boolean, error?)
type PluginLookup = (string) -> error?
type Lookups = {
    type_of: (string) -> (types.TypeMeta?, error?),
    check_digest: CheckDigestLookup?,
    scope: ScopeLookup?,
    plugin: PluginLookup?,
    link_kind: ((string) -> (boolean, error?))?,
}

return { Lookups = Lookups, CheckDigestLookup = CheckDigestLookup, ScopeLookup = ScopeLookup, PluginLookup = PluginLookup }
