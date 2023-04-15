export default class LazyFragmentElement extends HTMLElement {
  static get observedAttributes() {
    return [
      'src',
      'disabled'
    ]
  }

  #mountedInTheDOM = false
  #loading = false
  #completed = false
  #intersectionObserver = new IntersectionObserver((entries) => {
    const entry = entries.slice(-1)[0]
    if (entry?.isIntersecting) {
      this.#loadFragment()
      this.#intersectionObserver.disconnect()
    }
  }, {
    rootMargin: '0px 0px 256px 0px',
    threshold: 0.01,
  })

  connectedCallback(): void {
    this.#mountedInTheDOM = true
    if (!this.hasAttribute('disabled')){
      this.#intersectionObserver.observe(this)
    }
  }

  disconnectedCallback(): void {
    this.#mountedInTheDOM = false
    this.#intersectionObserver.disconnect()
  }

  attributeChangedCallback(attrName: string, oldValue: unknown, newValue: unknown): void {
    if (!this.#mountedInTheDOM) return;
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
    if (!src || isDisabled) return;

    if (this.#loading || this.#completed) return;
    this.#loading = true
    this.#completed = false

    try {
      const content = await this.#fetchHTML(src)

      this.#completed = true
      this.#replaceTag(content)
    }
    catch (error: unknown) {
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
    return await fetch(url, {
      headers
    })
      .then(res => res.text())
  }

  #replaceTag(html: string): void {
    if (!this.#mountedInTheDOM) return;

    const template = document.createElement('template')
    template.innerHTML = html
    const fragment = document.importNode(template.content, true)
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
