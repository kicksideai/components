# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
# kickside/work: lint, typecheck and test the module through its harness on SQLite and PostgreSQL.
WIPPY ?= wippy
SHELL := bash
.SHELLFLAGS := -o pipefail -ec

.PHONY: setup lint typecheck check-module test test-pg verify
setup:
	cd test && $(WIPPY) update
lint:
	cd test && $(WIPPY) lint
typecheck:
	cd test && $(WIPPY) lint --strict-any --level warning --ns 'kickside.work.*' --ns kickside.work
test:
	cd test && WIPPY="$(WIPPY)" ./run.sh
WORK_PG_PORT ?= 5434
test-pg:
	cd test && WIPPY="$(WIPPY)" ./run.sh --profile postgres --set vars.pg_port=$(WORK_PG_PORT)

check-module:
	node scripts/generate-contracts.mjs --check
	node test/src/check-module.test.mjs
	node test/src/storage-migrations.test.mjs
	node test/src/published-harness.test.mjs
	WIPPY="$(WIPPY)" node scripts/check-module.mjs
verify: setup
	$(MAKE) lint typecheck check-module test
