#!/usr/bin/env bash
# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
# Run a command with a fresh, disk-backed PostgreSQL test server.
set -euo pipefail

if (( $# < 2 )); then
  echo "Usage: $0 <database> <command> [args...]" >&2
  exit 2
fi
export PGDATABASE=$1 PGHOST=127.0.0.1 PGUSER=kickside PGPASSWORD=kickside
shift
name=${TEST_POSTGRES_CONTAINER:-components-test-pg-$$-$RANDOM}
image=pgvector/pgvector:pg17@sha256:b513c48566e4777cd3370451400000c78eda6a08131d68f4c31d4a76f27bd8fd

# Size WAL for a full suite so write volume does not force repeated checkpoints.
id=$(docker create --name "$name" --publish "$PGHOST:${PGPORT:-}:5432" \
  --env POSTGRES_USER="$PGUSER" --env POSTGRES_PASSWORD="$PGPASSWORD" --env POSTGRES_DB="$PGDATABASE" \
  "$image" \
  -c max_wal_size=6GB -c checkpoint_timeout=5min -c checkpoint_completion_target=0.9 \
  -c fsync=on -c synchronous_commit=on -c full_page_writes=on -c wal_sync_method=fdatasync \
  -c log_checkpoints=on -c track_wal_io_timing=on -c log_min_duration_statement=150)
ready=false

cleanup() {
  local status=$? databases sessions
  trap - EXIT
  if [[ $(docker container inspect --format '{{.Id}}' "$name") != "$id" ]]; then
    exit 1
  fi
  if [[ -n ${TEST_POSTGRES_LOG:-} ]]; then
    docker logs "$name" > "$TEST_POSTGRES_LOG" 2>&1 || status=1
  fi
  if $ready; then
    databases=$(docker exec "$name" psql -XAt -U "$PGUSER" -d postgres -c \
      "SELECT datname FROM pg_database WHERE NOT datistemplate AND datname <> 'postgres' ORDER BY datname") || exit 1
    sessions=$(docker exec "$name" psql -XAt -U "$PGUSER" -d postgres -c \
      "SELECT count(*) FROM pg_stat_activity WHERE backend_type = 'client backend' AND pid <> pg_backend_pid()") || exit 1
    printf 'PostgreSQL %s cleanup: databases [postgres%s], client sessions %s\n' "$name" "${databases:+, $databases}" "$sessions"
    if [[ "$sessions" != 0 || (-n "$databases" && "$databases" != "$PGDATABASE") ]]; then
      echo "PostgreSQL $name has unexpected databases or clients" >&2
      exit 1
    fi
  fi
  docker rm -f -v "$name" || exit 1
  exit "$status"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

docker start "$name" >/dev/null
for ((attempt=0; attempt<60; attempt++)); do
  # TCP reaches the final server, after the image's socket-only setup finishes.
  if docker exec "$name" pg_isready -q -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE"; then
    ready=true
    break
  fi
  sleep 1
done
if ! $ready; then
  docker logs "$name" >&2
  exit 1
fi

PGPORT=$(docker port "$name" 5432/tcp)
export PGPORT=${PGPORT##*:}
printf 'PostgreSQL %s listening on %s:%s\n' "$name" "$PGHOST" "$PGPORT"
"$@"
