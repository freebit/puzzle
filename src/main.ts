import '@/styles/main.scss'

import { drawTiles, loadImage, resizeImage } from './utils'

const init = (params: Puzzle.AppParams): void => {

  const control: HTMLInputElement = document.querySelector('#control');

  control.value = params.startMatrixSize.toString()

  control.addEventListener('change', (evt) => {
    drawTiles(Number(control.value), params.picture)
  })


  drawTiles(params.startMatrixSize, params.picture)
}




loadImage('https://cs.pikabu.ru/images/jobseeker/logo2.png')
  .then((image: HTMLImageElement) => {
    init({
      elem: '#puzzle-wrapper',
      picture: {
        src: image.src,
        width: image.width,
        height: image.height
      },
      startMatrixSize: 5
    })
  })
  .catch((err) => {
    console.log('image loaded fail -', err)
  })