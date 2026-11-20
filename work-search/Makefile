# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
WIPPY ?= wippy
WORK_SEARCH_PG_PORT ?= 5434

.PHONY: setup lint test test-pg
setup:
	cd test && $(WIPPY) install
lint:
	cd test && $(WIPPY) lint --ns kickside.work_search --ns app --level warning
test:
	WIPPY="$(WIPPY)" bash test/run.sh
test-pg:
	WIPPY="$(WIPPY)" bash test/run.sh --profile postgres --set vars.pg_port=$(WORK_SEARCH_PG_PORT)
