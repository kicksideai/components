# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
WIPPY ?= wippy
TEST_DIR ?= test
WORK_TIME_PG_DATABASE ?= kickside_test_work_time
SHELL := bash
.SHELLFLAGS := -o pipefail -ec

.PHONY: setup lint test test-pg
setup:
	cd "$(TEST_DIR)" && "$(WIPPY)" install

lint:
	cd "$(TEST_DIR)" && "$(WIPPY)" lint --ns kickside.work.time --ns 'kickside.work.time.*' --level warning

test:
	cd "$(TEST_DIR)" && mkdir -p .wippy && \
		WIPPY_TEST_REQUIRE_CASES=1 "$(WIPPY)" test $(TEST_ARGS) 2>&1 | tee .wippy/last-test-run.log && \
		grep -q PASSED .wippy/last-test-run.log && ! grep -Eq 'FAILED|No tests found|No tests match' .wippy/last-test-run.log

test-pg:
	bash ../test-support/postgres.sh "$(WORK_TIME_PG_DATABASE)" bash -ec \
		'$(MAKE) test TEST_ARGS="--profile postgres --set vars.pg_host=$$PGHOST --set vars.pg_port=$$PGPORT --set vars.pg_database=$$PGDATABASE $(TEST_ARGS)"'
