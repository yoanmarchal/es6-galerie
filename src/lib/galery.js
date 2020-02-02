import Glide, { Controls, Breakpoints, Anchors, Swipe, Images } from '@glidejs/glide/dist/glide.modular.esm.js'

/**
 * @class Gallerie
 * @param {string} galleriewrapper
 */

export class Galerie {
  constructor (galleriewrapper, { debug = false } = {}) {
    this.debugMode = debug
    this.items = Array.from(document.querySelectorAll('.glide__slide'))
    this.current = 0
    this.images = this.items.map(item => item.querySelector('img'))

    this.images.forEach(item => item.addEventListener('click', e => {
      this.click(e)
    }))

    this.galleriewrapper = document.querySelector(galleriewrapper)
    this.initCarousel(galleriewrapper)
  }

  /**
   * @param {string} galleriewrapper
   */
  initCarousel (galleriewrapper) {
    this.carousel = new Glide(this.galleriewrapper, {
      type: 'carousel',
      startAt: 0,
      perView: 13,
      peek: {
        before: 100,
        after: 100
      },
      breakpoints: {
        1024: {
          perView: 11
        },
        600: {
          perView: 5
        }
      },
      gap: 10
    })

    this.carousel.on(['mount.after', 'run'], () => {
      // Logic fired after mounting
      if (this.debugMode) {
        console.log('mount.after run', this.carousel.index)
        console.log('click', this.images[this.carousel.index])
      }
    })

    this.carousel.on('update', function (e) {
      // Logic fired after mounting
      if (this.debugMode) {
        console.log('update', e)
      }
    })

    this.loadImage(this.items[0].querySelector('img').dataset.large)
    this.carousel.mount({ Controls, Breakpoints, Anchors, Swipe, Images })

    if (this.debugMode) {
      console.log('init: ', this.carousel)
    }
  }

  /**
 * @param {string} url URL de l'image
 */
  loadImage (url) {
    if (this.debugMode) {
      console.log('load', url)
    }
    this.url = null
    const image = new Image()
    const container = this.galleriewrapper.querySelector('.glide_showcase')
    // set the container to the height of img to prevent move of container
    if (container.querySelector('img')) {
      container.style.height = container.offsetHeight + 'px'
    }

    const loader = document.createElement('div')
    loader.classList.add('glide__loader')
    container.innerHTML = ''
    container.appendChild(loader)
    image.onload = () => {
      container.removeChild(loader)
      container.appendChild(image)
      this.url = url
    }
    image.src = url
  }

  /**
   * @param {Object} target
   */
  setFeatured (target) {
    if (this.debugMode) {
      console.log('setFeatured(target)', target)
      console.log(target.dataset.large)
    }

    this.loadImage(target.dataset.large)
    // identifier limage large
    // charger limage
    // la mettre dans le conteneur
  }

  /**
   * @param  {Object} event
   */
  click (e) {
    e.stopPropagation()
    e.preventDefault()

    if (this.debugMode) {
      console.log('item click event: ', e)
      console.log('item click event.target: ', e.target)
    }
    this.setFeatured(e.target)
  }

  /**
 * @param {string} url URL de l'image
 * @return {HTMLElement}
 */
  buildDOM (url) {
    const dom = document.createElement('div')
    dom.classList.add('lightbox')
    dom.innerHTML = `<button class="lightbox__close">Fermer</button>
        <button class="lightbox__next">Suivant</button>
        <button class="lightbox__prev">Précédent</button>
        <div class="lightbox__container"></div>`
    dom.querySelector('.lightbox__close').addEventListener('click', this.close.bind(this))
    dom.querySelector('.lightbox__next').addEventListener('click', this.next.bind(this))
    dom.querySelector('.lightbox__prev').addEventListener('click', this.prev.bind(this))
    return dom
  }
}
