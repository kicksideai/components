# S3 storage

`kickside/storage-s3` optionally moves processed upload originals and derived
blobs to private native S3 storage. Install it through **System → Modules**.
Its Settings component, policy and authenticated endpoints belong to this module.

## Configuration

The installation plan binds these host requirements:

| Requirement | Host value |
| --- | --- |
| `kickside.storage_s3:s3_resource` | A native `cloudstorage.s3` destination |
| `kickside.storage_s3:api_router` | The authenticated API router |
| `kickside.storage_s3:ui_server` | The server serving the built Settings component |
| `kickside.storage_s3.security:user_security_scope` | Defaults to Members; configuration also requires Settings administration |

The S3 entry uses a host-owned `config.aws` credential provider. Native endpoints
support S3-compatible services. Credentials stay outside settings and content
references. The module depends on Uploads and Settings with `'*'` declarations;
install an Uploads release supporting packed paths and stage relocation first.

Open **Settings → Content → S3 storage**, choose a destination and relative prefix,
run **Test storage**, then save. The probe uploads an object, checks its size and
deletes it. Placement defaults to local and applies to future processing.

## Processing and reads

The universal stage runs at the lowest priority (`-100`) after other processors.
It copies local originals and derived blobs, verifies native object metadata,
and returns their packed `s3://<resource-id>/<key>` paths. Uploads validates target
metadata, commits the locations together, then removes unreferenced old bytes.
An original already in S3 keeps its path while local derived blobs still relocate.

Upload, artifact, attachment and Knowledge references keep their IDs. Uploads'
default adapter reads relative filesystem paths, packed filesystem paths and
packed S3 paths. This module binds Uploads' `storage_runtime_policy` requirement
to its exact native-resource grants; it does not replace the adapter. Reads keep
the caller's content authorization and add only the declared runtime authority.

Authorized API responses supply expiring signed S3 delivery URLs in `raw_url`.
Filesystem delivery uses authenticated raw endpoints, which also remain available
for S3 content. Signed URLs last 15 minutes; reload the record to obtain a new URL.
The object host must allow the application's origin for browser GET/HEAD requests.

Disabling placement leaves existing packed locations readable. Keep every
referenced native entry, its credentials and runtime grant available. Removing
the module or a destination does not restore bytes to local storage.

**BREAKING:** placements written by storage-s3 0.1.0 are unsupported by this
packed-path implementation. Their placement tables and generated destinations
are not migrated or read. Existing placement data is not dropped.

## Development

Use Node.js 22 and Wippy 0.3.54a with the KickSide source checkout:

```sh
make setup KICKSIDE_SOURCE_ROOT=/path/to/kickside
make verify KICKSIDE_SOURCE_ROOT=/path/to/kickside
make test-pg KICKSIDE_SOURCE_ROOT=/path/to/kickside \
  WIPPY_ARGS='--set vars.pg_database=my_isolated_database'
make test-s3 KICKSIDE_SOURCE_ROOT=/path/to/kickside
```

Create a dedicated PostgreSQL database and drop it after testing. `verify` runs
the UI build, typecheck, lint, UI tests and SQLite harness. `test-s3` uses disposable
Docker storage to exercise relocation, member authority, Knowledge ingestion and
reads across separate runtime starts. Commit rebuilt tracked static assets.
Release Please owns versions and changelogs.
