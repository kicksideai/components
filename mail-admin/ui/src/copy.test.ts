// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { describe as group, expect, it } from 'vitest'
import { ApiError } from './api'
import { deliveryFailure, describe, fixedOutsideMail, originText } from './copy'

const refusal = (code: string, message = 'developer text') => new ApiError({ error: message, kind: 'INVALID', details: { code } }, 'Send', 400)

group('Product copy', () => {
  it('words every admission and validation refusal Mail now returns, never the server’s developer text', () => {
    for (const code of ['invalid_config', 'from_name_invalid', 'invalid_request', 'invalid_mail_filter', 'invalid_mail_resource', 'mail_resource_too_large', 'invalid_revision_note',
      'invalid_mail_resources', 'invalid_mail_draft', 'invalid_mail_revision', 'invalid_template_vars', 'html_too_large', 'text_too_large',
      'invalid_subject', 'invalid_content_id', 'attachment_empty', 'incomplete_attachment', 'message_too_large', 'upload_still_processing']) {
      const text = describe(refusal(code), 'Fallback.')
      expect(text, code).not.toBe('developer text')
      expect(text, code).not.toMatch(/driver|provider|byte/i)
    }
    expect(describe(refusal('mail_resource_too_large'), 'Fallback.')).toContain('512 KiB')
  })

  it('gives a delivery administrator what the service said and what to change for each driver refusal', () => {
    expect(deliveryFailure('credentials_invalid', 'Mailgun')).toEqual({ lead: 'Mailgun refused the credentials.', next: 'Check the API key in Settings → Mail, save, and send again.' })
    expect(deliveryFailure('authorization_refused', 'SendGrid')?.lead).toBe('SendGrid refused to send for this account.')
    expect(deliveryFailure('sender_or_recipient_not_allowed', 'Resend')?.next).toContain('Verify the From address’s domain with Resend')
    expect(deliveryFailure('request_rejected', 'Resend')?.lead).toBe('Resend rejected the request.')
    expect(deliveryFailure('quota_exhausted', 'Resend')?.lead).toBe('Resend reports the sending quota is used up.')
    expect(deliveryFailure('message_rejected', 'Mailgun')?.lead).toBe('Mailgun rejected the message itself.')
    expect(deliveryFailure('provider_unavailable', 'Mailgun')).toBeUndefined()
  })

  it('offers no Send again where only the settings or the service account can fix the failure', () => {
    for (const code of ['invalid_config', 'credentials_invalid', 'authorization_refused', 'sender_or_recipient_not_allowed', 'from_name_invalid']) expect(fixedOutsideMail.has(code), code).toBe(true)
    for (const code of ['provider_unavailable', 'rate_limited', 'quota_exhausted', 'message_rejected', 'provider_rejected', 'delivery_failed']) expect(fixedOutsideMail.has(code), code).toBe(false)
  })

  it('names every origin Mail records, and a workflow whose title could not be read by its kind', () => {
    expect(originText({ kind: 'workflow', id: 'run-1', label: '' })).toBe('Workflow')
    expect(originText({ kind: 'resend', id: 'u', label: 'Resent message' })).toBe('Sent again')
  })
})
