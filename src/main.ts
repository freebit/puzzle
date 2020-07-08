import '@/styles/main.scss'

import { createPuzzleState, drawTiles, loadImage } from './utils'

const init = (params: Puzzle.AppParams): void => {

  const control: HTMLInputElement = document.querySelector('#control');
  const puzzleWrapper: HTMLElement = params.elem;
  const { width: puzzleWidth } = puzzleWrapper.getBoundingClientRect();

  // Указываем backgraund-image для контейнера, откуда его получит каждая плитка
  puzzleWrapper.style.setProperty('--bg-img', `url(${params.picture.src})`);

  control.value = params.startMatrixSize.toString()

  control.addEventListener('change', (evt) => {
    const matrixSize = Number(control.value);

    // Указываем background-size для контейнера, а значит для всех плиток
    puzzleWrapper.style.setProperty('--bg-size', `${100 * matrixSize}%`);
    const state: Puzzle.State = createPuzzleState(matrixSize, puzzleWidth);
    drawTiles(state, puzzleWrapper)
    console.log('state -', state)
  })


  puzzleWrapper.style.setProperty('--bg-size', `${100 * params.startMatrixSize}%`);
  const state: Puzzle.State = createPuzzleState(params.startMatrixSize, puzzleWidth)
  drawTiles(state, puzzleWrapper)
  console.log('state -', state)
}


loadImage('https://cs.pikabu.ru/images/jobseeker/logo2.png')
  .then((image: HTMLImageElement) => {
    init({
      elem: document.getElementById('puzzle-wrapper'),
      picture: {
        src: 'https://cs.pikabu.ru/images/jobseeker/logo2.png',
        width: 0,
        height: 0
      },
      startMatrixSize: 5
    })
  })
  .catch((err) => {
    console.log('image loaded fail -', err)
  })