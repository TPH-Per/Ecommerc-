import { useCartStore } from '@/stores/cart.store'
import { gsap } from 'gsap'

export function useCart() {
  const store = useCartStore()

  function animateToCart(productImgEl: HTMLElement, callback?: () => void) {
    const cartIcon = document.querySelector('#header-cart-btn')
    if (!cartIcon || !productImgEl) {
      if (callback) callback()
      return
    }

    const imgClone = productImgEl.cloneNode(true) as HTMLElement
    document.body.appendChild(imgClone)

    const from = productImgEl.getBoundingClientRect()
    const to = cartIcon.getBoundingClientRect()

    gsap.set(imgClone, { 
      position: 'fixed', 
      left: from.left, 
      top: from.top,
      width: from.width, 
      height: from.height, 
      borderRadius: '8px', 
      zIndex: 9999,
      objectFit: 'cover'
    })

    gsap.to(imgClone, {
      left: to.left + to.width / 2 - 20, 
      top: to.top + to.height / 2 - 20, 
      width: 40, 
      height: 40,
      opacity: 0.2, 
      borderRadius: '50%', 
      duration: 0.7,
      ease: 'power3.in',
      onComplete: () => {
        document.body.removeChild(imgClone)
        gsap.fromTo(cartIcon, 
          { scale: 1.4 }, 
          { scale: 1, duration: 0.4, ease: 'elastic.out(1.2,0.5)' }
        )
        if (callback) callback()
      }
    })
  }

  return {
    store,
    animateToCart
  }
}
