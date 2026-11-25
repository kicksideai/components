# KickSide components module group. Each subdir is an independently published
# Wippy module with its own wippy.yaml, Makefile, and isolated test harness.

CANDIDATE_MODULES := $(sort $(patsubst %/wippy.yaml,%,$(wildcard */wippy.yaml)))
MODULES := $(foreach m,$(CANDIDATE_MODULES),$(if $(wildcard $(m)/.release-disabled),,$(m)))

PLATFORM_SOURCE ?= ../kickside

.PHONY: list build lint test publish structure-mail-platform

structure-mail-platform:
	python3 -B scripts/check_structure.py mail --greenfield mail --peer mail-admin --platform "$(PLATFORM_SOURCE)/core" --platform "$(PLATFORM_SOURCE)/platform"
	python3 -B scripts/check_structure.py mail-admin --peer mail --platform "$(PLATFORM_SOURCE)/core" --platform "$(PLATFORM_SOURCE)/platform"

list:
	@echo $(MODULES)

build:
	@for m in $(MODULES); do \
		if [ -f $$m/Makefile ] && grep -q '^build:' $$m/Makefile; then \
			echo "== build $$m =="; $(MAKE) -C $$m build || exit 1; \
		fi; \
	done

lint:
	@rc=0; for m in $(MODULES); do \
		echo "== lint $$m =="; (cd $$m && wippy lint) || rc=1; \
	done; exit $$rc

test:
	@rc=0; for m in $(MODULES); do \
		if [ -d $$m/test ] && grep -q "wippy/test" $$m/test/wippy.lock 2>/dev/null; then \
			echo "== test $$m =="; (cd $$m/test && wippy test) || rc=1; \
		fi; \
	done; exit $$rc

publish:
	@for m in $(MODULES); do \
		if [ -f $$m/Makefile ] && grep -q '^publish:' $$m/Makefile; then \
			echo "== publish $$m =="; $(MAKE) -C $$m publish || exit 1; \
		fi; \
	done
