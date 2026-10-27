#!/usr/bin/env bash
# Disposable native-S3 integration test. Application code uses only runtime APIs.
set -euo pipefail
source_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
kickside_source_root=${KICKSIDE_SOURCE_ROOT:-"$source_root/../../kickside"}
storage_test_bin=${WIPPY_BIN:-wippy}
storage_test_dir=$(mktemp -d "$source_root/.s3-test.XXXXXXXX")
storage_test_container="kickside-storage-test-$(basename "$storage_test_dir")"
cleanup() {
  docker stop "$storage_test_container" >/dev/null 2>&1 || true
  docker rm "$storage_test_container" >/dev/null 2>&1 || true
  rm -rf "$storage_test_dir"
}
trap cleanup EXIT
docker run -d --name "$storage_test_container" -p 127.0.0.1::8333 \
  chrislusf/seaweedfs@sha256:4e61d15fd35994cb1e43e1e553dff106794841fd9a99ade2fc8c8bfce4d7872d \
  server -s3 -dir=/data -volume.max=10 -master.volumeSizeLimitMB=32 \
  -ip=127.0.0.1 -ip.bind=0.0.0.0 >/dev/null
storage_test_port=$(docker port "$storage_test_container" 8333/tcp | awk -F: '{print $NF}')
storage_test_endpoint="http://127.0.0.1:$storage_test_port"
curl --fail --silent --show-error --retry 20 --retry-all-errors --retry-delay 1 \
  --max-time 5 -X PUT "$storage_test_endpoint/ks-upload-storage" >/dev/null

run_cases() {
  local name=$1
  shift
  "$storage_test_bin" test "$@" --set "vars.kickside_root=$kickside_source_root" 2>&1 | tee "$storage_test_dir/$name.log"
  sed -E 's/\x1B\[[0-?]*[ -/]*[@-~]//g' "$storage_test_dir/$name.log" > "$storage_test_dir/$name.clean.log"
  awk '/No tests found|No tests match filter/ { empty=1 } /^[[:space:]]*FAILED([[:space:]]|$)/ { failed=1 }
    /^[[:space:]]*PASSED([[:space:]]|$)/ { passed=1 }
    END { exit(empty || failed || !passed) }' "$storage_test_dir/$name.clean.log"
}

cd "$source_root/test"
KICKSIDE_SOURCE_ROOT="$kickside_source_root" bash prepare.sh
run_cases restart-first --profile s3 --set "vars.s3_endpoint=$storage_test_endpoint" \
  --set "vars.sqlite_path=$storage_test_dir/restart.sqlite"
run_cases restart-second --profile s3 --set "vars.s3_endpoint=$storage_test_endpoint" \
  --set "vars.sqlite_path=$storage_test_dir/restart.sqlite"
printf 'Native S3 integration passed.\n'
