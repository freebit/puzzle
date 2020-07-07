import '@/styles/main.scss'

import { drawTiles } from './utils'

const init = (params: Puzzle.AppParams): void => {

  const control: HTMLInputElement = document.querySelector('#control');

  control.value = params.startMatrixSize.toString()

  control.addEventListener('change', (evt) => {
    drawTiles(Number(control.value), params.picture)
  })


  drawTiles(params.startMatrixSize, params.picture)
}



init({
  elem: '#puzzle-wrapper',
  picture: 'https://cs.pikabu.ru/images/jobseeker/logo2.png',
  startMatrixSize: 5
})



const mainImage = new Image()
mainImage.onload = function(img) {
  console.log('image - ', this)
}
mainImage.src = 'https://cs.pikabu.ru/images/jobseeker/logo2.png'
