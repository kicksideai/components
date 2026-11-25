<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# KickSide Mail

Mail sends email from an installation-managed address through an installed delivery driver. It supplies a mailer contract, agent tools, a virtual Workflow Block, and an automation destination.

[Module documentation](src/README.md) covers setup, contracts, driver admission, library events, and local verification.


Library edits append to the component thread. History follows the 365-day event
retention window. The library sync job publishes Jet sets from committed
projection state on one node. Renders return retryable `mail_library_publishing`
until the live marker reaches the projection’s template sequence.


Library summary pages order resources by kind and name in ascending byte order.
The cursor remains the last resource key. The accompanying total counts all
matching resources, including packaged originals. Library source search does
literal substring matching over the fields of the selected resource kinds.

Activity totals up to 10,000 reflect the selected filters. Larger totals return
10,000 with `total_is_lower_bound`. Subject and recipient search considers the
newest 10,000 messages matching the other filters. Its totals include the same
flag whenever the search reaches that window. Unsearched activity continues to
page through all retained messages. Today's failed count uses the failure
timestamp index and remains exact.
