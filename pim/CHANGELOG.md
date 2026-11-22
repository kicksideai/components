# Changelog

## [0.1.21](https://github.com/kicksideai/components/compare/pim-v0.1.20...pim-v0.1.21) (2026-11-22)


### Bug Fixes

* **pim:** separate schema planning, plugin reads, and command types ([#388](https://github.com/kicksideai/components/issues/388)) ([b069528](https://github.com/kicksideai/components/commit/b0695287ae38dc86c5f706c47ae10e45c63db1e4))

## [0.1.20](https://github.com/kicksideai/components/compare/pim-v0.1.19...pim-v0.1.20) (2026-11-22)


### Bug Fixes

* **pim:** align receipt handling and fault probes with production ([#384](https://github.com/kicksideai/components/issues/384)) ([0817e74](https://github.com/kicksideai/components/commit/0817e74101b8516868cf7bf9cae406140596b9ff))

## [0.1.19](https://github.com/kicksideai/components/compare/pim-v0.1.18...pim-v0.1.19) (2026-11-22)


### Bug Fixes

* clarify PIM catalog setup and discovery ([#348](https://github.com/kicksideai/components/issues/348)) ([6098f4b](https://github.com/kicksideai/components/commit/6098f4bc6133dbf601b04aa1854b2e576044a73f))

## [0.1.18](https://github.com/kicksideai/components/compare/pim-v0.1.17...pim-v0.1.18) (2026-11-21)


### Bug Fixes

* **pim:** wait on the declared catalog projection cursor ([#329](https://github.com/kicksideai/components/issues/329)) ([8954dc1](https://github.com/kicksideai/components/commit/8954dc13fa442bbd3531b310a0560254bd7bfd79))

## [0.1.17](https://github.com/kicksideai/components/compare/pim-v0.1.16...pim-v0.1.17) (2026-11-21)


### Bug Fixes

* **pim:** require a materialized reservation before adopting uploads ([#316](https://github.com/kicksideai/components/issues/316)) ([0d4e213](https://github.com/kicksideai/components/commit/0d4e213ad1673ce249c581fc2bc4f5fbafe018f9))

## [0.1.16](https://github.com/kicksideai/components/compare/pim-v0.1.15...pim-v0.1.16) (2026-11-21)


### Bug Fixes

* **pim:** expose asset adoption to catalog agents ([#298](https://github.com/kicksideai/components/issues/298)) ([0c864e3](https://github.com/kicksideai/components/commit/0c864e351fea43f11d13125f48c1f5a5afc33258))
* **pim:** migrate catalog asset ledgers on upgrade ([#293](https://github.com/kicksideai/components/issues/293)) ([a6e7f27](https://github.com/kicksideai/components/commit/a6e7f27c0c003ee6888887a7cd224dcc14f3cc72))
* **pim:** retain plugin titles in catalog recovery ([#296](https://github.com/kicksideai/components/issues/296)) ([980e0f0](https://github.com/kicksideai/components/commit/980e0f0dce3b0c17f9847f92bd568aed1b1d215e))
* **pim:** support catalog-owned product images and files ([#292](https://github.com/kicksideai/components/issues/292)) ([767fbfe](https://github.com/kicksideai/components/commit/767fbfe7d93b2f675231a63217123886cb5c12bb))

## [0.1.15](https://github.com/kicksideai/components/compare/pim-v0.1.14...pim-v0.1.15) (2026-11-21)


### Bug Fixes

* **pim:** expose plugin recovery details and protect attachment cleanup ([#288](https://github.com/kicksideai/components/issues/288)) ([b1cc82e](https://github.com/kicksideai/components/commit/b1cc82eb47c6453f1a09b2a80900df019732c46e))

## [0.1.14](https://github.com/kicksideai/components/compare/pim-v0.1.13...pim-v0.1.14) (2026-11-21)


### Bug Fixes

* **pim:** acknowledge writes at their committed sequence ([#281](https://github.com/kicksideai/components/issues/281)) ([b614b88](https://github.com/kicksideai/components/commit/b614b88d0084303815d481ea0d442bbf1fafaa9d))
* **pim:** cover the full catalog schema and edge cases ([#280](https://github.com/kicksideai/components/issues/280)) ([c0c0e49](https://github.com/kicksideai/components/commit/c0c0e495153af8aaf4bc7bdc5647716db238a019))
* **pim:** fence proposals and scope command receipts ([#275](https://github.com/kicksideai/components/issues/275)) ([37056f5](https://github.com/kicksideai/components/commit/37056f506169cf819e5f62f0eb6c98df8f7f2092))
* **pim:** isolate plugin failures and recover projections ([#282](https://github.com/kicksideai/components/issues/282)) ([8116bf1](https://github.com/kicksideai/components/commit/8116bf16c7b629cd0b9c756595a5c96ec55fbefd))

## [0.1.13](https://github.com/kicksideai/components/compare/pim-v0.1.12...pim-v0.1.13) (2026-11-21)


### Bug Fixes

* **pim:** add notification-driven product waits ([#277](https://github.com/kicksideai/components/issues/277)) ([757dbfd](https://github.com/kicksideai/components/commit/757dbfd1073f9a7b9079e9116ee9bc7212ffbe6c))
* **pim:** align agent tool contracts and query continuations ([#274](https://github.com/kicksideai/components/issues/274)) ([d695f4f](https://github.com/kicksideai/components/commit/d695f4face85019a7737e6efc9718f0cb6138c8f))
* **pim:** bind catalogs to registered UI apps ([#272](https://github.com/kicksideai/components/issues/272)) ([e95fae1](https://github.com/kicksideai/components/commit/e95fae1c860db146a60b1bcd5d4b782dac3a3e49))
* **pim:** deduplicate model releases and resume change feeds ([#276](https://github.com/kicksideai/components/issues/276)) ([3abbc23](https://github.com/kicksideai/components/commit/3abbc2357e8bb6d18f0bf98a2314cb3be235c0d1))
* **pim:** give each channel release an immutable identity ([#273](https://github.com/kicksideai/components/issues/273)) ([3edabe6](https://github.com/kicksideai/components/commit/3edabe65fe0581b31ca01238752d2937d997d134))

## [0.1.12](https://github.com/kicksideai/components/compare/pim-v0.1.11...pim-v0.1.12) (2026-11-20)


### Bug Fixes

* **pim:** initialize the greenfield catalog schema in one migration ([#248](https://github.com/kicksideai/components/issues/248)) ([cc2067f](https://github.com/kicksideai/components/commit/cc2067f7ec8fb66d75a1bc4764c2d4d9c1ad217f))

## [0.1.11](https://github.com/kicksideai/components/compare/pim-v0.1.10...pim-v0.1.11) (2026-11-20)


### Bug Fixes

* **pim:** register new plugin attachments under catalog custody ([#243](https://github.com/kicksideai/components/issues/243)) ([5b73068](https://github.com/kicksideai/components/commit/5b73068d4fd225092a71e173a8b8e7e2aec98967))

## [0.1.10](https://github.com/kicksideai/components/compare/pim-v0.1.9...pim-v0.1.10) (2026-11-20)


### Bug Fixes

* **pim:** publish proposal facts and preserve installed proposals ([#223](https://github.com/kicksideai/components/issues/223)) ([2a521a7](https://github.com/kicksideai/components/commit/2a521a7e02003c6de459fae2f4f543049f4a22be))

## [0.1.9](https://github.com/kicksideai/components/compare/pim-v0.1.8...pim-v0.1.9) (2026-11-20)


### Features

* **pim:** filter catalog discovery by text and administration access ([#214](https://github.com/kicksideai/components/issues/214)) ([3a9c5c2](https://github.com/kicksideai/components/commit/3a9c5c2ed4634e6104bd02031d74b0c833183434))


### Bug Fixes

* **work:** constrain item tools and publish mutation outcomes ([876705c](https://github.com/kicksideai/components/commit/876705c3622c53f274ddef0a43d33054832545dd))

## [0.1.8](https://github.com/kicksideai/components/compare/pim-v0.1.7...pim-v0.1.8) (2026-11-20)


### Bug Fixes

* **pim:** expose plugin feed gaps on replacement pages ([#185](https://github.com/kicksideai/components/issues/185)) ([2bb9742](https://github.com/kicksideai/components/commit/2bb9742f6bc73ade1d4a82753e5943117a2c30b5))

## [0.1.7](https://github.com/kicksideai/components/compare/pim-v0.1.6...pim-v0.1.7) (2026-11-20)


### Bug Fixes

* **pim:** seek sparse indexed equality queries ([#193](https://github.com/kicksideai/components/issues/193)) ([5cbb237](https://github.com/kicksideai/components/commit/5cbb2379e520eea785b755975780f6ae6127b00b))

## [0.1.6](https://github.com/kicksideai/components/compare/pim-v0.1.5...pim-v0.1.6) (2026-11-20)


### Features

* **pim:** version plugin manifests and product patches ([#186](https://github.com/kicksideai/components/issues/186)) ([9b8d9d9](https://github.com/kicksideai/components/commit/9b8d9d9ebadcafefa14053117a3b08f51157db75))

## [0.1.5](https://github.com/kicksideai/components/compare/pim-v0.1.4...pim-v0.1.5) (2026-11-20)


### Bug Fixes

* **pim:** guard proposal acceptance and classify version conflicts ([#189](https://github.com/kicksideai/components/issues/189)) ([2b9bdbe](https://github.com/kicksideai/components/commit/2b9bdbe1ee2780ad4832a8a8c973c417976fa98e))

## [0.1.4](https://github.com/kicksideai/components/compare/pim-v0.1.3...pim-v0.1.4) (2026-11-19)


### Bug Fixes

* **pim:** guard drafts and honor product read inputs ([#167](https://github.com/kicksideai/components/issues/167)) ([bf6a6e4](https://github.com/kicksideai/components/commit/bf6a6e4873d22510a2e95ebf942cb59b40f773d2))

## [0.1.3](https://github.com/kicksideai/components/compare/pim-v0.1.2...pim-v0.1.3) (2026-11-19)


### Bug Fixes

* **pim:** bound query walks and seek feed pages ([#161](https://github.com/kicksideai/components/issues/161)) ([a2ce419](https://github.com/kicksideai/components/commit/a2ce4193a9ed2e8fee745c183c447cf472a6ffa2))
* **pim:** enforce plugin seams and committed catalog discovery ([#151](https://github.com/kicksideai/components/issues/151)) ([e30e938](https://github.com/kicksideai/components/commit/e30e9388910487cba381068ebff2e1c1647a681e))
* **pim:** enforce retention and portable term boundaries ([#154](https://github.com/kicksideai/components/issues/154)) ([54499f4](https://github.com/kicksideai/components/commit/54499f4aa62f06a8e0769c449a15f8c75f41f0b5))
* **pim:** keep term merge and import resume within deadline ([#146](https://github.com/kicksideai/components/issues/146)) ([0373bf0](https://github.com/kicksideai/components/commit/0373bf00957e29f4d24de3cb913a17f953c43745))
* **pim:** plan schema changes by attribute identity ([#149](https://github.com/kicksideai/components/issues/149)) ([9f243cc](https://github.com/kicksideai/components/commit/9f243cc2e80a014d70cb3b0db7cbf421a325f01f))
* **pim:** preserve source ordering, proposals and audit history ([#157](https://github.com/kicksideai/components/issues/157)) ([5e1a32a](https://github.com/kicksideai/components/commit/5e1a32a3327a29b1b2d87b0cccef377d51ed818f))
* **pim:** validate initial schema before catalog registration ([#164](https://github.com/kicksideai/components/issues/164)) ([b464dfa](https://github.com/kicksideai/components/commit/b464dfac805791b26c9df7ef762763b46ee78124))
* **pim:** validate product writes against their final values ([#152](https://github.com/kicksideai/components/issues/152)) ([2150447](https://github.com/kicksideai/components/commit/2150447ec1dec8748263363028a05d947476d46e))
* **pim:** validate schema indexes and track rebuilds ([#158](https://github.com/kicksideai/components/issues/158)) ([7f92252](https://github.com/kicksideai/components/commit/7f92252d4cd918d930d729f45476fea4ad5b744e))
* **pim:** validate vocabulary and schema declarations before apply ([#147](https://github.com/kicksideai/components/issues/147)) ([6116972](https://github.com/kicksideai/components/commit/61169720436cce8fab9716158a961c83212f4816))

## [0.1.2](https://github.com/kicksideai/components/compare/pim-v0.1.1...pim-v0.1.2) (2026-11-17)


### Bug Fixes

* **pim:** initialize catalogs with an empty schema ([#118](https://github.com/kicksideai/components/issues/118)) ([ba56a57](https://github.com/kicksideai/components/commit/ba56a57cf34a6808c6b06c03f6656cef930acfc0))

## [0.1.1](https://github.com/kicksideai/components/compare/pim-v0.1.0...pim-v0.1.1) (2026-11-17)


### Bug Fixes

* **pim-admin:** polish catalog operator flows ([#129](https://github.com/kicksideai/components/issues/129)) ([991c961](https://github.com/kicksideai/components/commit/991c96108ee1557e70d518dad1ded8557836d6f4))
* **pim:** complete catalog administration traits ([#122](https://github.com/kicksideai/components/issues/122)) ([b084ea8](https://github.com/kicksideai/components/commit/b084ea8e837e717771474ecbd21e74ab2ec46c10))
* run on wippy 0.3.64a with linear whitespace trims ([#120](https://github.com/kicksideai/components/issues/120)) ([edc935d](https://github.com/kicksideai/components/commit/edc935d50078c907bd9d623d8cfb5b4abd8b31fe))

## 0.1.0 (2026-11-15)


### Features

* **pim:** add the PIM catalog backend ([#114](https://github.com/kicksideai/components/issues/114)) ([100e0db](https://github.com/kicksideai/components/commit/100e0db08deedf0b6b53e882ef0d1404c984be6c))

<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
## Changelog

Releases are managed by Release Please.
