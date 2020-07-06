import '@/styles/main.scss'

import { drawTiles } from './utils'

const init = (params: Puzzle.AppParams): void => {
  const control: HTMLInputElement = document.querySelector('#control');

  control.value = params.startMatrixSize.toString()
  control.addEventListener('change', (evt) => {
    drawTiles(Number(control.value))
  })
}



init({
  picture: 'https://cs.pikabu.ru/images/jobseeker/logo2.png',
  startMatrixSize: 5
})
