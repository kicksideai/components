# Contributing to KickSide Components

Follow the [organization contribution guide](https://github.com/kicksideai/.github/blob/main/CONTRIBUTING.md),
[Code of Conduct](https://github.com/kicksideai/.github/blob/main/CODE_OF_CONDUCT.md), and
[CLA](https://github.com/kicksideai/.github/blob/main/CLA.md). Send the signed CLA privately to
[licensing@wippy.ai](mailto:licensing@wippy.ai) before merge.

## Development and testing

Install Wippy, Node.js 22, npm, Make, and Python 3. From the repository root:

```sh
make -C dashboard build
make -C dashboard lint
make -C dashboard test
make -C research build
make -C research lint
make -C research test
```

Run the targets for the module you change. Research's test target includes
architecture checks, backend tests, and UI tests. Root `make test` covers backend
harnesses only; use the module targets for the complete checks. Keep regenerated
tracked `static/` bundles with their `ui/` source. Consult each harness for its
database profiles and exercise PostgreSQL when relevant to persistence changes.

## Pull requests

Create a focused branch and submit a GitHub pull request to this repository.
Use a commit subject such as
`docs: clarify setup` or `fix: handle an empty result`. Explain the behavior and
validation in the PR; include relevant commands and outcomes. Maintainers review
and merge GitHub pull requests after the required checks and CLA confirmation.
