// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { describe, expect, it } from 'vitest'
import { emailDocument, previewPolicy } from './render'

describe('Preview documents', () => {
  it('refuse every outside request, allowing only inline styles and inline images', () => {
    expect(previewPolicy).toBe("default-src 'none'; img-src data:; style-src 'unsafe-inline'")
  })

  it('start with the policy and the link target before any template content, whatever shape the template has', () => {
    for (const html of [
      '<!doctype html><html lang="en"><head><title>x</title></head><body></body></html>',
      '<html><link rel="stylesheet" href="https://tracker.example/a.css"><head></head><body><p>x</p></body></html>',
      '<!-- <head> --><img src="https://tracker.example/p.gif"><p>fragment</p>',
      '<p>fragment</p>',
    ]) {
      const document = emailDocument(html, {})
      expect(document.startsWith(`<!doctype html><meta http-equiv="Content-Security-Policy" content="${previewPolicy}"><base target="_blank">`)).toBe(true)
      expect(document.endsWith(html)).toBe(true)
    }
  })

  it('shows inline images from the data the server returns for each content ID', () => {
    const document = emailDocument('<img src="cid:logo">', { logo: 'data:image/png;base64,AAAA' })
    expect(document.endsWith('<img src="data:image/png;base64,AAAA">')).toBe(true)
  })
})
