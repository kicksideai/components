// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
class CompliancePanel extends HTMLElement {
  connectedCallback() {
    this.textContent = this.hasAttribute('catalog-id') ? 'Supplier certificates' : 'Select a catalog to see supplier certificates.'
  }
}

class CertificateEditor extends HTMLElement {
  connectedCallback() {
    const input = document.createElement('input')
    input.setAttribute('aria-label', 'Supplier certificate')
    input.placeholder = 'EU-123'
    input.value = this.getAttribute('value') ?? ''
    input.addEventListener('change', () => {
      this.dispatchEvent(new CustomEvent('change', { detail: { value: input.value.trim().toUpperCase() }, bubbles: true }))
    })
    this.replaceChildren(input)
  }
}

class SupplierLookup extends HTMLElement {
  connectedCallback() {
    this.textContent = this.getAttribute('value') === 'northwind' ? 'Northwind Supplies' : 'Supplier unavailable'
  }
}

class CertificateRegion extends HTMLElement {
  connectedCallback() {
    const certificate = this.getAttribute('value') ?? ''
    this.textContent = certificate.match(/^[A-Z]{2}(?=-)/)?.[0] ?? 'No certificate'
  }
}

class CertificateAudit extends HTMLElement {
  connectedCallback() {
    const button = document.createElement('button')
    button.textContent = 'Audit certificates'
    button.addEventListener('click', () => this.dispatchEvent(new CustomEvent('audit-certificates', { bubbles: true })))
    this.replaceChildren(button)
  }
}

customElements.define('pim-test-compliance', CompliancePanel)
customElements.define('pim-test-compliance-certificate', CertificateEditor)
customElements.define('pim-test-compliance-supplier', SupplierLookup)
customElements.define('pim-test-compliance-region', CertificateRegion)
customElements.define('pim-test-compliance-audit', CertificateAudit)
