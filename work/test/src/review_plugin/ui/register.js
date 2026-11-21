// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
class ChangeRegister extends HTMLElement {
    set items(value) {
        const list = document.createElement('ul')
        list.setAttribute('aria-label', 'Operational changes')
        for (const item of value ?? []) {
            const row = document.createElement('li')
            row.textContent = `${item.values.title} · Risk ${item.values.risk}`
            list.append(row)
        }
        this.replaceChildren(list)
    }
}

if (!customElements.get('work-test-change-register')) {
    customElements.define('work-test-change-register', ChangeRegister)
}
