// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

// Template HTML reaches nothing outside the frame: no requests, no scripts, only inline styles and inline images.
export const previewPolicy = "default-src 'none'; img-src data:; style-src 'unsafe-inline'"

// The trusted start of every preview document. It precedes all template bytes, so the parser applies the policy before
// any template element exists. Links open a new browsing context, which the frame's empty sandbox refuses, so a click
// never navigates the frame; the sandbox also refuses scripts, forms and meta refresh.
const prefix = `<!doctype html><meta http-equiv="Content-Security-Policy" content="${previewPolicy}"><base target="_blank">`

// The preview shows inline images from the data URIs the server returns for each content ID.
export function emailDocument(html: string, inline: Record<string, string> | undefined): string {
  let document = html
  for (const [contentId, dataUri] of Object.entries(inline ?? {})) {
    document = document.split('cid:' + contentId).join(dataUri)
  }
  return prefix + document
}
