// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

// Template HTML reaches nothing outside the frame: no requests, no scripts, only inline styles and inline images.
export const previewPolicy = "default-src 'none'; img-src data:; style-src 'unsafe-inline'"
const policyTag = `<meta http-equiv="Content-Security-Policy" content="${previewPolicy}">`

// The preview shows inline images from the data URIs the server returns for each content ID. The document is shown
// in a sandboxed frame under a policy that refuses every outside request.
export function emailDocument(html: string, inline: Record<string, string> | undefined): string {
  let document = html
  for (const [contentId, dataUri] of Object.entries(inline ?? {})) {
    document = document.split('cid:' + contentId).join(dataUri)
  }
  const head = /<head(\s[^>]*)?>/i.exec(document)
  if (head) return document.slice(0, head.index + head[0].length) + policyTag + document.slice(head.index + head[0].length)
  const root = /<html(\s[^>]*)?>/i.exec(document)
  if (root) return document.slice(0, root.index + root[0].length) + '<head>' + policyTag + '</head>' + document.slice(root.index + root[0].length)
  return policyTag + document
}
