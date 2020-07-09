import '@/styles/main.scss'

import { loadImage, createState, drawTiles, shuffleTiles, calcActiveTilesPositions } from './utils'

const startGame = function (matrixSize: number, puzzleElem: HTMLElement) {
  /* Указываем background-size для контейнера,
    а значит для всех плиток (нужно для правильной отрисовки картинки в плитке)
  */
  puzzleElem.style.setProperty('--bg-size', `${100 * matrixSize}%`);
  const puzzleWidth = puzzleElem.offsetWidth;

  const state: Puzzle.State = createState(matrixSize, puzzleWidth)
  drawTiles(state, puzzleElem)
  // console.log('state before -', state.tiles)
  setTimeout(() => {
    shuffleTiles(state, puzzleElem)
    calcActiveTilesPositions(state)
    console.log('state after -', state)
  }, 1000)
}

const init = function (params: Puzzle.AppParams): void {

  const control: HTMLInputElement = document.querySelector('#control');
  const puzzleWrapper: HTMLElement = params.elem;

  // Указываем backgraund-image для контейнера, откуда его получит каждая плитка
  puzzleWrapper.style.setProperty('--bg-img', `url(${params.picture})`);
  // выставляем ползунок
  control.value = params.startMatrixSize.toString()

  control.addEventListener('change', () => {
    const matrixSize = Number(control.value);
    startGame(matrixSize, puzzleWrapper)
  })

  startGame(params.startMatrixSize, puzzleWrapper)
}


loadImage('https://cs.pikabu.ru/images/jobseeker/logo2.png')
  .then((image: HTMLImageElement) => {
    init({
      elem: document.getElementById('puzzle-wrapper'),
      picture: 'https://cs.pikabu.ru/images/jobseeker/logo2.png',
      startMatrixSize: 5
    })
  })
  .catch((err) => {
    console.log('image loaded fail -', err)
  })