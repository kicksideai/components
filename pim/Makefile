# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
# kickside/pim: backend module and isolated published-platform harness.
WIPPY ?= wippy
VERSION ?= 0.1.0
SHELL := bash
.SHELLFLAGS := -o pipefail -ec
PIM_PG_PORT ?= 5434
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
	python3 -B scripts/test-pim-plans.py
	WIPPY="$(WIPPY)" node scripts/check-module.mjs
test:
	cd test && WIPPY="$(WIPPY)" ./run.sh $(WIPPY_ARGS)
test-pg:
	cd test && WIPPY="$(WIPPY)" ./run.sh --profile postgres --set vars.pg_port=$(PIM_PG_PORT) $(WIPPY_ARGS)
pack:
	mkdir -p .wippy
	cd test && $(WIPPY) pack --module kickside/pim ../.wippy/pim.wapp
verify: setup
	$(MAKE) lint typecheck check test
release-check:
	mkdir -p .wippy/tmp
	TMPDIR="$(CURDIR)/.wippy/tmp" $(WIPPY) publish --version "$(VERSION)" --dry-run --create --module-visibility private --module-type plugin
