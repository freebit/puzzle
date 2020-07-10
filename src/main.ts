import '@/styles/main.scss'

import State from '@/State'
import { loadImage, drawTiles, drawShuffleTiles, tileClickHandler } from './utils'

const startGame = function (control: HTMLInputElement,container: HTMLElement) {
  /* Указываем background-size для контейнера,
    а значит для всех плиток (нужно для правильной отрисовки картинки в плитке)
  */
  container.style.setProperty('--bg-size', `${100 * State.MatrixSize}%`);
  control.disabled = true
  drawTiles(container)
  setTimeout(() => {
    drawShuffleTiles(container)
    State.calcActiveTilePositions()
    control.disabled = false
  }, 1000)
}

const init = function (params: Puzzle.AppParams): void {

  const control: HTMLInputElement = document.querySelector('#control');
  const container: HTMLElement = params.container;

  // Указываем backgraund-image для контейнера, откуда его получит каждая плитка
  container.style.setProperty('--bg-img', `url(${params.picture})`);
  // выставляем ползунок
  control.value = params.startMatrixSize.toString()

  State.initialize(params.startMatrixSize, container.offsetWidth)
  startGame(control, container)

  // меняем размер матрицы
  control.addEventListener('change', () => {
    const matrixSize = Number(control.value);
    State.initialize(matrixSize, container.offsetWidth)
    startGame(control, container)
  })

  // клик по плитке
  container.addEventListener('click', (evt) => {
    const tile = evt.target as HTMLElement
    if(tile.classList.contains('tile')) {
      tileClickHandler(tile)
    }
  })

}


loadImage('https://cs.pikabu.ru/images/jobseeker/logo2.png')
  .then((image: HTMLImageElement) => {
    init({
      container: document.getElementById('puzzle-wrapper'),
      picture: 'https://cs.pikabu.ru/images/jobseeker/logo2.png',
      startMatrixSize: 5
    })
  })
  .catch((err) => {
    console.log('image loaded fail -', err)
  })