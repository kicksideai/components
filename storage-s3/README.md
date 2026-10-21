# S3 storage

`kickside/storage-s3` is an optional, independently installed KickSide extension.
It moves processed original files and derived artifacts to a configured private
native S3 destination. It is not part of the default application installation.

Install it through **System → Modules**. The module owns its backend, Settings
web component, API, settings definitions, supervised jobs, placement tables,
and registry overlay controller. Its Settings block mounts the component
declaratively; the Settings bundle contains no code for this extension.

## Installation and configuration

Review the package's host requirements in the installation plan:

| Requirement | Host value |
| --- | --- |
| `kickside.storage_s3:target_db` | The same SQL resource as Uploads' content catalog |
| `kickside.storage_s3:staging_storage` | A writable native filesystem for processing and temporary reads |
| `kickside.storage_s3:s3_resource` | A native `cloudstorage.s3` destination |
| `kickside.storage_s3:api_router` | The authenticated router with token authentication and endpoint firewall |
| `kickside.storage_s3:ui_server` | The host server serving this module's built bundle |
| `kickside.storage_s3.security:user_security_scope` | Defaults to platform Members; configuration also requires Settings administration |

The S3 resource references a host-owned `config.aws` credential provider. Set a
native endpoint for S3-compatible services such as MinIO. Credentials remain in
the host's credential provider and never enter settings, events, or file references.

Installing this package declaratively binds Uploads' generic storage adapter,
completion hooks, and scoped runtime policy. It does not modify the Settings
or Uploads source and does not install a different backend by default.

Open **Settings → Content → S3 storage**. Choose the destination and relative
folder prefix, run **Test storage**, and save. The probe uploads, downloads,
verifies, and deletes a private object. Placement starts disabled until configured.

## Runtime and content lifecycle

Processing runs locally. The completion transaction enqueues a separate leased
placement job with eight attempts and a ten-minute execution deadline per attempt.
The job verifies actual remote bytes before committing their location and deleting
local bytes. Retries do not repeat conversion or OCR.

Upload and artifact IDs remain stable, including session attachments and Knowledge
references. Reads resolve the saved destination, with a bounded retry across the
placement handoff. A native file reader stages remote data locally and removes the
temporary file when closed. Retention reclaims abandoned temporary files and
unowned remote objects after a 24-hour grace period.

The extension's service is the sole writer of its private registry overlay.
It reconstructs destination generations after restart from its own durable
records without creating registry history revisions. Changing the configured
bucket creates a new generation; existing files retain their destination.

Disable future placement without uninstalling the module when retaining remote
files. Keep referenced destinations and credential providers available. Before
uninstalling, restore or delete remote content through the content lifecycle;
removing an implementation does not move its bytes back automatically.

Versioned bucket deletion creates delete markers; lifecycle rules govern physical
reclamation. Object lock can defer cleanup. This private placement module does
not publish content to a CDN.

## Development

Use Node.js 22, Wippy 0.3.47a, and the public KickSide source checkout:

```sh
make setup KICKSIDE_SOURCE_ROOT=/path/to/kickside
make build typecheck lint test KICKSIDE_SOURCE_ROOT=/path/to/kickside
make test-pg KICKSIDE_SOURCE_ROOT=/path/to/kickside \
  WIPPY_ARGS='--set vars.pg_database=my_isolated_database'
make test-s3 KICKSIDE_SOURCE_ROOT=/path/to/kickside
```

The standalone harness explicitly installs the extension. SQLite and PostgreSQL
cover ownership, denied administration, retries, integrity, cancellation, cleanup,
and concurrent reads. The pinned disposable Docker S3 suite exercises real
placement, multipart transfer, authorized reads, session references, Knowledge
ingestion, cold restart, and destination changes. Docker and shell commands are
test infrastructure; application code uses native runtime APIs.

The module follows the [KickSide authoring handbook](https://github.com/kicksideai/docs/tree/main/building-modules).
Release Please owns versions and changelogs. Publish the compatible base Uploads
release before this package; the package must pin the version introducing its
generic interfaces.

## Correcting the embedded preview release

If Uploads 0.1.74 was configured to place files, explicitly install this extension
with the corrected Uploads update. Its forward migration imports existing physical
placements and destination snapshots into its own tables, retaining logical paths,
object keys, and verification metadata. Runtime resource IDs move to this module's
namespace. The extension rehydrates those destinations on startup. It does not
install itself or enable future placement automatically; configure its policy
explicitly after installation. Incomplete earlier transfers retain local bytes.
