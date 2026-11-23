# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
# kickside/work: lint, typecheck and test the module through its harness on SQLite and PostgreSQL.
WIPPY ?= wippy
SHELL := bash
.SHELLFLAGS := -o pipefail -ec

.PHONY: setup lockrefresh lint typecheck check-module test test-pg verify
setup:
	cd test && $(WIPPY) install
lockrefresh:
	cd test && $(WIPPY) update
lint:
	cd test && $(WIPPY) lint
typecheck:
	cd test && $(WIPPY) lint --strict-any --level warning --ns 'kickside.work.*' --ns kickside.work
test:
	cd test && WIPPY="$(WIPPY)" ./run.sh
test-pg:
	cd test && WIPPY="$(WIPPY)" PGPORT="$(or $(WORK_PG_PORT),$(PGPORT))" bash ../../test-support/postgres.sh kickside_test_work \
		bash -ec './run.sh --profile postgres --set "vars.pg_host=$$PGHOST" --set "vars.pg_port=$$PGPORT" --set "vars.pg_database=$$PGDATABASE"'

check-module:
	node scripts/generate-contracts.mjs --check
	node test/src/check-module.test.mjs
	node test/src/storage-migrations.test.mjs
	node test/src/published-harness.test.mjs
	WIPPY="$(WIPPY)" node scripts/check-module.mjs
verify: setup
	$(MAKE) lint typecheck check-module test
