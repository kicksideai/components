# kickside/research — web-component module. The repository release driver
# derives publication metadata and exact embeds from wippy.yaml.

.PHONY: build dev typecheck publish lint test
build:
	cd ui && npm ci && npm run build
dev:
	cd ui && npm run dev
typecheck:
	cd ui && npm ci --include=dev --no-audit --no-fund && ./node_modules/.bin/vue-tsc --noEmit -p tsconfig.json
lint:
	cd test && wippy install $(WIPPY_INSTALL_ARGS) && wippy lint $(WIPPY_LINT_ARGS) --ns 'kickside.research' --ns 'kickside.research.*'
test:
	cd test && wippy test $(WIPPY_TEST_ARGS)
publish:
	@echo "Releases use GitHub Release Please (.github/workflows/release.yml)." >&2
	@exit 1

.PHONY: lockrefresh
lockrefresh:
	cd test && wippy update $(WIPPY_UPDATE_ARGS)
