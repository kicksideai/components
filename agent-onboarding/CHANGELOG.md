# Changelog

## [0.1.7](https://github.com/kicksideai/components/compare/agent-onboarding-v0.1.6...agent-onboarding-v0.1.7) (2026-10-25)


### Bug Fixes

* **agent-onboarding:** honor injected postgres connection vars ([#15](https://github.com/kicksideai/components/issues/15)) ([8a3b20e](https://github.com/kicksideai/components/commit/8a3b20e5708fab89b3fd5dc0e77f88c35ed130d1))

## 0.1.6 (2026-10-17)

- Declare registry entry requirements with value_kind and default bindings.

## 0.1.2 (2026-10-08)

- test(agent-onboarding): reject all exact npm semver forms (372b2d2)
- test(agent-onboarding): accept ranged dependency declarations (b5d0e9e)
- chore: refresh locks to latest published dependencies (362c931)
- fix: bind Security in the Agent Onboarding host (f7def3e)
- fix(agent-onboarding): declare typescript ^5.0.0 like every other KickSide UI (5e52b29)
- build: rebuild bundles from source (5b84d7a)
- chore: refresh locks to latest published dependencies (bd2c140)
- Add selectable module access policies and native scope tests (fe816ae)
- test: refresh harnesses to current Hub dependencies (b76e090)
- test: declare local sibling component harness replacements (f9c21b0)
- test: refresh component harness dependencies (0488ae1)
- Include File Manager in the first agent's default capabilities (56ed5c4)
- Start the first agent as My Assistant with All Capabilities and Artifacts (3141432)
- Explain the general-purpose default once in first-agent onboarding (bbe4552)
- Present first-agent onboarding in a compact dialog (b0151b2)

## 0.1.0

First-agent onboarding for authenticated users who own no agent. Presets and
custom capabilities create a personal agent through the agents module and open
its chat. Completion and dismissal persist in the user's profile.
