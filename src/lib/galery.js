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

    this.galleriewrapper = document.querySelector(galleriewrapper)
    this.container = this.galleriewrapper.querySelector('.glide_showcase')
    this.initCarousel(galleriewrapper)
  }

  /**
   * @param {string} galleriewrapper
   */
  initCarousel (galleriewrapper) {

    this.carousel = new Glide(this.galleriewrapper, {
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
      console.log('here');
      
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

    this.setGalerieHeight()

    const loader = document.createElement('div')
    loader.classList.add('glide__loader')
    this.container.innerHTML = ''
    this.container.appendChild(loader)
    console.log(this);
    
    image.onload = () => {
      console.log(this);
      this.container.removeChild(loader)
      this.container.appendChild(image)
      this.setGalerieHeight()
      //this.resetGalerieHeight()
      this.url = url
    }
    image.src = url
  }

  setEvents () {
    if (this.debugMode) {
      console.log('set Events')
    }
    this.images = this.items.map(item => item.querySelector('img'))

    const el = document.querySelector('.glide__track');
  
    el.addEventListener('click', e => {
      this.clickHandler(e)
    })

    // this.images.forEach(item => item.addEventListener('click', e => {
    //   this.click(e)
    // }))
    window.onresize = () => {
      this.setGalerieHeight()
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
    if (this.container.querySelector('img')) {

      this.current = this.container.querySelector('img')
      console.log('set  galerie height', this.container );
      
      this.container.style.height = this.current.offsetHeight + 'px'
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
    // identifier limage large 
    // charger limage
    // la mettre dans le conteneur
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
