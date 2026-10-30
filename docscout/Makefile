# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
WIPPY ?= wippy
KICKSIDE_SOURCE_ROOT ?= $(abspath ../../kickside)
WIPPY_ARGS ?=
SHELL := bash
.SHELLFLAGS := -o pipefail -ec
.PHONY: lockrefresh lint test test-pg build typecheck test-ui
lockrefresh:
	cd test && $(WIPPY) update --set "vars.kickside_root=$(KICKSIDE_SOURCE_ROOT)"
lint:
	cd test && $(WIPPY) lint --ns kickside.docscout --ns 'kickside.docscout.*' --set "vars.kickside_root=$(KICKSIDE_SOURCE_ROOT)"
test:
	test_http_address=$$(python3 -c 'import socket; s=socket.socket(); s.bind(("",0)); print("%s:%s" % s.getsockname()); s.close()'); \
	cd test && $(WIPPY) test --set "vars.kickside_root=$(KICKSIDE_SOURCE_ROOT)" --set "vars.http_address=$$test_http_address" $(WIPPY_ARGS) 2>&1 | tee .wippy/test-result.log
	! grep -Eq 'FAILED|No tests found|No tests match filter' test/.wippy/test-result.log
	grep -Eq '[1-9][0-9]* tests' test/.wippy/test-result.log
test-pg:
	$(MAKE) test WIPPY_ARGS="--profile postgres $(WIPPY_ARGS)"
ui-kit:
	cd build-inputs && $(WIPPY) update --src-dir src
	$(WIPPY) artifacts materialize $$(find build-inputs/.wippy/vendor/kickside -name 'ui-kit-*.wapp' ! -name '*sha256*') kickside.ui_kit:package_fs --root ui/.wippy
ui-install: ui-kit
	cd ui && npm ci --no-audit --no-fund
build:
	cd ui && npm run build
typecheck:
	cd ui && npm run type-check
test-ui:
	cd ui && npm test

preview:
	cd ui && npm run preview

.PHONY: setup verify postgres-up postgres-down test-sqlite
setup: lockrefresh
verify:
	$(MAKE) lint test typecheck test-ui build
postgres-up:
	docker compose -f test/postgres.yaml up -d --wait
postgres-down:
	docker compose -f test/postgres.yaml down -v
test-sqlite: test
