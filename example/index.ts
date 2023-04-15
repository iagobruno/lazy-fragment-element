import '../src/index.js'

document.getElementById('add-tag')?.addEventListener('click', () => {
  const tag = document.createElement('lazy-fragment')
  tag.innerText = 'Loading...'
  tag.setAttribute('src', '/lazy-part.html')
  document.getElementById('append-tag')!.append(tag)
})

document.getElementById('show-tag')?.addEventListener('click', () => {
  document.getElementById('hidden-tag')!.style.display = ''
})

document.getElementById('change-tag-src')?.addEventListener('click', () => {
  document.getElementById('dynamic-src')!.setAttribute('src', '/other-lazy-part.html')
})

document.getElementById('enable-tag')?.addEventListener('click', () => {
  document.getElementById('disabled-tag')!.removeAttribute('disabled')
})
