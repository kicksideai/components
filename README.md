<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kicksideai/docs/main/getting-started/assets/brand/kickside-logo-dark.png">
  <img src="https://raw.githubusercontent.com/kicksideai/docs/main/getting-started/assets/brand/kickside-logo-light.png" alt="KickSide" width="320">
</picture>

# KickSide components

Four independently installable modules for the KickSide application:

| Directory | Package | Behavior |
| --- | --- | --- |
| [dashboard](dashboard) | `kickside/dashboard` | Lists the installed application surfaces and their navigation links. |
| [research](research) | `kickside/research` | Runs agent research tasks and presents their progress and results. |
| [agent-onboarding](agent-onboarding) | `kickside/agent-onboarding` | Creates a user's first agent and selects its capabilities. |
| [sso](sso) | `kickside/sso` | Provides OAuth2/OIDC sign-in, account linking, and provisioning. |

Install a package through **System → Modules** in KickSide. The [module installation guide](https://github.com/kicksideai/docs/blob/main/getting-started/first-module.md) explains requirements and bindings.

![KickSide components with fictional demonstration data: the dashboard, a research report, and first-agent onboarding](https://raw.githubusercontent.com/kicksideai/docs/main/assets/readme/components-overview.webp)

License: [KickSide Community License 1.0](LICENSE.md) · [Third-party notices](THIRD_PARTY_NOTICES.md).

[Documentation](https://github.com/kicksideai/docs) · [KickSide](https://kickside.ai)
