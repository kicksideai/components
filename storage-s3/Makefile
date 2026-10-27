WIPPY ?= wippy
KICKSIDE_SOURCE_ROOT ?= $(abspath ../../kickside)
WIPPY_ARGS ?=

.PHONY: setup build typecheck lint test test-pg test-s3 test-ui lockrefresh verify release-check publish
setup: lockrefresh

build:
	cd ui && npm ci --no-audit --no-fund && npm run build

typecheck:
	cd ui && ./node_modules/.bin/vue-tsc --noEmit -p tsconfig.json

test-ui:
	npm --prefix ui test

lockrefresh:
	KICKSIDE_SOURCE_ROOT="$(KICKSIDE_SOURCE_ROOT)" bash test/prepare.sh
	cd test && $(WIPPY) update --set "vars.kickside_root=$(KICKSIDE_SOURCE_ROOT)"

lint:
	KICKSIDE_SOURCE_ROOT="$(KICKSIDE_SOURCE_ROOT)" bash test/prepare.sh
	cd test && $(WIPPY) lint --ns kickside.storage_s3 --ns 'kickside.storage_s3.*' --set "vars.kickside_root=$(KICKSIDE_SOURCE_ROOT)" $(WIPPY_ARGS)

test:
	KICKSIDE_SOURCE_ROOT="$(KICKSIDE_SOURCE_ROOT)" bash test/prepare.sh
	@output="$$(cd test && $(WIPPY) test --set "vars.kickside_root=$(KICKSIDE_SOURCE_ROOT)" $(WIPPY_ARGS) 2>&1)"; status=$$?; \
	printf '%s\n' "$$output"; \
	if [ $$status -ne 0 ] || printf '%s\n' "$$output" | grep -qE 'FAILED|No tests found|No tests match filter' || \
		! printf '%s\n' "$$output" | grep -q 'PASSED' || \
		! printf '%s\n' "$$output" | grep -qE '[1-9][0-9]* tests'; then exit 1; fi

test-pg:
	$(MAKE) test WIPPY_ARGS="--profile postgres $(WIPPY_ARGS)"

test-s3:
	KICKSIDE_SOURCE_ROOT="$(KICKSIDE_SOURCE_ROOT)" WIPPY_BIN="$(WIPPY)" bash scripts/test-s3.sh

verify:
	$(MAKE) setup
	$(MAKE) build typecheck lint
	$(MAKE) test-ui test

release-check: verify
	$(WIPPY) publish --config . --version 0.1.0 --dry-run --create --module-visibility public --module-type plugin

publish:
	@echo "Releases use the repository's Release Please workflow." >&2
	@exit 1
