# Changelog

## [0.1.13](https://github.com/kicksideai/components/compare/work-v0.1.12...work-v0.1.13) (2026-11-20)


### Bug Fixes

* **work:** constrain item tools and publish mutation outcomes ([876705c](https://github.com/kicksideai/components/commit/876705c3622c53f274ddef0a43d33054832545dd))

## [0.1.12](https://github.com/kicksideai/components/compare/work-v0.1.11...work-v0.1.12) (2026-11-20)


### Features

* **work:** expose per-field edit capabilities ([68de4c4](https://github.com/kicksideai/components/commit/68de4c4d46ab4b782a2fa4e4607572512e5d47f9))

## [0.1.11](https://github.com/kicksideai/components/compare/work-v0.1.10...work-v0.1.11) (2026-11-20)


### Bug Fixes

* **work:** allow saving every application default ([5b68334](https://github.com/kicksideai/components/commit/5b683342050c6d9b64dfad1b92ad104f7fa393b9))
* **work:** restore feed continuation and operation tracking ([#180](https://github.com/kicksideai/components/issues/180)) ([fd23628](https://github.com/kicksideai/components/commit/fd236284486fbd2b67da74f4037db3472cd9c974))

## [0.1.10](https://github.com/kicksideai/components/compare/work-v0.1.9...work-v0.1.10) (2026-11-20)


### Bug Fixes

* **work:** invalidate cross-board links and fence plugin scopes ([#177](https://github.com/kicksideai/components/issues/177)) ([71366a4](https://github.com/kicksideai/components/commit/71366a4d5da7f45af17602776b4ae9208fa920e0))
* **work:** preserve stage reports when routing is refused ([#181](https://github.com/kicksideai/components/issues/181)) ([cb12c63](https://github.com/kicksideai/components/commit/cb12c6352b25405cb8e5eafe3486cbeda69547ad))

## [0.1.9](https://github.com/kicksideai/components/compare/work-v0.1.8...work-v0.1.9) (2026-11-19)


### Bug Fixes

* **work:** validate board creation and allow visibility removal ([e7b5f5e](https://github.com/kicksideai/components/commit/e7b5f5ea22e667dd3ad6409e7a30b3b6adb0cd4d))

## [0.1.8](https://github.com/kicksideai/components/compare/work-v0.1.7...work-v0.1.8) (2026-11-19)


### Bug Fixes

* **work:** acknowledge writes at their committed sequence ([162a37b](https://github.com/kicksideai/components/commit/162a37b31a6b085a6076e640049b5a6887b86938))

## [0.1.7](https://github.com/kicksideai/components/compare/work-v0.1.6...work-v0.1.7) (2026-11-19)


### Bug Fixes

* **work:** cancel the parked job when a move prepare conflicts ([#175](https://github.com/kicksideai/components/issues/175)) ([26a6a96](https://github.com/kicksideai/components/commit/26a6a96c575d044b32dcdb0866a9dc0ef29bf2bb))

## [0.1.6](https://github.com/kicksideai/components/compare/work-v0.1.5...work-v0.1.6) (2026-11-19)


### Bug Fixes

* **work:** release move keys after prepare conflicts ([#173](https://github.com/kicksideai/components/issues/173)) ([d9a999a](https://github.com/kicksideai/components/commit/d9a999ab0c6d5d723d8f2dbc65038e913787e3a9))

## [0.1.5](https://github.com/kicksideai/components/compare/work-v0.1.4...work-v0.1.5) (2026-11-19)


### Bug Fixes

* **work:** harden public API correctness ([#170](https://github.com/kicksideai/components/issues/170)) ([449814c](https://github.com/kicksideai/components/commit/449814c81a06d0773d0c50bde92f4e80e4c82b07))

## [0.1.4](https://github.com/kicksideai/components/compare/work-v0.1.3...work-v0.1.4) (2026-11-19)


### Bug Fixes

* **work:** declare the registry admin grant as an object literal ([#140](https://github.com/kicksideai/components/issues/140)) ([7ff6406](https://github.com/kicksideai/components/commit/7ff6406c64725020adfc9a6ce6fec3d43cd7c7e7))
* **work:** enforce access across reads and stage delivery ([#159](https://github.com/kicksideai/components/issues/159)) ([6b440ec](https://github.com/kicksideai/components/commit/6b440ecfad04093ce4bf6e01aee8cdb20f96c45e))
* **work:** enforce schema admission and pack contracts ([#150](https://github.com/kicksideai/components/issues/150)) ([25e4f21](https://github.com/kicksideai/components/commit/25e4f21f2b8eb6aeddc22642c8cbdf850f3803e3))
* **work:** keep board projections advancing and scoped ([#148](https://github.com/kicksideai/components/issues/148)) ([19b47a6](https://github.com/kicksideai/components/commit/19b47a64da7b65fa10a7879b5287cb8488c1b967))
* **work:** pace fleet retention rediscovery ([#163](https://github.com/kicksideai/components/issues/163)) ([d1e328d](https://github.com/kicksideai/components/commit/d1e328d7fb510c72904bce5b8a485580c29f2aa5))
* **work:** preserve process outcomes and decisions ([#153](https://github.com/kicksideai/components/issues/153)) ([dddb0f1](https://github.com/kicksideai/components/commit/dddb0f16242970ab8ea9bfff5e7a011c7020da8f))
* **work:** preserve query order and index seeks under read budgets ([#160](https://github.com/kicksideai/components/issues/160)) ([77b8bb4](https://github.com/kicksideai/components/commit/77b8bb4ad63da177ac1a5044e65f8e10f63720c2))
* **work:** preserve retention and paging continuity ([#155](https://github.com/kicksideai/components/issues/155)) ([5c14750](https://github.com/kicksideai/components/commit/5c147502d53afac63d73a94c7ea69fd5f599f922))
* **work:** synchronize stage launches and preserve visit deadlines ([#156](https://github.com/kicksideai/components/issues/156)) ([466a2fd](https://github.com/kicksideai/components/commit/466a2fdfddb34118bdc566ee38d6407aeff72daa))

## [0.1.3](https://github.com/kicksideai/components/compare/work-v0.1.2...work-v0.1.3) (2026-11-17)


### Features

* **work:** bind stages to Flows and complete launched runs ([#132](https://github.com/kicksideai/components/issues/132)) ([784936f](https://github.com/kicksideai/components/commit/784936f2ec8532fbd997c84dbba8001be59b94fe))


### Bug Fixes

* **work-admin:** correct board creation and settings workflows ([#124](https://github.com/kicksideai/components/issues/124)) ([a89f79f](https://github.com/kicksideai/components/commit/a89f79fb67aad3ce2fa69c948e32ee6beaa96f32))
* **work:** confirm destructive retention decreases ([#136](https://github.com/kicksideai/components/issues/136)) ([c1e05cc](https://github.com/kicksideai/components/commit/c1e05ccf8f7ef59a882bbb1e36fa70e05e9ec4c7))

## [0.1.2](https://github.com/kicksideai/components/compare/work-v0.1.1...work-v0.1.2) (2026-11-17)


### Bug Fixes

* run on wippy 0.3.64a with linear whitespace trims ([#120](https://github.com/kicksideai/components/issues/120)) ([edc935d](https://github.com/kicksideai/components/commit/edc935d50078c907bd9d623d8cfb5b4abd8b31fe))
* **work:** complete administration traits and tool schemas ([#123](https://github.com/kicksideai/components/issues/123)) ([3e9785c](https://github.com/kicksideai/components/commit/3e9785c48822259ac73854e5f6554bbb90fe1a68))
* **work:** publish comment snapshots in the declared feed shape ([#125](https://github.com/kicksideai/components/issues/125)) ([cd8e49b](https://github.com/kicksideai/components/commit/cd8e49bc3c3843561c605e061dd8c90574ae7791))

## [0.1.1](https://github.com/kicksideai/components/compare/work-v0.1.0...work-v0.1.1) (2026-11-15)


### Features

* **work:** add the Work board engine ([#110](https://github.com/kicksideai/components/issues/110)) ([28ad1d7](https://github.com/kicksideai/components/commit/28ad1d742322113a7fa1a82603300da49718747a))


### Bug Fixes

* **work:** exclude test application namespaces from the package ([#111](https://github.com/kicksideai/components/issues/111)) ([6a22f9f](https://github.com/kicksideai/components/commit/6a22f9f010cfbfe6519e8f4c943dc9546a77b984))
* **work:** harden authority, replay and bounded storage ([#112](https://github.com/kicksideai/components/issues/112)) ([229de0f](https://github.com/kicksideai/components/commit/229de0fd532636f9bf9bd5553233d71cfe9689ad))
