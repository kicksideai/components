-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
type Envelope = { [string]: unknown }
type Body = { [string]: unknown }
type BoardClient = { [string]: (BoardClient, Body) -> (unknown, error?) }
return { Envelope = Envelope, Body = Body, BoardClient = BoardClient }
