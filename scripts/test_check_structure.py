#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
"""Self-test for check_structure.py: run `python3 -B test_check_structure.py`."""

import os
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import check_structure  # noqa: E402

FIXTURES = os.path.join(HERE, "fixtures")

EXPECTED_BAD = {
    ("S1", "src/api/_index.yaml", 10),
    ("S1", "src/api/list.lua", 3),
    ("S1", "src/api/list.lua", 4),
    ("S1", "src/domain/_index.yaml", 9),
    ("S2", "src/command/_index.yaml", 10),
    ("S2", "src/command/_index.yaml", 11),
    ("S2", "src/domain/_index.yaml", 12),
    ("S2", "src/read/_index.yaml", 10),
    ("S3", "src/helpers.lua", 1),
    ("S4", "src/command/_index.yaml", 3),
    ("S4", "src/command/extra.yaml", 5),
    ("S4", "src/orphan/lost.lua", 1),
    ("S5", "src/_index.yaml", 19),
    ("S5", "src/_index.yaml", 23),
    ("S5", "src/_index.yaml", 27),
    ("S5", "src/domain/_index.yaml", 13),
    ("S5", "src/domain/_index.yaml", 14),
    ("S5", "src/domain/_index.yaml", 18),
    ("S5", "src/orphan/lost.lua", 1),
    ("S5", "src/persist/broken.yaml", 5),
    ("S6", "src/api/_index.yaml", 12),
    ("S6", "src/api/list.lua", 4),
    ("S7", "src/api/_index.yaml", 15),
    ("S7", "src/migrations/_index.yaml", 12),
    ("S8", "src/domain/_index.yaml", 9),
    ("S9", "src/sink/_index.yaml", 11),
    ("S10", "src/migrations/_index.yaml", 12),
    ("S11", "src/api/_index.yaml", 13),
    ("S12", "src/persist/_index.yaml", 9),
    ("S12", "src/persist/_index.yaml", 12),
    ("S12", "src/persist/_index.yaml", 19),
    ("S13", "src/api/list.lua", 5),
    ("S14", "src/security/_index.yaml", 14),
    ("S14", "src/security/_index.yaml", 21),
    ("S14", "src/security/_index.yaml", 29),
    ("S14", "src/security/_index.yaml", 34),
    ("S15", "src/_index.yaml", 12),
    ("S16", "src/persist/repo.lua", 3),
}

EXPECTED_BAD_PLUGIN = {
    ("S6", "src/_index.yaml", 18),
    ("S6", "src/_index.yaml", 24),
}


def fixture(name):
    return os.path.join(FIXTURES, name)


class StructureCheckTest(unittest.TestCase):
    def test_conforming_module_is_clean(self):
        m = check_structure.run(fixture("good"), greenfield=["good"], peer_dirs=[fixture("good-plugin")])
        self.assertEqual([str(f) for f in m.findings], [])

    def test_violating_module_hits_every_rule_at_exact_locations(self):
        m = check_structure.run(fixture("bad"), greenfield=["bad"], peer_dirs=[fixture("bad-plugin")])
        got = {(f.rule, f.file, f.line) for f in m.findings}
        self.assertEqual(got, EXPECTED_BAD)
        self.assertEqual({f.rule for f in m.findings}, set(check_structure.RULES))

    def test_s10_applies_only_to_greenfield_modules(self):
        m = check_structure.run(fixture("bad"))
        self.assertNotIn("S10", {f.rule for f in m.findings})

    def test_s13_needs_the_dependent_as_peer(self):
        m = check_structure.run(fixture("bad"))
        self.assertNotIn("S13", {f.rule for f in m.findings})

    def test_plugin_reaches_host_through_contracts_client_types_and_public_groups(self):
        m = check_structure.run(fixture("good-plugin"), peer_dirs=[fixture("good")])
        self.assertEqual([str(f) for f in m.findings], [])

    def test_plugin_private_group_and_requirement_target_on_host_are_refused(self):
        m = check_structure.run(fixture("bad-plugin"), peer_dirs=[fixture("bad")])
        self.assertEqual({(f.rule, f.file, f.line) for f in m.findings}, EXPECTED_BAD_PLUGIN)

    def test_module_without_command_layer_keeps_writer_in_persist(self):
        m = check_structure.run(fixture("small"))
        self.assertEqual([str(f) for f in m.findings], [])

    def test_layer_overrides_place_module_specific_folders(self):
        m = check_structure.run(fixture("mail"))
        self.assertEqual(m.level("persist"), "persist")
        self.assertEqual(m.level("delivery"), "jobs")
        self.assertEqual(m.level("render"), "persist")
        self.assertEqual(m.level("settings"), "jobs")
        self.assertEqual([str(f) for f in m.findings if f.rule == "S2"], [])
        self.assertEqual(check_structure.Module(fixture("good")).level("settings"), "persist")

    def test_mail_overlay_wildcards_allow_template_get_only_on_draft_sets(self):
        m = check_structure.run(fixture("mail"))
        got = [(f.file, f.line) for f in m.findings if f.rule == "S14"]
        self.assertEqual(got, [("src/security/_index.yaml", line) for line in (26, 26, 32, 39, 51)])

    def test_mail_owns_its_overlay_namespaces_without_index_files(self):
        m = check_structure.run(fixture("mail"), peer_dirs=[fixture("good")])
        got = [f.message.split()[1].removesuffix(":") for f in m.findings if f.rule == "S6"]
        self.assertCountEqual(got, ["kickside.mail.other:*", "kickside.mail.mailgun.draft:*"])
        peer = check_structure.Module(fixture("good"))
        reason = check_structure.foreign_private(peer, "kickside.mail.projection:marker", [m])
        self.assertEqual(reason, "private namespace kickside.mail.projection of mail")

    def test_mail_overlay_wildcards_do_not_apply_to_other_modules(self):
        m = check_structure.Module(fixture("mail"))
        m.root_ns = "kickside.mail.admin"
        check_structure.check_s14(m)
        got = [f.line for f in m.findings if f.rule == "S14"]
        self.assertIn(8, got)
        self.assertIn(14, got)
        self.assertIn(20, got)

    def test_peer_module_allows_root_client_and_contracts_only(self):
        peer = check_structure.Module(fixture("good"))
        fake = check_structure.Module(fixture("bad"))
        self.assertIsNone(check_structure.foreign_private(fake, "acme.good:client", [peer]))
        self.assertIsNotNone(check_structure.foreign_private(fake, "acme.good:db_config", [peer]))
        self.assertIsNotNone(check_structure.foreign_private(fake, "acme.good.read:reader", [peer]))
        self.assertIsNone(check_structure.foreign_private(fake, "acme.good.security:plugins", [peer], "groups"))
        self.assertIsNotNone(check_structure.foreign_private(fake, "acme.good.security:plugins", [peer]))

    def test_lua_lexer_ignores_comments_and_keeps_string_lines(self):
        strings, code = check_structure.lua_lex('-- SELECT x FROM t\nlocal a = [[\nSELECT 1 FROM t]]\nlocal b = "x"\n')
        self.assertEqual(strings, [(2, "\nSELECT 1 FROM t"), (4, "x")])
        self.assertNotIn("SELECT", code)
        self.assertEqual(code.count("\n"), 4)

    def test_yaml_merge_keys_are_not_duplicates(self):
        parser = check_structure.StrictYaml()
        doc = parser.load("base: &b { a: 1, c: 3 }\nm:\n  <<: *b\n  a: 2\n")
        self.assertEqual(parser.problems, [])
        self.assertEqual(dict(doc["m"]), {"a": 2, "c": 3})


if __name__ == "__main__":
    unittest.main()
