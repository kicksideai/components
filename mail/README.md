<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# KickSide Mail

Mail sends email from an installation-managed address through an installed delivery driver. It supplies a mailer contract, agent tools, a virtual Workflow Block, and an automation destination.

[Module documentation](src/README.md) covers setup, the delivery driver descriptor and settings panel contract, error codes, and development commands.


Mail publishes the live template sources on the writing node under the library
writer lock before it commits the revision. During publication, concurrent
readers can still read the prior committed revision while a render uses the new
sources. After commit, new reads and renders use the new revision. An overlay
publication failure rolls back the SQL revision. A SQL commit failure after
publication reconciles the writing node's live sources to the committed revision
before the edit returns. Requests already rendering can finish with the
sources they acquired. Propagation to other nodes is outside this guarantee.
