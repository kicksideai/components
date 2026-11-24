<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Work Time specification

## Over-estimate events

`time.over_estimate` signals changes to over-estimate state observed by the
projection on boards with board-wide item visibility, so a crossing that
reverts between observations may emit no event and automations can query the
over-estimate filter for the current state.
