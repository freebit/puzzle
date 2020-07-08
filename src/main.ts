import '@/styles/main.scss'

import { createPuzzleState, drawTiles, loadImage } from './utils'

const init = (params: Puzzle.AppParams): void => {

  const control: HTMLInputElement = document.querySelector('#control');
  const puzzleWrapper:HTMLElement = document.getElementById('puzzle-wrapper');

  // Указываем backgraund-image для контейнера, от куда его получит каждая плитка
  puzzleWrapper.style.setProperty('--bg-img', `url(${params.picture.src})`);

  control.value = params.startMatrixSize.toString()

  control.addEventListener('change', (evt) => {
    const state: Puzzle.State = createPuzzleState(Number(control.value))
    drawTiles(state, puzzleWrapper)
    console.log('state -', state)
  })


  const state: Puzzle.State = createPuzzleState(params.startMatrixSize)
  drawTiles(state, puzzleWrapper)
  console.log('state -', state)
}


loadImage('https://cs.pikabu.ru/images/jobseeker/logo2.png')
  .then((image: HTMLImageElement) => {
    init({
      elem: '#puzzle-wrapper',
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