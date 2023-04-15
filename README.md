# &lt;lazy-fragment&gt; element

Lazily load parts of a webpage as soon as they appear in the screen.

## Installation

### CDN

Include the following `<script>` tag in the `<head>` of your document:

``` html
<script src="https://unpkg.com/lazy-fragment-element"></script>
```

### NPM

You can also install using a package manager.

```
npm install lazy-fragment-element
// Or
yarn add lazy-fragment-element
```

And then import as a module:

```js
import 'lazy-fragment-element'
```

## Markup

```html
<lazy-fragment src="/lazy-part-from-server">Loading...</lazy-fragment>
```

## Browser support

Browsers without native [custom element support](https://caniuse.com/#feat=custom-elementsv1) require a [polyfill](https://github.com/webcomponents/custom-elements).

- Chrome
- Firefox
- Safari
- Microsoft Edge
