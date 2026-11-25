# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
WIPPY ?= wippy
SHELL := bash
.SHELLFLAGS := -o pipefail -ec
ENCRYPTION_KEY ?= 0000000000000000000000000000000000000000000000000000000000000000
export ENCRYPTION_KEY

.PHONY: lockrefresh lint typecheck check-module structure test test-pg verify publish
lockrefresh:
	cd test && $(WIPPY) update

lint:
	cd test && $(WIPPY) lint --ns 'kickside.mail' --ns 'kickside.mail.*' $(WIPPY_ARGS)

typecheck:
	cd test && $(WIPPY) lint --strict-any --level warning --ns 'kickside.mail' --ns 'kickside.mail.*' $(WIPPY_ARGS)

test:
	WIPPY="$(WIPPY)" ./test/run.sh $(WIPPY_ARGS)

test-pg:
	WIPPY="$(WIPPY)" ./test/run.sh --profile postgres $(WIPPY_ARGS)

check-module:
	WIPPY="$(WIPPY)" node scripts/check-module.mjs

structure:
	node scripts/check-module.mjs --structure-only

verify: structure lockrefresh
	$(MAKE) lint typecheck check-module test

publish:
	@echo "Releases use GitHub Release Please (.github/workflows/release.yml)." >&2
	@exit 1
