// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { describe, expect, it } from 'vitest'
import { emailDocument, previewPolicy } from './render'

const tag = `<meta http-equiv="Content-Security-Policy" content="${previewPolicy}">`

describe('Preview documents', () => {
  it('refuse every outside request, allowing only inline styles and inline images', () => {
    expect(previewPolicy).toBe("default-src 'none'; img-src data:; style-src 'unsafe-inline'")
  })

  it('carry the policy first in the head, whatever shape the template HTML has', () => {
    expect(emailDocument('<!doctype html><html lang="en"><head><title>x</title></head><body></body></html>', {}))
      .toBe(`<!doctype html><html lang="en"><head>${tag}<title>x</title></head><body></body></html>`)
    expect(emailDocument('<html><body><p>x</p></body></html>', {})).toBe(`<html><head>${tag}</head><body><p>x</p></body></html>`)
    expect(emailDocument('<p>fragment</p>', {})).toBe(`${tag}<p>fragment</p>`)
  })

  it('shows inline images from the data the server returns for each content ID', () => {
    expect(emailDocument('<img src="cid:logo">', { logo: 'data:image/png;base64,AAAA' })).toBe(`${tag}<img src="data:image/png;base64,AAAA">`)
  })
})
