export function installMagicNavigation() {
  let navigating = false
  let navigationTimer: number | undefined

  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const target = event.target as Element | null
    const anchor = target?.closest<HTMLAnchorElement>('a[href]')
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return

    const destination = new URL(anchor.href, window.location.href)
    if (destination.origin !== window.location.origin) return
    if (destination.pathname === window.location.pathname && destination.search === window.location.search) return
    if (navigating) { event.preventDefault(); return }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    event.preventDefault()
    navigating = true

    const originX = event.clientX || window.innerWidth / 2
    const originY = event.clientY || window.innerHeight / 2
    const portal = document.createElement('div')
    portal.className = 'page-magic-transition'
    portal.setAttribute('aria-hidden', 'true')
    portal.style.setProperty('--magic-origin-x', `${originX}px`)
    portal.style.setProperty('--magic-origin-y', `${originY}px`)

    for (let index = 0; index < 26; index += 1) {
      const angle = (Math.PI * 2 * index) / 26 + (Math.random() - .5) * .25
      const distance = 85 + Math.random() * 235
      const sparkle = document.createElement('i')
      sparkle.className = index % 4 === 0 ? 'magic-transition-spark star' : 'magic-transition-spark'
      sparkle.style.setProperty('--spark-x', `${Math.cos(angle) * distance}px`)
      sparkle.style.setProperty('--spark-y', `${Math.sin(angle) * distance}px`)
      sparkle.style.setProperty('--spark-delay', `${Math.random() * 90}ms`)
      sparkle.style.setProperty('--spark-duration', `${430 + Math.random() * 240}ms`)
      sparkle.style.setProperty('--spark-size', `${3 + Math.random() * 6}px`)
      portal.appendChild(sparkle)
    }

    document.body.appendChild(portal)
    document.body.classList.add('magic-navigation-active')
    navigationTimer = window.setTimeout(() => window.location.assign(destination.href), 640)
  }

  document.addEventListener('click', onClick)
  return () => {
    document.removeEventListener('click', onClick)
    if (navigationTimer) window.clearTimeout(navigationTimer)
    document.querySelector('.page-magic-transition')?.remove()
    document.body.classList.remove('magic-navigation-active')
  }
}
