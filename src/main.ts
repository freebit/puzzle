import '@/styles/main.scss'

import { loadImage, createState, drawTiles, shuffleTiles, calcActiveTilesPositions, tileClickHandler } from './utils'

const startGame = function (state: Puzzle.State, puzzleElem: HTMLElement) {
  /* Указываем background-size для контейнера,
    а значит для всех плиток (нужно для правильной отрисовки картинки в плитке)
  */
  puzzleElem.style.setProperty('--bg-size', `${100 * state.matrixSize}%`);
  const puzzleWidth = puzzleElem.offsetWidth;


  drawTiles(state, puzzleElem)
  // console.log('state before -', state.tiles)
  setTimeout(() => {
    shuffleTiles(state, puzzleElem)
    calcActiveTilesPositions(state)
    // console.log('state after -', state)
  }, 1000)
}

const init = function (params: Puzzle.AppParams): void {

  const control: HTMLInputElement = document.querySelector('#control');
  const puzzleWrapper: HTMLElement = params.elem;

  // Указываем backgraund-image для контейнера, откуда его получит каждая плитка
  puzzleWrapper.style.setProperty('--bg-img', `url(${params.picture})`);
  // выставляем ползунок
  control.value = params.startMatrixSize.toString()

  let state: Puzzle.State = createState(params.startMatrixSize, puzzleWrapper.offsetWidth)

  control.addEventListener('change', () => {
    const matrixSize = Number(control.value);
    state = createState(matrixSize, puzzleWrapper.offsetWidth)
    startGame(state, puzzleWrapper)
  })

  puzzleWrapper.addEventListener('click', (evt) => {
    const target = evt.target as HTMLElement
    if(target.classList.contains('tile')) {
      tileClickHandler(state, target)
    }
  })

  startGame(state, puzzleWrapper)
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