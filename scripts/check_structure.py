#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
"""Structure checker for KickSide modules (gates S1-S16).

Usage:
    check_structure.py <module_dir> [--json] [--greenfield NAME[,NAME]]... [--peer DIR]...

Rules:
    S1  SQL only in src/persist and src/migrations
    S2  layer order (LAYER_ORDER, LAYER_OVERRIDES) and namespace import cycles
    S3  no Lua directly in src/ except client.lua and types.lua
    S4  one _index.yaml per folder, no other entry files, namespace = root + folder path
    S5  strict YAML, source files exist and stay in their folder, Lua registered exactly once
    S6  another module is reached only through its root contracts, :client, :types and public
        policy groups; no ns.requirement targets another module's entry
    S7  host resources only through ns.requirement
    S8  domain entries are pure (no sql, http_client, contract, funcs modules, no foreign client)
    S9  modules with command/: transport (api, sink, traits, blocks) never imports persist
    S10 greenfield modules have exactly one migration
    S11 modules with command/: transport reaches logic only through <root>:client and <root>:types
    S12 persist holds SQL only: no contract, http_client or funcs modules, no foreign client imports
    S13 a module names no id or namespace of a peer that depends on it (plugins, drivers, consumers)
    S14 security.policy resources are exact ids (exceptions for rulebook I1/I2, Mail overlays,
        and '*' with exact eq conditions on own ids)
    S15 no app: ids in source (requirement defaults, entries, Lua strings)
    S16 no pcall/xpcall in src Lua outside tests

--greenfield names match the module directory basename or its root namespace.
--peer loads another module: references into it are checked exactly (S6), and a peer that
declares an ns.dependency on this module is a dependent whose ids this module may not name (S13).
Exit code: 0 clean, 1 findings, 2 usage error.
"""

import argparse
import json
import os
import re
import sys
from collections import defaultdict

import yaml

RULES = {
    "S1": "SQL outside persist/migrations",
    "S2": "layer direction or import cycle",
    "S3": "Lua file directly in src/",
    "S4": "index file / namespace layout",
    "S5": "strict YAML and registration",
    "S6": "cross-module private access",
    "S7": "host resource not from requirement",
    "S8": "impure domain entry",
    "S9": "transport imports persist",
    "S10": "greenfield module with more than one migration",
    "S11": "transport bypasses the module's own client",
    "S12": "contract or HTTP adapter in persist",
    "S13": "module names a dependent module",
    "S14": "policy resource is not an exact id",
    "S15": "app: id in source",
    "S16": "pcall in source Lua",
}

# Layer order, highest first. An entry may import its own folder, another folder on the same
# level, or any folder on a lower level. Transport is never imported by another folder.
# "" is the root namespace (types, client, contract definitions).
LAYER_ORDER = [
    ("transport", ("api", "sink", "traits", "blocks", "binding")),
    ("jobs", ("jobs",)),
    ("command", ("command",)),
    ("read", ("read",)),
    ("persist", ("persist", "migrations", "settings")),
    ("domain", ("domain",)),
    ("root", ("",)),
]
# Per-module placements keyed by root namespace: folder -> level name from LAYER_ORDER.
LAYER_OVERRIDES = {
    "kickside.mail": {"delivery": "jobs", "settings": "jobs", "render": "persist", "driver": "persist"},
    "kickside.mail.resend": {"transport": "transport"},
    "kickside.mail.sendgrid": {"transport": "transport"},
    "kickside.mail.mailgun": {"transport": "transport"},
    "kickside.work": {"plugins": "persist"},
    "kickside.pim": {"plugins": "persist"},
}
LEVEL_RANK = {name: len(LAYER_ORDER) - i for i, (name, _) in enumerate(LAYER_ORDER)}
TRANSPORT_LEVEL = "transport"

SQL_LAYERS = {"persist", "migrations"}
S9_TRANSPORT = {"api", "sink", "traits", "blocks"}
DOMAIN_FORBIDDEN_MODULES = {"sql", "http_client", "contract", "funcs"}
PERSIST_FORBIDDEN_MODULES = {"contract", "http_client", "funcs"}
ROOT_LUA_ALLOWED = {"client.lua", "types.lua"}
PUBLIC_NAMES = {"client", "types"}
HOST_KINDS = {"db.sql", "http.router", "http.service", "http.server", "process.host"}
PRIVATE_SEGMENTS = {
    "persist", "command", "commands", "domain", "read", "reads", "service", "services",
    "migrations", "store", "storage", "outbox", "internal", "repo", "extensions", "plugins",
}
PROSE_KEYS = {"type", "comment", "description", "title", "label", "summary", "help", "placeholder"}
SYSTEM_TABLES = {"sqlite_master", "sqlite_schema", "information_schema", "dual", "excluded"}
SQL_WORDS = {
    "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "NULL", "AS", "ON", "JOIN", "LEFT", "RIGHT",
    "INNER", "OUTER", "LATERAL", "VALUES", "SET", "IF", "EXISTS", "ONLY", "UNNEST", "WITH",
}
# Rulebook I1: module_access grants registry discovery; I2: the private runtime policy grants these.
MODULE_ACCESS_ACTIONS = {"registry.get", "registry.find"}
RUNTIME_ACTIONS = {
    "contract.get", "contract.open", "contract.call", "contract.implementations",
    "contract.security", "funcs.call", "funcs.security",
}
# Mail owns these dynamic overlay namespaces without declaring registry indexes (Mail map Q2).
OVERLAY_NAMESPACES = {
    "kickside.mail": {"kickside.mail.projection", "kickside.mail.draft"},
}
OVERLAY_ENTRY_ACTION = re.compile(r"registry\.overlay\.(?:create|update|delete)\.[a-z0-9_]+(?:\.[a-z0-9_]+)*")
EXACT_OPERATORS = {"eq"}
TEST_META_TYPES = {"test", "test_helper", "test_support"}

REF_RE = re.compile(r"[a-z][a-z0-9_]*(?:\.[a-z0-9_]+)+:(?:\*|[A-Za-z0-9_][A-Za-z0-9_.\-]*)")
APP_ID_RE = re.compile(r"(?<![\w.\-/])app(?:\.[a-z0-9_]+)*:[a-z_][\w.\-]*")
SQL_START_RE = re.compile(
    r"\b(?:SELECT|INSERT\s+INTO|UPDATE\s+[\w\".]+\s+SET|DELETE\s+FROM|CREATE\s+(?:UNIQUE\s+)?"
    r"(?:TABLE|INDEX|VIEW|TRIGGER)|ALTER\s+TABLE|DROP\s+(?:TABLE|INDEX|VIEW)|UPSERT)\b"
)
TABLE_REF_RE = re.compile(
    r"\b(FROM|JOIN|INTO|UPDATE|REFERENCES|TABLE(?:\s+IF\s+(?:NOT\s+)?EXISTS)?)\s+\"?([A-Za-z_][\w]*)\"?(\s*\()?"
)
CTE_RE = re.compile(r"\b([A-Za-z_]\w*)(?:\s*\([^()]*\))?\s+AS\s+(?:NOT\s+)?(?:MATERIALIZED\s+)?\(")
CREATE_TABLE_RE = re.compile(r"\bCREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?\"?([A-Za-z_]\w*)")
SQL_BUILDER_RE = re.compile(r"\bsql\s*\.\s*builder\b")
PCALL_RE = re.compile(r"(?<![\w.:])x?pcall\b")


class Finding:
    __slots__ = ("rule", "file", "line", "message")

    def __init__(self, rule, file, line, message):
        self.rule, self.file, self.line, self.message = rule, file, line or 1, message

    def as_dict(self):
        return {"rule": self.rule, "file": self.file, "line": self.line, "message": self.message}

    def __str__(self):
        return f"{self.rule} {self.file}:{self.line} {self.message}"


# ---------------------------------------------------------------- YAML with lines

class YMap(dict):
    line = 1
    key_lines = None


class YList(list):
    line = 1
    item_lines = None


class YStr(str):
    line = 1


class StrictYaml:
    """Composes YAML to node trees and converts them keeping line numbers.

    Records duplicate keys and implicit null values inside flow mappings
    (the shape produced by an unquoted comma in `{ a: x, y }`)."""

    def __init__(self):
        self._ctor = yaml.SafeLoader("")
        self.problems = []  # (line, message)

    def load(self, text):
        node = yaml.compose(text, Loader=yaml.SafeLoader)
        return None if node is None else self._convert(node)

    def _scalar(self, node):
        value = self._ctor.construct_object(node, deep=True)
        if isinstance(value, str):
            value = YStr(value)
            value.line = node.start_mark.line + 1
        return value

    def _convert(self, node):
        if isinstance(node, yaml.MappingNode):
            out = YMap()
            out.line = node.start_mark.line + 1
            out.key_lines = {}
            merges = []
            for knode, vnode in node.value:
                if knode.tag == "tag:yaml.org,2002:merge":
                    merges.append((vnode, knode.start_mark.line + 1))
                    continue
                key = self._convert(knode)
                kline = knode.start_mark.line + 1
                if isinstance(key, (YMap, YList)):
                    key = str(key)
                if key in out:
                    self.problems.append((kline, f"duplicate key '{key}' (first at line {out.key_lines[key]})"))
                if (node.flow_style and isinstance(vnode, yaml.ScalarNode)
                        and vnode.tag == "tag:yaml.org,2002:null" and vnode.value == ""):
                    self.problems.append((kline, f"flow mapping key '{key}' has no value (unquoted comma?)"))
                out[key] = self._convert(vnode)
                out.key_lines.setdefault(key, kline)
            for vnode, line in merges:
                self._merge(out, vnode, line)
            return out
        if isinstance(node, yaml.SequenceNode):
            out = YList()
            out.line = node.start_mark.line + 1
            out.item_lines = []
            for item in node.value:
                out.append(self._convert(item))
                out.item_lines.append(item.start_mark.line + 1)
            return out
        return self._scalar(node)

    def _merge(self, out, vnode, line):
        sources = vnode.value if isinstance(vnode, yaml.SequenceNode) else [vnode]
        for src in sources:
            merged = self._convert(src)
            if not isinstance(merged, YMap):
                self.problems.append((line, "merge key '<<' needs a mapping"))
                continue
            for k, v in merged.items():
                if k not in out:
                    out[k] = v
                    out.key_lines[k] = merged.key_lines.get(k, line)


def line_of(container, key, default=1):
    if isinstance(container, YMap) and container.key_lines and key in container.key_lines:
        return container.key_lines[key]
    return getattr(container, "line", default)


def walk_strings(value, parent_key=None):
    """Yields (string, line, key) for every string value in a YAML tree."""
    if isinstance(value, YMap):
        for k, v in value.items():
            if isinstance(v, str):
                yield v, line_of(value, k), k
            else:
                yield from walk_strings(v, k)
    elif isinstance(value, YList):
        for i, v in enumerate(value):
            if isinstance(v, str):
                yield v, value.item_lines[i], parent_key
            else:
                yield from walk_strings(v, parent_key)


# ---------------------------------------------------------------- Lua lexing

def lua_lex(text):
    """Returns (strings, code): string literals as (line, content) and the source
    with comments and string literals blanked (newlines preserved)."""
    strings = []
    code = []
    i, n, line = 0, len(text), 1

    def long_bracket(pos):
        m = re.match(r"\[(=*)\[", text[pos:pos + 64])
        return (m.group(1), m.end()) if m else (None, 0)

    while i < n:
        c = text[i]
        if c == "-" and text.startswith("--", i):
            level, size = long_bracket(i + 2)
            if level is not None:
                close = "]" + level + "]"
                end = text.find(close, i + 2 + size)
                end = n if end < 0 else end + len(close)
            else:
                end = text.find("\n", i)
                end = n if end < 0 else end
            chunk = text[i:end]
            line += chunk.count("\n")
            code.append(re.sub(r"[^\n]", " ", chunk))
            i = end
            continue
        if c == "[":
            level, size = long_bracket(i)
            if level is not None:
                close = "]" + level + "]"
                end = text.find(close, i + size)
                end = n if end < 0 else end
                content = text[i + size:end]
                strings.append((line, content))
                chunk = text[i:end + len(close)]
                line += chunk.count("\n")
                code.append(re.sub(r"[^\n]", " ", chunk))
                i = end + len(close)
                continue
        if c in "\"'":
            j = i + 1
            buf = []
            while j < n and text[j] != c and text[j] != "\n":
                if text[j] == "\\" and j + 1 < n:
                    buf.append(text[j:j + 2])
                    j += 2
                    continue
                buf.append(text[j])
                j += 1
            strings.append((line, "".join(buf)))
            code.append(" " * (j + 1 - i))
            i = j + 1
            continue
        if c == "\n":
            line += 1
        code.append(c)
        i += 1
    return strings, "".join(code)


def lineno(text, pos):
    return text.count("\n", 0, pos) + 1


def sql_statements(strings):
    """Yields (line, literal) for string literals that start an SQL statement."""
    for idx, (line, s) in enumerate(strings):
        m = SQL_START_RE.search(s)
        if not m:
            continue
        if m.group(0) == "SELECT":
            window = " ".join(t for ln, t in strings[idx:idx + 6] if ln - line <= 8)
            if not re.search(r"\bFROM\b", window):
                continue
        yield line + s.count("\n", 0, m.start()), s


def cte_names(strings):
    """Common table expression names defined in string literals (SQL is often assembled across files)."""
    return {m.group(1).lower() for _, s in strings for m in CTE_RE.finditer(s)}


def table_refs(sql, ctes):
    """Yields (offset, table) for table identifiers referenced by an SQL text."""
    for m in TABLE_REF_RE.finditer(sql):
        kw, name, call = m.group(1), m.group(2), m.group(3)
        if call or name.upper() in SQL_WORDS:
            continue
        before = sql[max(0, m.start() - 60):m.start()]
        if kw == "FROM":
            if re.search(r"\bDISTINCT\s*$", before):
                continue
            if re.search(r"\b(?:EXTRACT|SUBSTRING|SUBSTR|TRIM|OVERLAY|POSITION)\s*\([^()]*$", before):
                continue
        low = name.lower()
        if low in ctes or low in SYSTEM_TABLES or low.startswith("pg_") or low.startswith("json"):
            continue
        yield m.start(2), name


# ---------------------------------------------------------------- module model

class Entry:
    def __init__(self, ns, name, kind, data, yaml_rel, line):
        self.ns, self.name, self.kind, self.data = ns, name, kind, data
        self.yaml_rel, self.line = yaml_rel, line
        self.source_rel = None  # module-relative path of the resolved source

    @property
    def id(self):
        return f"{self.ns}:{self.name}"

    @property
    def location(self):
        """Folder (relative to src/) the entry lives in: its source file's folder, else its YAML's."""
        rel = self.source_rel or self.yaml_rel
        return src_folder(rel)

    def meta_type(self):
        meta = self.data.get("meta")
        return meta.get("type") if isinstance(meta, dict) else None

    def modules(self):
        mods = self.data.get("modules")
        return [str(m) for m in mods] if isinstance(mods, list) else []

    def imports(self):
        imps = self.data.get("imports")
        if isinstance(imps, YMap):
            for alias, target in imps.items():
                if isinstance(target, str):
                    yield alias, target, line_of(imps, alias)


def table_prefix(tables):
    """Longest common prefix of the module's tables, cut after its last '_'."""
    if not tables:
        return None
    if len(tables) == 1:
        return next(iter(tables)) + "_"
    prefix = os.path.commonprefix(sorted(tables))
    cut = prefix.rfind("_")
    return prefix[:cut + 1] if cut > 0 else None


def src_folder(rel):
    """'src/a/b/x.lua' -> 'a/b'; 'src/x.lua' -> ''."""
    parts = rel.split("/")
    return "/".join(parts[1:-1])


def top_layer(folder):
    return folder.split("/")[0] if folder else ""


class Module:
    def __init__(self, path):
        self.path = os.path.abspath(path)
        self.name = os.path.basename(self.path.rstrip("/"))
        self.src = os.path.join(self.path, "src")
        self.findings = []
        self.yaml_docs = {}  # rel -> parsed doc
        self.entries = []
        self.lua_files = []  # rel paths
        self.lua_cache = {}
        self.root_ns = None
        self.namespaces = set()
        self.tables = set()
        self.table_prefix = None
        self._load()

    def add(self, rule, rel, line, message):
        self.findings.append(Finding(rule, rel, line, message))

    def rel(self, abspath):
        return os.path.relpath(abspath, self.path).replace(os.sep, "/")

    def _walk(self):
        for dirpath, dirnames, filenames in os.walk(self.src):
            dirnames[:] = sorted(d for d in dirnames if d not in ("node_modules", ".wippy"))
            yield dirpath, sorted(filenames)

    def _load(self):
        if not os.path.isdir(self.src):
            raise SystemExit(f"{self.path}: no src/ directory")
        targets = []
        for dirpath, filenames in self._walk():
            for f in filenames:
                full = os.path.join(dirpath, f)
                if f.endswith((".yaml", ".yml")):
                    targets.append(full)
                elif f.endswith(".lua"):
                    self.lua_files.append(self.rel(full))
        manifest = os.path.join(self.path, "wippy.yaml")
        if os.path.isfile(manifest):
            targets.append(manifest)
        for full in targets:
            rel = self.rel(full)
            parser = StrictYaml()
            try:
                with open(full, encoding="utf-8") as fh:
                    doc = parser.load(fh.read())
            except yaml.YAMLError as exc:
                mark = getattr(exc, "problem_mark", None) or getattr(exc, "context_mark", None)
                line = mark.line + 1 if mark else 1
                problem = getattr(exc, "problem", None) or str(exc).splitlines()[0]
                self.add("S5", rel, line, f"YAML does not parse: {problem}")
                continue
            for line, msg in parser.problems:
                self.add("S5", rel, line, msg)
            self.yaml_docs[rel] = doc
        for rel, doc in self.yaml_docs.items():
            if not rel.startswith("src/") or not isinstance(doc, YMap):
                continue
            ns = doc.get("namespace")
            entries = doc.get("entries")
            if isinstance(ns, str):
                self.namespaces.add(str(ns))
            if not isinstance(entries, YList):
                continue
            for idx, e in enumerate(entries):
                if not isinstance(e, YMap):
                    continue
                entry = Entry(str(ns), str(e.get("name")), str(e.get("kind")), e, rel, entries.item_lines[idx])
                src = e.get("source")
                if isinstance(src, str) and src.startswith("file://"):
                    full = os.path.normpath(os.path.join(self.path, os.path.dirname(rel), src[len("file://"):]))
                    entry.source_rel = self.rel(full)
                self.entries.append(entry)
                if entry.kind == "ns.definition" and rel == "src/_index.yaml":
                    self.root_ns = entry.ns
        if self.root_ns is None:
            doc = self.yaml_docs.get("src/_index.yaml")
            if isinstance(doc, YMap) and isinstance(doc.get("namespace"), str):
                self.root_ns = str(doc["namespace"])
        self.by_id = {e.id: e for e in self.entries}
        for rel in self.lua_files:
            if src_folder(rel).split("/")[0] == "migrations":
                strings, _ = self.lua(rel)
                for _, s in strings:
                    for m in CREATE_TABLE_RE.finditer(s):
                        self.tables.add(m.group(1).lower())
        for e in self.entries:
            if e.meta_type() == "migration" and e.source_rel and os.path.isfile(os.path.join(self.path, e.source_rel)):
                strings, _ = self.lua(e.source_rel)
                for _, s in strings:
                    for m in CREATE_TABLE_RE.finditer(s):
                        self.tables.add(m.group(1).lower())
        self.table_prefix = table_prefix(self.tables)
        manifest_doc = self.yaml_docs.get("wippy.yaml")
        self.component = None
        if isinstance(manifest_doc, YMap) and manifest_doc.get("organization") and manifest_doc.get("module"):
            self.component = f"{manifest_doc['organization']}/{manifest_doc['module']}"
        self.dependencies = {str(e.data.get("component")) for e in self.entries
                             if e.kind == "ns.dependency" and isinstance(e.data.get("component"), str)}
        self.public_groups = set()
        for e in self.entries:
            if e.kind == "security.policy":
                for groups, _ in find_groups(e.data):
                    self.public_groups.update(g for g in groups if ":" in g and self.own(g.split(":", 1)[0]))
        self.has_command = (os.path.isdir(os.path.join(self.src, "command"))
                            or any(self.layer_of_ns(ns) == "command" for ns in self.namespaces))
        overrides = LAYER_OVERRIDES.get(self.root_ns, {})
        self.levels = {folder: level for level, folders in LAYER_ORDER for folder in folders}
        self.levels.update(overrides)

    def lua(self, rel):
        if rel not in self.lua_cache:
            with open(os.path.join(self.path, rel), encoding="utf-8", errors="replace") as fh:
                self.lua_cache[rel] = lua_lex(fh.read())
        return self.lua_cache[rel]

    def own(self, ns):
        return ns in self.namespaces

    def layer_of_ns(self, ns):
        if ns == self.root_ns:
            return ""
        if self.root_ns and ns.startswith(self.root_ns + "."):
            return ns[len(self.root_ns) + 1:].split(".")[0]
        return None

    def level(self, layer):
        """Level name of a top folder ('' is the root), None when the folder is not ranked."""
        return self.levels.get(layer)

    def is_test_file(self, rel):
        if os.path.basename(rel).endswith("_test.lua") or {"test", "tests"} & set(src_folder(rel).split("/")):
            return True
        return any(e.source_rel == rel and e.meta_type() in TEST_META_TYPES for e in self.entries)

    def requirement_targets(self):
        out = defaultdict(set)
        for e in self.entries:
            if e.kind != "ns.requirement":
                continue
            for t in e.data.get("targets") or []:
                if isinstance(t, dict) and isinstance(t.get("entry"), str):
                    out[str(t["entry"])].add(str(t.get("path", "")).replace(" +=", "").strip())
        return out


# ---------------------------------------------------------------- rules

def check_s1(m):
    for e in m.entries:
        if "sql" in e.modules() and top_layer(e.location) not in SQL_LAYERS:
            m.add("S1", e.yaml_rel, line_of(e.data, "modules"),
                  f"{e.id} lists the sql module outside persist/migrations")
    for rel in m.lua_files:
        if top_layer(src_folder(rel)) in SQL_LAYERS:
            continue
        strings, code = m.lua(rel)
        for line, s in sql_statements(strings):
            stmt = SQL_START_RE.search(s).group(0).split()[0]
            m.add("S1", rel, line, f"SQL statement ({stmt}) outside persist/migrations")
        for mt in SQL_BUILDER_RE.finditer(code):
            m.add("S1", rel, lineno(code, mt.start()), "sql.builder query outside persist/migrations")


def import_edges(m):
    """Own-module import edges as (src_ns, dst_ns, dst_name, entry, line)."""
    for e in m.entries:
        for _, target, line in e.imports():
            if ":" not in target:
                continue
            ns, name = target.split(":", 1)
            if m.own(ns):
                yield e.ns, ns, name, e, line


def check_s2(m):
    def node(ns, name):
        return f"{ns}:{name}" if ns == m.root_ns else ns

    graph = defaultdict(set)
    edge_line = {}
    for src_ns, dst_ns, dst_name, e, line in import_edges(m):
        a, b = node(src_ns, e.name), node(dst_ns, dst_name)
        if a != b:
            graph[a].add(b)
            edge_line.setdefault((a, b), (e.yaml_rel, line))
        sl, dl = m.layer_of_ns(src_ns), m.layer_of_ns(dst_ns)
        if src_ns == dst_ns or sl is None or dl is None or sl == dl:
            continue
        ls, ld = m.level(sl), m.level(dl)
        if ld == TRANSPORT_LEVEL:
            m.add("S2", e.yaml_rel, line, f"{e.id} imports transport namespace {dst_ns}:{dst_name}")
        elif sl == "domain" and dl == "" and dst_name != "types":
            m.add("S2", e.yaml_rel, line, f"domain entry {e.id} imports root {dst_ns}:{dst_name} (domain imports only root types)")
        elif ls and ld and LEVEL_RANK[ls] < LEVEL_RANK[ld]:
            m.add("S2", e.yaml_rel, line,
                  f"upward import: {sl or 'root'} entry {e.id} imports {dl or 'root'} {dst_ns}:{dst_name}")
    for scc in tarjan(graph):
        if len(scc) < 2:
            continue
        members = sorted(scc)
        rel, line = min(edge_line[(a, b)] for a in scc for b in graph[a] if b in scc)
        m.add("S2", rel, line, f"import cycle among {len(members)} nodes: {', '.join(members)}")


def tarjan(graph):
    index, low, stack, on_stack, out = {}, {}, [], set(), []
    counter = [0]
    nodes = set(graph) | {b for bs in graph.values() for b in bs}

    def strong(v):
        work = [(v, iter(sorted(graph.get(v, ()))))]
        index[v] = low[v] = counter[0]
        counter[0] += 1
        stack.append(v)
        on_stack.add(v)
        while work:
            node, it = work[-1]
            advanced = False
            for w in it:
                if w not in index:
                    index[w] = low[w] = counter[0]
                    counter[0] += 1
                    stack.append(w)
                    on_stack.add(w)
                    work.append((w, iter(sorted(graph.get(w, ())))))
                    advanced = True
                    break
                if w in on_stack:
                    low[node] = min(low[node], index[w])
            if advanced:
                continue
            work.pop()
            if work:
                low[work[-1][0]] = min(low[work[-1][0]], low[node])
            if low[node] == index[node]:
                comp = set()
                while True:
                    w = stack.pop()
                    on_stack.discard(w)
                    comp.add(w)
                    if w == node:
                        break
                out.append(comp)

    for v in sorted(nodes):
        if v not in index:
            strong(v)
    return out


def check_s3(m):
    for rel in m.lua_files:
        if src_folder(rel) == "" and os.path.basename(rel) not in ROOT_LUA_ALLOWED:
            m.add("S3", rel, 1, "Lua file directly in src/ (only client.lua and types.lua belong there)")


def check_s4(m):
    for dirpath, filenames in m._walk():
        rel_dir = m.rel(dirpath)
        has_lua = any(f.endswith(".lua") for f in filenames)
        has_entries = any(
            isinstance(m.yaml_docs.get(f"{rel_dir}/{f}"), YMap) and "entries" in m.yaml_docs[f"{rel_dir}/{f}"]
            for f in filenames if f.endswith((".yaml", ".yml"))
        )
        if (has_lua or has_entries) and "_index.yaml" not in filenames:
            first = next(f for f in filenames if f.endswith((".lua", ".yaml", ".yml")))
            m.add("S4", f"{rel_dir}/{first}", 1, f"folder {rel_dir}/ holds Lua or entries but has no _index.yaml")
    for rel, doc in m.yaml_docs.items():
        if not rel.startswith("src/") or not isinstance(doc, YMap):
            continue
        if "entries" in doc and os.path.basename(rel) != "_index.yaml":
            m.add("S4", rel, line_of(doc, "entries"), "entry file other than _index.yaml")
        ns = doc.get("namespace")
        if "entries" in doc and m.root_ns:
            folder = src_folder(rel)
            expected = m.root_ns + ("." + folder.replace("/", ".") if folder else "")
            if ns != expected:
                m.add("S4", rel, line_of(doc, "namespace"), f"namespace '{ns}' should be '{expected}'")


def check_s5(m):
    registered = defaultdict(list)
    for e in m.entries:
        src = e.data.get("source")
        if not (isinstance(src, str) and src.startswith("file://")):
            continue
        line = line_of(e.data, "source")
        path = src[len("file://"):]
        full = os.path.join(m.path, e.source_rel)
        if not os.path.isfile(full):
            m.add("S5", e.yaml_rel, line, f"{e.id} source {src} does not exist")
        if ".." in path.split("/"):
            m.add("S5", e.yaml_rel, line, f"{e.id} source {src} leaves its folder")
        elif "/" in path.lstrip("./"):
            m.add("S5", e.yaml_rel, line, f"{e.id} source {src} reaches into a subfolder")
        registered[e.source_rel].append(e)
    for rel in m.lua_files:
        entries = registered.get(rel)
        if not entries:
            m.add("S5", rel, 1, "Lua file is not registered by any entry")
            continue
        nss = sorted({e.ns for e in entries})
        if len(nss) > 1:
            first = entries[0]
            m.add("S5", first.yaml_rel, line_of(first.data, "source"),
                  f"{rel} registered under {len(nss)} namespaces: {', '.join(nss)}")


def owning_peer(ns, peers):
    """The peer declaring ns, else the peer with the longest root that prefixes ns."""
    for peer in peers:
        if peer.own(ns):
            return peer
    prefixed = [p for p in peers if p.root_ns and (ns == p.root_ns or ns.startswith(p.root_ns + "."))]
    return max(prefixed, key=lambda p: len(p.root_ns)) if prefixed else None


def foreign_private(m, ref, peers, key=None):
    """Returns a reason when ref ns:name is private to another module, else None.

    key is the YAML key the reference sits under; a peer's public policy group is
    allowed only in a `groups` list."""
    ns, name = ref.split(":", 1)
    if m.own(ns) or ns in OVERLAY_NAMESPACES.get(m.root_ns, ()):
        return None
    owner = owning_peer(ns, peers)
    if owner is not None:
        if ns == owner.root_ns:
            entry = owner.by_id.get(ref)
            if name in PUBLIC_NAMES or (entry and entry.kind == "contract.definition"):
                return None
            return f"{owner.name} root entry {ref} is not its contract, client or types"
        if ref in owner.public_groups:
            if key == "groups":
                return None
            return f"public policy group of {owner.name} referenced outside a groups list"
        return f"private namespace {ns} of {owner.name}"
    if m.root_ns and ns.startswith(m.root_ns + "."):
        return f"namespace {ns} is under this module's root but not declared by it"
    segs = ns.split(".")
    hit = [s for s in segs[2:] if s in PRIVATE_SEGMENTS]
    if hit:
        return f"private namespace {ns} of another module (segment '{hit[0]}')"
    return None


def dependents(m, peers):
    """Peers that declare an ns.dependency on this module."""
    return [p for p in peers if m.component and m.component in p.dependencies]


def check_s6(m, peers):
    seen = set()
    named = dependents(m, peers)

    def report(rel, line, ref, reason, where):
        key = (rel, line, ref)
        if key not in seen:
            seen.add(key)
            m.add("S6", rel, line, f"{where} {ref}: {reason}")

    def check_ref(rel, line, ref, key, where):
        owner = owning_peer(ref.split(":", 1)[0], peers)
        if owner is not None and owner in named:
            return  # S13 reports names of dependent modules
        reason = foreign_private(m, ref, peers, key)
        if reason:
            report(rel, line, ref, reason, where)

    for e in m.entries:
        if e.kind == "ns.requirement":
            targets = e.data.get("targets")
            for idx, t in enumerate(targets if isinstance(targets, YList) else []):
                if isinstance(t, YMap) and isinstance(t.get("entry"), str) and ":" in t["entry"]:
                    ns = t["entry"].split(":", 1)[0]
                    if not m.own(ns):
                        owner = owning_peer(ns, peers)
                        whose = owner.name if owner else "another module"
                        report(e.yaml_rel, line_of(t, "entry"), str(t["entry"]),
                               f"requirement {e.id} targets an entry of {whose}", "requirement target")
        for s, line, key in walk_strings(e.data):
            if key in PROSE_KEYS:
                continue
            if REF_RE.fullmatch(s):
                check_ref(e.yaml_rel, line, s, key, "reference")
    peer_tables = {}
    for peer in peers:
        for t in peer.tables:
            peer_tables.setdefault(t, peer.name)
    ctes = set()
    for rel in m.lua_files:
        ctes |= cte_names(m.lua(rel)[0])
    for rel in m.lua_files:
        strings, _ = m.lua(rel)
        for line, s in strings:
            if REF_RE.fullmatch(s):
                check_ref(rel, line, s, None, "string reference")
        for line, s in strings:
            if not SQL_START_RE.search(s) and not re.search(r"\b(FROM|JOIN)\b", s):
                continue
            for off, table in table_refs(s, ctes):
                low = table.lower()
                tline = line + s.count("\n", 0, off)
                if low in m.tables:
                    continue
                if low in peer_tables:
                    report(rel, tline, table, f"table owned by {peer_tables[low]}", "SQL table")
                elif m.table_prefix and not low.startswith(m.table_prefix):
                    report(rel, tline, table, "table not created by this module's migrations", "SQL table")
                elif not m.tables:
                    report(rel, tline, table, "module has no migrations that create it", "SQL table")


def check_s7(m, peers):
    targets = m.requirement_targets()
    for e in m.entries:
        paths = targets.get(e.id, set())
        if e.kind in HOST_KINDS:
            m.add("S7", e.yaml_rel, e.line, f"{e.id} declares a host resource ({e.kind}) in module source")
        if e.kind == "http.endpoint" and ".meta.router" not in paths:
            m.add("S7", e.yaml_rel, e.line, f"endpoint {e.id} router is not supplied by an ns.requirement")
        if e.kind == "http.static" and ".meta.server" not in paths:
            m.add("S7", e.yaml_rel, e.line, f"static {e.id} server is not supplied by an ns.requirement")
        if e.meta_type() == "migration" and ".meta.target_db" not in paths:
            m.add("S7", e.yaml_rel, e.line, f"migration {e.id} target_db is not supplied by an ns.requirement")
        if e.kind == "process.service" and ".host" not in paths:
            m.add("S7", e.yaml_rel, line_of(e.data, "host"), f"process service {e.id} host is not supplied by an ns.requirement")
        for groups, line in find_groups(e.data):
            for g in groups:
                ns = g.split(":", 1)[0]
                if ":" not in g or m.own(ns) or ns.startswith("wippy.") or ns == "app" or ns.startswith("app."):
                    continue
                if owning_peer(ns, peers) is not None:
                    continue  # S6 judges groups of known modules
                m.add("S7", e.yaml_rel, line, f"{e.id} names host security group {g} in source")


def find_groups(value):
    if isinstance(value, YMap):
        for k, v in value.items():
            if k == "groups" and isinstance(v, YList):
                yield [str(g) for g in v if isinstance(g, str)], line_of(value, k)
            elif k == "groups" and isinstance(v, str):
                yield [str(v)], line_of(value, k)
            else:
                yield from find_groups(v)
    elif isinstance(value, YList):
        for v in value:
            yield from find_groups(v)


def check_s8(m):
    for e in m.entries:
        if top_layer(e.location) != "domain":
            continue
        bad = sorted(set(e.modules()) & DOMAIN_FORBIDDEN_MODULES)
        if bad:
            m.add("S8", e.yaml_rel, line_of(e.data, "modules"), f"domain entry {e.id} lists modules {', '.join(bad)}")
        for _, target, line in e.imports():
            if ":" in target and not m.own(target.split(":", 1)[0]) and target.split(":", 1)[1] == "client":
                m.add("S8", e.yaml_rel, line, f"domain entry {e.id} imports contract client {target}")


def check_s9(m):
    if not m.has_command:
        return
    for src_ns, dst_ns, dst_name, e, line in import_edges(m):
        if m.layer_of_ns(src_ns) in S9_TRANSPORT and m.layer_of_ns(dst_ns) == "persist":
            m.add("S9", e.yaml_rel, line, f"{e.id} imports persist {dst_ns}:{dst_name}")


def check_s10(m, greenfield):
    if m.name not in greenfield and m.root_ns not in greenfield:
        return
    migs = [e for e in m.entries if e.meta_type() == "migration"]
    registered = {e.source_rel for e in migs}
    files = [r for r in m.lua_files if top_layer(src_folder(r)) == "migrations" and r not in registered]
    total = len(migs) + len(files)
    if total > 1:
        names = [e.id for e in migs] + files
        anchor = migs[1] if len(migs) > 1 else None
        rel, line = (anchor.yaml_rel, anchor.line) if anchor else (files[0], 1)
        m.add("S10", rel, line, f"greenfield module has {total} migrations: {', '.join(names)}")


def check_s11(m):
    """Decision 12: api, sink, traits and blocks reach logic through the module's own contract."""
    if not m.has_command:
        return
    for src_ns, dst_ns, dst_name, e, line in import_edges(m):
        sl, dl = m.layer_of_ns(src_ns), m.layer_of_ns(dst_ns)
        if sl not in S9_TRANSPORT or dl is None or dl == sl:
            continue
        if dl == "" and dst_name in PUBLIC_NAMES:
            continue
        if dl == "persist" or m.level(dl) == TRANSPORT_LEVEL:
            continue  # S9 and S2 report these
        m.add("S11", e.yaml_rel, line,
              f"{e.id} imports {dl or 'root'} {dst_ns}:{dst_name}; transport reaches logic through {m.root_ns}:client")


def check_s12(m):
    """Decision 7: persist holds SQL only; contract, HTTP and function-call adapters live in the layer that uses them.

    A projection worker may list funcs to call its own module's post-commit public-meta
    function (PATTERNS rule 15, rulebook F13)."""
    for e in m.entries:
        if top_layer(e.location) != "persist":
            continue
        bad = set(e.modules()) & PERSIST_FORBIDDEN_MODULES
        if bad == {"funcs"} and e.meta_type() == "projection.worker" and own_calls_only(m, e):
            bad = set()
        if bad:
            m.add("S12", e.yaml_rel, line_of(e.data, "modules"),
                  f"persist entry {e.id} lists modules {', '.join(sorted(bad))}")
        for _, target, line in e.imports():
            if ":" in target and not m.own(target.split(":", 1)[0]) and target.split(":", 1)[1] == "client":
                m.add("S12", e.yaml_rel, line, f"persist entry {e.id} imports contract client {target}")


def own_calls_only(m, e):
    """True when the entry's source names at least one own entry id and no foreign one."""
    if not e.source_rel or not os.path.isfile(os.path.join(m.path, e.source_rel)):
        return False
    refs = [s for _, s in m.lua(e.source_rel)[0] if REF_RE.fullmatch(s)]
    return bool(refs) and all(m.own(r.split(":", 1)[0]) for r in refs)


def check_s13(m, peers):
    """The host names no plugin, driver or consumer: no id or namespace of a peer that depends on it."""
    named = dependents(m, peers)
    if not named:
        return
    pattern = re.compile(r"(?<![\w.])(" + "|".join(re.escape(p.root_ns) for p in named if p.root_ns)
                         + r")(?:[.:][\w.\-]+)?(?![\w])")
    owner = {p.root_ns: p.name for p in named}
    seen = set()

    def scan(rel, line, s):
        for mt in pattern.finditer(s):
            key = (rel, line, mt.group(0))
            if key not in seen:
                seen.add(key)
                m.add("S13", rel, line, f"names {mt.group(0)} of dependent module {owner[mt.group(1)]}")

    for rel, doc in m.yaml_docs.items():
        if rel.startswith("src/"):
            for s, line, key in walk_strings(doc):
                if key not in PROSE_KEYS:
                    scan(rel, line, s)
    for rel in m.lua_files:
        for line, s in m.lua(rel)[0]:
            scan(rel, line, s)


def check_s14(m):
    """Every policy lists exact resource ids (rulebook I3, I4; PATTERNS rule 24).

    Own-namespace wildcards are allowed where rulebook I1/I2 show them: module_access with
    registry.get/registry.find, and the private runtime policy it includes with the I2 actions.
    Mail overlay wildcards grant only typed overlay entry operations.
    A '*' resource is exact only when every condition is an eq match on an own entry id."""
    overlay_namespaces = OVERLAY_NAMESPACES.get(m.root_ns, ())
    access = [e for e in m.entries if e.kind == "security.policy"
              and isinstance(e.data.get("meta"), dict) and e.data["meta"].get("intent") == "module_access"]
    includes = set()
    for e in access:
        includes.update(as_list(e.data["meta"].get("includes")))
    for e in m.entries:
        if e.kind != "security.policy":
            continue
        meta = e.data.get("meta") if isinstance(e.data.get("meta"), dict) else {}
        rules = e.data.get("policy")
        rules = rules if isinstance(rules, YList) else [rules]
        for rule in rules:
            if not isinstance(rule, YMap):
                continue
            actions = as_list(rule.get("actions"))
            conditions = rule.get("conditions") if isinstance(rule.get("conditions"), YList) else []
            if e in access:
                allowed_actions = MODULE_ACCESS_ACTIONS
            elif e.id in includes and meta.get("private") is True:
                allowed_actions = RUNTIME_ACTIONS
            else:
                allowed_actions = None
            exact_conditions = bool(conditions)
            for c in conditions:
                op = c.get("operator") if isinstance(c, YMap) else None
                value = c.get("value") if isinstance(c, YMap) else None
                if op not in EXACT_OPERATORS:
                    m.add("S14", e.yaml_rel, line_of(c, "operator"), f"policy {e.id} condition operator {op} is not an exact match")
                    exact_conditions = False
                elif not (isinstance(value, str) and REF_RE.fullmatch(value) and m.own(value.split(":", 1)[0])):
                    exact_conditions = False
            own_wildcards = False
            for res, line in resource_items(rule):
                if "*" not in res:
                    continue
                if res == "*" and exact_conditions:
                    continue
                ns = res[:-2] if res.endswith(":*") else None
                if ns in overlay_namespaces:
                    if actions and all(OVERLAY_ENTRY_ACTION.fullmatch(action) for action in actions):
                        continue
                elif ns and m.own(ns) and allowed_actions is not None:
                    own_wildcards = True
                    continue
                m.add("S14", e.yaml_rel, line, f"policy {e.id} resource {res} is not an exact id")
            extra = sorted(set(actions) - allowed_actions) if own_wildcards else []
            if extra:
                rule_id = "I1" if allowed_actions is MODULE_ACCESS_ACTIONS else "I2"
                m.add("S14", e.yaml_rel, line_of(rule, "actions"),
                      f"policy {e.id} grants {', '.join(extra)} on own-namespace wildcards (rulebook {rule_id} allows only "
                      f"{', '.join(sorted(allowed_actions))})")


def as_list(value):
    if isinstance(value, str):
        return [str(value)]
    return [str(v) for v in value if isinstance(v, str)] if isinstance(value, list) else []


def resource_items(rule):
    res = rule.get("resources")
    if isinstance(res, str):
        yield str(res), line_of(rule, "resources")
    elif isinstance(res, YList):
        for i, r in enumerate(res):
            if isinstance(r, str):
                yield str(r), res.item_lines[i]


def check_s15(m):
    for rel, doc in m.yaml_docs.items():
        if not rel.startswith("src/"):
            continue
        for s, line, key in walk_strings(doc):
            if key in PROSE_KEYS:
                continue
            for mt in APP_ID_RE.finditer(s):
                where = "requirement default" if key == "default" else "host id"
                m.add("S15", rel, line, f"{where} {mt.group(0)} in source")
    for rel in m.lua_files:
        strings, _ = m.lua(rel)
        for line, s in strings:
            for mt in APP_ID_RE.finditer(s):
                m.add("S15", rel, line, f"host id {mt.group(0)} in source")


def check_s16(m):
    for rel in m.lua_files:
        if m.is_test_file(rel):
            continue
        _, code = m.lua(rel)
        for mt in PCALL_RE.finditer(code):
            m.add("S16", rel, lineno(code, mt.start()), f"{mt.group(0)} in source")


def run(module_dir, greenfield=(), peer_dirs=()):
    m = Module(module_dir)
    peers = [Module(p) for p in peer_dirs if os.path.abspath(p) != m.path]
    check_s1(m)
    check_s2(m)
    check_s3(m)
    check_s4(m)
    check_s5(m)
    check_s6(m, peers)
    check_s7(m, peers)
    check_s8(m)
    check_s9(m)
    check_s10(m, set(greenfield))
    check_s11(m)
    check_s12(m)
    check_s13(m, peers)
    check_s14(m)
    check_s15(m)
    check_s16(m)
    order = {r: i for i, r in enumerate(RULES)}
    m.findings.sort(key=lambda f: (order[f.rule], f.file, f.line, f.message))
    return m


def main(argv=None):
    ap = argparse.ArgumentParser(description="KickSide module structure checker")
    ap.add_argument("module_dir")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--greenfield", action="append", default=[],
                    help="greenfield module name or root namespace (repeatable, comma separated)")
    ap.add_argument("--peer", action="append", default=[],
                    help="sibling module dir: exact S6 checks, and S13 when it depends on this module")
    args = ap.parse_args(argv)
    greenfield = [g.strip() for item in args.greenfield for g in item.split(",") if g.strip()]
    m = run(args.module_dir, greenfield, args.peer)
    if args.json:
        json.dump({"module": m.name, "root_namespace": m.root_ns,
                   "findings": [f.as_dict() for f in m.findings]}, sys.stdout, indent=2)
        sys.stdout.write("\n")
    else:
        for f in m.findings:
            print(f)
        counts = defaultdict(int)
        for f in m.findings:
            counts[f.rule] += 1
        summary = ", ".join(f"{r}={counts[r]}" for r in RULES if counts[r]) or "clean"
        print(f"{m.name} ({m.root_ns}): {len(m.findings)} findings: {summary}")
    return 1 if m.findings else 0


if __name__ == "__main__":
    sys.exit(main())
