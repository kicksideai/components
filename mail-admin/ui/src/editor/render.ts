// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

// The preview shows inline images from the data URIs the server returns for each content ID.
// The document is shown in a sandboxed frame, so it runs no script and reaches nothing of the page.
export function emailDocument(html: string, inline: Record<string, string> | undefined): string {
  let document = html
  for (const [contentId, dataUri] of Object.entries(inline ?? {})) {
    document = document.split('cid:' + contentId).join(dataUri)
  }
  return document
}
