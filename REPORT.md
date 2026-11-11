<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Personal memory in first-agent onboarding

The first-agent splash offers personal memory on by default through a shared checkbox. Creation finds an owned memory or provisions one through the Knowledge registry's public contract with the memory engine defaults. It then creates the agent with the memory trait and context in one call to the agents owner. Opt-out creates only the agent. Memory errors prevent agent creation; agent errors remain visible and the next attempt reuses the personal memory.

## Validation

Native guards cover memory on, memory off, caller ownership, memory creation failure and reuse after agent creation failure. UI guards cover the default choice, opt-out and the creation payload. The focused browser guard uses the real user splash with member credentials on both engines.

## Compatibility

The creation endpoint and library are additive. Existing agent endpoints, registry identities, stored contexts and event shapes stay unchanged. New router and security requirements have working defaults. Installing onboarding adds the memory dependency; it uses the existing memory engine data shape and forward migrations. Existing agents are not modified. No stored shape is retired.

Provisioning creates at most one owned personal memory per user through this flow. At 10x and 100x conversation load, onboarding adds no extra rows: its writes depend on user and agent creation, not conversation rate. Existing memory retention remains owned by the memory module.
