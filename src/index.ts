export default class LazyFragmentElement extends HTMLElement {
  static get observedAttributes() {
    return [
      'src',
      'disabled'
    ]
  }

  #mountedInDOM = false
  #loading = false
  #completed = false
  #intersectionObserver = new IntersectionObserver((entries) => {
    const entry = entries.slice(-1)[0]
    if (entry?.isIntersecting) {
      this.#loadFragment()
      this.#intersectionObserver.disconnect()
    }
  }, {
    rootMargin: '0px 0px 100px 0px',
    threshold: 0.01,
  })

  connectedCallback(): void {
    this.#mountedInDOM = true
    if (!this.hasAttribute('disabled')){
      this.#intersectionObserver.observe(this)
    }
  }

  disconnectedCallback(): void {
    this.#mountedInDOM = false
    this.#intersectionObserver.disconnect()
  }

  attributeChangedCallback(attrName: string, oldValue: unknown, newValue: unknown): void {
    if (attrName === 'src' && newValue !== oldValue) {
      this.#loadFragment()
    }
    else if (attrName === 'disabled' && newValue === null) {
      this.#loadFragment()
    }
  }

  async #loadFragment() {
    const src = this.getAttribute('src')
    const isDisabled = this.hasAttribute('disabled')
    if (!src || isDisabled || !this.#mountedInDOM) return;

    if (this.#loading || this.#completed) return;
    this.#loading = true
    this.#completed = false

    try {
      const content = await this.#fetchHTML(src)

      this.#completed = true
      this.#replaceTag(content)
    }
    catch (error: unknown) {
      this.setAttribute('error', '')
      throw error
    }
    finally {
      this.#loading = false
    }
  }

  async #fetchHTML(url: string) {
    const headers: HeadersInit  = {}
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    if (csrfToken) {
      headers['X-CSRF-TOKEN'] = csrfToken
    }
    const response = await fetch(url, {
      headers
    })
    if (!response.ok) {
      throw new Error(`Failed to load resource of ${this.outerHTML}: The server responded with a status of ${response.status}`)
    }
    return await response.text()
  }

  #replaceTag(html: string): void {
    if (!this.#mountedInDOM) return;

    const template = document.createElement('template')
    template.innerHTML = html
    const fragment = template.content.cloneNode(true)
    this.replaceWith(fragment)
  }
}

if (!window.customElements.get('lazy-fragment')) {
  window.LazyFragmentElement = LazyFragmentElement
  window.customElements.define('lazy-fragment', LazyFragmentElement)
}

declare global {
  interface Window {
    LazyFragmentElement: typeof LazyFragmentElement
  }
  interface HTMLElementTagNameMap {
    'lazy-fragment': LazyFragmentElement
  }
}
