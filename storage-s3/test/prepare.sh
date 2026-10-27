#!/usr/bin/env bash
set -eu
extension_test_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
test -d "$extension_test_dir/src"
mkdir -p "$extension_test_dir/src/fixtures"
cp "$extension_test_dir/../src/api/inspect.lua" "$extension_test_dir/src/fixtures/storage_settings.lua"
