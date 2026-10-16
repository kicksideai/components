-- KickSide dashboard runtime vocabulary.
--
-- The dashboard discovers installed navigable surfaces from the registry. A
-- surface is declared either as a ui.nav_item (the canonical nav declaration) or
-- as a view.component (a web component the host can mount by tag). Each module's
-- ns.definition carries the human comment used when an entry's own meta has
-- none. These are the registry meta.type values the discovery queries against.

local M = {}

-- A surface declares itself for navigation as a registry.entry with this
-- meta.type. This is the primary source of dashboard cards.
M.NAV_ITEM_TYPE = "ui.nav_item"

-- A web component package declares itself with this meta.type. Used to enrich a
-- nav item's icon/description by its component_tag, and as a fallback source of
-- surfaces that declare a view.component but no nav item.
M.VIEW_COMPONENT_TYPE = "view.component"

-- The module definition entry. Its meta.comment is the per-module sentence
-- used when an entry carries no description of its own.
M.NS_DEFINITION_KIND = "ns.definition"

-- Default icon for a surface that declares none.
M.DEFAULT_ICON = "tabler:square"

-- Order assigned to a surface that declares none, so explicitly-ordered surfaces
-- sort ahead of unordered ones.
M.DEFAULT_ORDER = 500

-- The home surface path. The dashboard owns the home, so it omits the card that
-- would link back to itself.
M.HOME_PATH = "/"

return M
