# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
WIPPY ?= wippy
WIPPY_ARGS ?=
VERSION ?= $(shell node -p "require('../.release-please-manifest.json')['work-kanban'] || '0.1.0'")
SHELL := bash
.SHELLFLAGS := -o pipefail -ec

.PHONY: setup ui-kit ui-setup build typecheck ui-test lint test pack pack-public check verify
setup: ui-setup
	cd test && $(WIPPY) install

ui-kit:
	cd build-inputs && $(WIPPY) install
	$(WIPPY) artifacts materialize build-inputs/.wippy/vendor/kickside/ui-kit-1.7.8.wapp kickside.ui_kit:package_fs --root ui/.wippy

ui-setup: ui-kit
	npm --prefix ui ci --cache "$(CURDIR)/.wippy/npm-cache"

build: ui-kit
	@test -L ui/node_modules/@kickside/ui-kit || npm --prefix ui ci --cache "$(CURDIR)/.wippy/npm-cache"
	npm --prefix ui run build

typecheck:
	npm --prefix ui run typecheck

ui-test:
	npm --prefix ui test

lint:
	cd test && $(WIPPY) lint --ns kickside.work.kanban $(WIPPY_ARGS)

test:
	cd test && WIPPY="$(WIPPY)" ./run.sh $(WIPPY_ARGS)

check:
	node --test test/package.test.mjs

pack: build
	cd test && $(WIPPY) pack --module kickside/work-kanban --embed kickside.work.kanban:ui_fs .wippy/work-kanban.wapp

pack-public: build
	mkdir -p .wippy/pack
	TMPDIR="$(CURDIR)/.wippy/pack" $(WIPPY) publish --config . --version $(VERSION) --dry-run --create --module-visibility public --module-type plugin --embed kickside.work.kanban:ui_fs

verify: setup build typecheck ui-test lint test check pack
