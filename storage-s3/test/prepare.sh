#!/usr/bin/env bash
set -eu
extension_test_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
kickside_source_root=${KICKSIDE_SOURCE_ROOT:-"$extension_test_dir/../../../kickside"}
mkdir -p "$extension_test_dir/src/fixtures"
cp "$extension_test_dir/../src/storage/offload.lua" "$extension_test_dir/src/fixtures/storage_offload.lua"
cp "$extension_test_dir/../src/storage/backend.lua" "$extension_test_dir/src/fixtures/storage_backend.lua"
cp "$extension_test_dir/../src/api/inspect.lua" "$extension_test_dir/src/fixtures/storage_inspect.lua"
for source in list_uploads get_upload artifacts delete_upload get_raw; do
  cp "$kickside_source_root/platform/uploads/src/api/$source.lua" "$extension_test_dir/src/fixtures/$source.lua"
done
