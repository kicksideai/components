// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
export async function loadByTagName(tag:string){if(!customElements.get(tag))throw new Error(`Preview widget is missing: ${tag}`)}
