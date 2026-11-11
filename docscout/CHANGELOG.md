# Changelog

## [0.1.6](https://github.com/kicksideai/components/compare/docscout-v0.1.5...docscout-v0.1.6) (2026-11-11)


### Bug Fixes

* **docscout:** batch extraction by estimated reply size ([#77](https://github.com/kicksideai/components/issues/77)) ([fb8ffb4](https://github.com/kicksideai/components/commit/fb8ffb454799d02419f5a9d7379bb1f59c42ac9f))
* **docscout:** expose scoped missing causes per field ([#78](https://github.com/kicksideai/components/issues/78)) ([97fbc67](https://github.com/kicksideai/components/commit/97fbc67423bc547cc67c9f63046c8ab75890889c))
* **docscout:** guide generated queries with plain phrases and key terms ([#74](https://github.com/kicksideai/components/issues/74)) ([ac1187f](https://github.com/kicksideai/components/commit/ac1187f1fa7f6fec58552210c64986b8aba4dd80))
* **docscout:** make completeness judgments opt-in per extractor ([#79](https://github.com/kicksideai/components/issues/79)) ([a1cfbc9](https://github.com/kicksideai/components/commit/a1cfbc970a92c4fa7e7ec3410b997b01225d65e0))
* **docscout:** retry native transient evaluation failures and retain usage ([#76](https://github.com/kicksideai/components/issues/76)) ([7475c46](https://github.com/kicksideai/components/commit/7475c46a25b561d186aa309f4b60c33db64c1236))

## [0.1.5](https://github.com/kicksideai/components/compare/docscout-v0.1.4...docscout-v0.1.5) (2026-11-11)


### Bug Fixes

* **docscout:** apply min_similarity to each hit's vector similarity ([#72](https://github.com/kicksideai/components/issues/72)) ([e5c2b98](https://github.com/kicksideai/components/commit/e5c2b98b48d6bffe65416614a9100a36966161dd))

## [0.1.4](https://github.com/kicksideai/components/compare/docscout-v0.1.3...docscout-v0.1.4) (2026-11-11)


### Features

* **docscout:** record model call outcomes and run summaries ([#53](https://github.com/kicksideai/components/issues/53)) ([8619ee8](https://github.com/kicksideai/components/commit/8619ee8076ce9549eeec04e22fbf9598268899e8))
* **docscout:** scope extraction runs to document pages ([#67](https://github.com/kicksideai/components/issues/67)) ([312cf25](https://github.com/kicksideai/components/commit/312cf25d91049b91c238db633fcea4c639280b5d))


### Bug Fixes

* **docscout:** meter failed replies and report length cuts as truncation ([#69](https://github.com/kicksideai/components/issues/69)) ([55bca58](https://github.com/kicksideai/components/commit/55bca58fc297729d2f965d5b860eebf1e445b504))
* **docscout:** retain reasons for unverified saved values ([#66](https://github.com/kicksideai/components/issues/66)) ([62dce75](https://github.com/kicksideai/components/commit/62dce75f732ef4d228315496b14a7679ee004c84))

## [0.1.3](https://github.com/kicksideai/components/compare/docscout-v0.1.2...docscout-v0.1.3) (2026-11-11)


### Bug Fixes

* **docscout:** default map, scout, extract and verify to temperature 0 ([#54](https://github.com/kicksideai/components/issues/54)) ([cad64ca](https://github.com/kicksideai/components/commit/cad64caea682cf9f300c7eff594cc3490e12c8ca))
* **docscout:** fail free-text replies cut by their output limit ([#56](https://github.com/kicksideai/components/issues/56)) ([dd167e3](https://github.com/kicksideai/components/commit/dd167e35e5258e36a6473c0a5bf59d0ce0f3694b))
* **docscout:** keep per-field provenance in the evidence pool ([#59](https://github.com/kicksideai/components/issues/59)) ([e7ced65](https://github.com/kicksideai/components/commit/e7ced650b1e77c66226e7713ce8f2728755aa7fa))
* **docscout:** keep the built outline on the processed copy ([#58](https://github.com/kicksideai/components/issues/58)) ([08092de](https://github.com/kicksideai/components/commit/08092dee4611bc4f97f309f2d9bb24bb97fa97be))
* **docscout:** key scout evidence, section summaries and highlights by item ([#55](https://github.com/kicksideai/components/issues/55)) ([be84ab9](https://github.com/kicksideai/components/commit/be84ab986b2d055a9a7d589385788a0edffb9991))
* **docscout:** key section choices by field with bounded ordinals ([#47](https://github.com/kicksideai/components/issues/47)) ([4095ae6](https://github.com/kicksideai/components/commit/4095ae627e70eae0d604f48f3fa70d0afa435f07))
* **docscout:** let map, scout, extract and verify set sampling temperature ([#49](https://github.com/kicksideai/components/issues/49)) ([7656e64](https://github.com/kicksideai/components/commit/7656e6406bd7e61857fc3fa93a94c4e10902f6e3))
* **docscout:** require one support verdict per field ([#48](https://github.com/kicksideai/components/issues/48)) ([df312e8](https://github.com/kicksideai/components/commit/df312e876f9e0d9e3df26de1fe45c728e77db92d))
* **docscout:** verify dates against their declared format ([#60](https://github.com/kicksideai/components/issues/60)) ([a8dc721](https://github.com/kicksideai/components/commit/a8dc721fb0cfc2252507280f560d2be7fab30a17))

## [0.1.2](https://github.com/kicksideai/components/compare/docscout-v0.1.1...docscout-v0.1.2) (2026-11-10)


### Bug Fixes

* **docscout:** support extractor retention windows ([#43](https://github.com/kicksideai/components/issues/43)) ([bbb3b9b](https://github.com/kicksideai/components/commit/bbb3b9b4a0eae5fcbbbfcd401e2413145a6c4ea4))

## [0.1.1](https://github.com/kicksideai/components/compare/docscout-v0.1.0...docscout-v0.1.1) (2026-11-06)


### Bug Fixes

* **docscout:** exclude host application and test support entries from the package ([346d872](https://github.com/kicksideai/components/commit/346d872445f3e8985a42d1d2bd3e5c34fcfa5596))

## 0.1.0 (2026-11-01)


### Features

* **docscout:** document field extraction component ([#20](https://github.com/kicksideai/components/issues/20)) ([478ac23](https://github.com/kicksideai/components/commit/478ac2388aa11ea5e8dade5ec693b9a4a199525c))
