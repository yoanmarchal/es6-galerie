import Glide, { Controls, Breakpoints, Anchors, Swipe, Images } from '@glidejs/glide/dist/glide.modular.esm.js'

export default class Galerie {

  /**
   * @param {object} galeriewrapper
   */
  constructor (galeriewrapper, { debug = false } = {}) {
    this.debugMode = debug
    
    this.current = 0
    this.galeriewrapper = galeriewrapper
    this.showcase = this.galeriewrapper.querySelector('.glide_showcase')
    this.items = Array.from(this.galeriewrapper.querySelectorAll('.glide__slide'))
    this.initCarousel(galeriewrapper)
  }

  /**
   * @param {object} galeriewrapper
   */
  initCarousel (galeriewrapper) {

    this.carousel = new Glide(this.galeriewrapper, {
      type: 'carousel',
      startAt: 0,
      perView: 9,
      peek: {
        before: 100,
        after: 100
      },
      breakpoints: {
        1024: {
          perView: 10
        },
        600: {
          perView: 5
        }
      },
      gap: 1
    })

    this.carousel.on(['mount.after', 'run'], () => {
      // Logic fired after mounting
      if (this.debugMode) {
        console.log('mount.after run', this.carousel.index)
      }
      
      this.setEvents()
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
    const container = this.galeriewrapper.querySelector('.glide_showcase')

    this.setGalerieHeight()

    const loader = document.createElement('div')
    loader.classList.add('glide__loader')
    container.innerHTML = ''
    container.appendChild(loader)
    
    image.onload = () => {

      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      container.appendChild(image)
      this.setGalerieHeight()
      this.url = url
    }
    image.src = url
  }

  setEvents () {
    if (this.debugMode) {
      console.log('set Events')
    }
    this.images = this.items.map(item => item.querySelector('img'))

    this.galeriewrapper.querySelector('.glide__track').addEventListener('click', e => {
      this.clickHandler(e)
    })

    window.onresize = (e) => {
      clearTimeout(this.timeout);
      // start timing for event "completion"
      this.timeout = setTimeout(this.setGalerieHeight(), 250);
    };
  }

  clickHandler(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.matches('img')) {
      this.setFeatured(e.target)
    }
  }

  setGalerieHeight () {
    
    // set the container to the height of img to prevent move of container
    if (this.showcase.querySelector('img')) {

      this.current = this.showcase.querySelector('img')
      console.log('set  galerie height', this.showcase );
      
      this.showcase.style.height = this.current.offsetHeight + 'px'
    }
  }

  resetGalerieHeight () {
    this.container.style.height = 'auto'
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
