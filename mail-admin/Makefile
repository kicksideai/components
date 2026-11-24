# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
WIPPY ?= wippy
WIPPY_ARGS ?=
VERSION ?= $(shell node -p "require('../.release-please-manifest.json')['mail-admin'] || '0.1.0'")
MAIL_ADMIN_PG_PORT ?= 5435
ENCRYPTION_KEY ?= 0000000000000000000000000000000000000000000000000000000000000000
export ENCRYPTION_KEY
SHELL := bash
.SHELLFLAGS := -o pipefail -ec

.PHONY: setup lockrefresh ui-kit ui-setup ui-lock ui-test test-ui typecheck build lint strict check test test-pg pack verify publish
setup: ui-setup
	cd test && $(WIPPY) install
lockrefresh:
	cd test && $(WIPPY) update
ui-kit:
	cd build-inputs && if [[ -f wippy.lock ]]; then $(WIPPY) install; else $(WIPPY) update; fi
	@version="$$(awk '$$1 == "version:" {print $$2; exit}' build-inputs/wippy.lock)"; \
	$(WIPPY) artifacts materialize "build-inputs/.wippy/vendor/kickside/ui-kit-$$version.wapp" kickside.ui_kit:package_fs --root ui/.wippy
ui-setup: ui-kit
	npm --prefix ui ci --cache "$(CURDIR)/.wippy/npm-cache"
ui-lock: ui-kit
	npm --prefix ui install --package-lock-only --cache "$(CURDIR)/.wippy/npm-cache"
ui-test test-ui:
	npm --prefix ui test -- $(UI_TEST_ARGS)
typecheck:
	npm --prefix ui run type-check
build: ui-kit
	@test -L ui/node_modules/@kickside/ui-kit || npm --prefix ui ci --cache "$(CURDIR)/.wippy/npm-cache"
	npm --prefix ui run build
lint:
	cd test && $(WIPPY) lint --ns kickside.mail.admin --ns 'kickside.mail.admin.*' --ns app $(WIPPY_ARGS)
strict:
	cd test && $(WIPPY) lint --strict-any --level warning --ns kickside.mail.admin --ns 'kickside.mail.admin.*' --ns app $(WIPPY_ARGS)
check:
	WIPPY="$(WIPPY)" node scripts/check-module.mjs
test:
	cd test && WIPPY="$(WIPPY)" ./run.sh $(WIPPY_ARGS)
test-pg:
	$(MAKE) test WIPPY_ARGS="--profile postgres --set vars.pg_port=$(MAIL_ADMIN_PG_PORT) $(WIPPY_ARGS)"
pack:
	cd test && $(WIPPY) pack --module kickside/mail-admin --embed kickside.mail.admin:ui_fs .wippy/mail-admin.wapp
	mkdir -p .wippy/pack
	TMPDIR="$(CURDIR)/.wippy/pack" $(WIPPY) publish --config . --version $(VERSION) --dry-run --create --module-visibility private --module-type plugin --embed kickside.mail.admin:ui_fs
verify: lockrefresh ui-setup build typecheck ui-test lint strict check test pack
publish:
	@echo "Releases use the repository's Release Please workflow." >&2
	@exit 1
