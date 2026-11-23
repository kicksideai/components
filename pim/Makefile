# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
# kickside/pim: backend module and isolated published-platform harness.
WIPPY ?= wippy
VERSION ?= 0.1.0
SHELL := bash
.SHELLFLAGS := -o pipefail -ec
WIPPY_ARGS ?=

.PHONY: setup lockrefresh lint typecheck strict check check-module test test-pg pack verify release-check
setup:
	$(WIPPY) install
	cd test && $(WIPPY) install
lockrefresh:
	$(WIPPY) update
	cd test && $(WIPPY) update
lint:
	$(WIPPY) lint
strict: typecheck
typecheck:
	cd test && $(WIPPY) lint --strict-any --level warning --ns 'kickside.pim.*' --ns kickside.pim
check: check-module
check-module:
	node scripts/generate-contracts.mjs --check
	python3 -B scripts/test-pim-plans.py
	WIPPY="$(WIPPY)" node scripts/check-module.mjs
test:
	cd test && WIPPY="$(WIPPY)" ./run.sh $(WIPPY_ARGS)
test-pg:
	cd test && WIPPY="$(WIPPY)" PGPORT="$(or $(PIM_PG_PORT),$(PGPORT))" bash ../../test-support/postgres.sh kickside_test_pim \
		bash -ec './run.sh --profile postgres --set "vars.pg_host=$$PGHOST" --set "vars.pg_port=$$PGPORT" --set "vars.pg_database=$$PGDATABASE" "$$@"' bash $(WIPPY_ARGS)
pack:
	mkdir -p .wippy
	cd test && $(WIPPY) pack --module kickside/pim ../.wippy/pim.wapp
verify: setup
	$(MAKE) lint typecheck check test
release-check:
	mkdir -p .wippy/tmp
	TMPDIR="$(CURDIR)/.wippy/tmp" $(WIPPY) publish --version "$(VERSION)" --dry-run --create --module-visibility private --module-type plugin
