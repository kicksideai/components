# kickside/sso

User single sign-on for kickside apps. Lets people log in with external identity
providers (Google, Microsoft/Entra, GitHub, and any generic OIDC issuer) on top
of the existing `app_users` / token-store auth, without replacing password login.

## Compatibility

Requires `kickside/users >=0.2.9`, which provides the
`kickside.users.security:resolve_scope_groups` policy used by the login callback.
Older Users packages are rejected during dependency resolution instead of
failing when a callback resolves its runtime policies.

For existing installations, include Users and SSO in the same update plan.
An older SSO callback lacks the resolver permission required by newer Users
packages. The callback policy update preserves existing sessions and pending
provider login state.

## What it does

- **Pluggable connectors.** Providers are connector libraries dispatched by
  `connectors/providers.lua` (the extension seam). Install provider packages for `google`,
  `microsoft`, `github`, or a generic `oidc` connector (issuer discovery via
  `.well-known/openid-configuration`, so any compliant IdP works by configuration
  alone).
- **Settings-driven.** Providers are enabled and credentialed from the System →
  Settings UI (`kickside.settings:definition` entries; client secrets encrypted at
  rest). No redeploy to add or rotate a provider.
- **Account model.** An SSO identity links to an existing `app_users` account by
  provider-verified email. One account can carry a password plus several SSO
  identities. SSO-only accounts hold a locked-password sentinel and cannot log in
  with a password until one is set.
- **Provisioning.** First-time SSO login auto-creates an account only when the
  verified email domain is on the configurable allowlist; otherwise it is denied.
  The account remains pending until its provider identity and Users-owned group
  memberships are complete, and a failed callback resumes safely on retry.
- **Sessions.** Reuses the same token store (through `kickside.users:user_provisioning`) and
  actor/scope model as password login, so `GET /user/me`, groups, sharing, and the
  `token_auth` middleware all work unchanged.

## Endpoints

Endpoint paths are router-relative (`/sso/...`); the table shows the effective
paths under the app's public (`/api/public`) and authenticated (`/api/v1`)
routers.

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/public/sso/providers` | public | Enabled providers for the login UI |
| GET | `/api/public/sso/{provider}/start` | public | Begin login (PKCE + state + nonce) |
| GET | `/api/public/sso/{provider}/callback` | public | Complete login, mint a session |
| GET | `/api/v1/sso/connections` | user | The current user's linked identities |
| POST | `/api/v1/sso/{provider}/link` | user | Link a provider to the current account |
| DELETE | `/api/v1/sso/{provider}/link` | user | Unlink a provider |

The public mount path (`/api/public/sso`) is configurable via the
`public_base_path` setting if the public router is mounted elsewhere.

## App integration

The module ships a `kickside-sso` web component (served at `/kickside-sso`):

- **Login page:** embed `<kickside-sso mode="buttons">`. It lists enabled
  providers and redirects to the chosen one. After the round-trip the callback
  returns to the page with the session token in the URL fragment; the component
  emits a `token` component event and a `kickside-sso-token` DOM event carrying
  it. The host login bootstrap stores that token exactly as it stores a
  password-login token.
- **Profile settings:** embed `<kickside-sso mode="account">` for the
  connected-logins panel (connect/disconnect providers).

Admin configuration needs no new UI — the settings definitions surface in the
existing System → Settings tab automatically.

## Security

PKCE (S256), `state` CSRF cookie, OIDC `nonce`, `id_token` `iss`/`aud`/`exp` and
signature validation (RS256 or ES256 when a JWKS key can be derived),
`email_verified` required before any auto-provision or link unless
the provider has an explicit email-trust setting, and a post-login redirect
allowlist (open-redirect guard).

ES256 verification supports EC P-256 JWKs and requires Runtime **v0.3.56a or
later**. RSA keys continue to use RS256. In a mixed JWKS, key selection matches
the token's algorithm and its `kid` when supplied; an incompatible key remains
a signature-verification error. If no JWKS key can be obtained, the existing
token-exchange path validates the TLS-delivered token's claims without verifying
its signature.

## Supported protocols

The module supports OAuth2/OIDC. SAML and SCIM/IdP-group mapping are outside
its protocol surface. Provider enablement runs the declared validation gate.

## Quick start

```sh
wippy add kickside/sso
wippy install
```

## Requirements

Wippy 0.3.x; repository validation uses 0.3.47a. Use current Hub dependencies
for the contracts declared by the module.
SQLite or PostgreSQL supplies application persistence. Frontend builds use
Node.js 22, npm, and Make.

## Development

The default harness resolves the declared Users package rather than replacing it
with an unversioned local checkout. Run `make lockrefresh` before the test commands
when dependency declarations change. Users must satisfy the minimum above.

To qualify an unreleased Users/SSO source pair, use a separate test configuration
with explicit source replacements and a lock derived from the exact candidate
versions. Record those revisions and SDK pins separately from published-package
or installed-upgrade results.

Run `wippy install` in `test/`, then `make lint` and `make test` in this
directory. For PostgreSQL, run `wippy test --profile postgres` in `test/`
against a dedicated scratch database and drop it after the run.

## License

[KickSide Community License 1.0](LICENSE).

[KickSide](https://kickside.ai) · [Module authoring](https://github.com/kicksideai/docs/blob/main/building-modules/index.md)

## Use

Configure an installed SSO provider in **System → Settings**, including its client credentials and callback. The provider’s validated identity and provisioning rules determine login and linking. Service OAuth connections are separate from sign-in providers; installing one does not configure the other.

### Host requirements

Bind these exact requirement IDs through the module’s dependency declaration
or Hub plan. Existing explicit bindings take precedence over defaults.

| Requirement | Declared default |
| --- | --- |
| [`kickside.sso:credential_eligibility`](src/_index.yaml) | Empty string |
| [`kickside.sso:target_db`](src/_index.yaml) | Host supplies the value |
| [`kickside.sso:public_api_router`](src/_index.yaml) | Host supplies the value |
| [`kickside.sso:api_router`](src/_index.yaml) | Host supplies the value |
| [`kickside.sso:ui_server`](src/_index.yaml) | Host supplies the value |
