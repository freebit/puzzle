import '@/styles/main.scss'

import State from '@/State'
import {
  loadImage,
  startGame, continueGame,
  tileClickHandler, putTileBack } from './utils';

const init = function (params: Puzzle.AppParams): void {

  const control = params.control;
  const container = params.container;
  const containerWidth = container.offsetWidth;

  control.min = params.minMatrixSize.toString();
  control.max = params.maxMatrixSize.toString();
  control.removeAttribute('hidden');

  // Указываем backgraund-image для контейнера, откуда его получит каждая плитка
  container.style.setProperty('--bg-img', `url(${params.picture})`);
  container.removeAttribute('hidden');

  if(State.checkHash()) {

    continueGame(control, container);

  } else {
    // выставляем значение контрола
    control.value = params.startMatrixSize.toString();
    State.initialize(params.startMatrixSize, containerWidth);
    startGame(control, container);
  }

  // меняем размер матрицы
  control.addEventListener('change', () => {
    const matrixSize = Number(control.value);
    State.initialize(matrixSize, container.offsetWidth);
    startGame(control, container);
  })

  // клик по плитке
  container.addEventListener('click', (evt) => {
    const tile = evt.target as HTMLElement;
    if(tile.classList.contains('tile')) {
      tileClickHandler(tile);
    }
  })

  // ходим по истории
  window.addEventListener('popstate', function(evt) {
    Array.isArray(evt.state) && putTileBack();
  });

}

// На всякий случай дождемся загрузки картинки
loadImage('https://cs.pikabu.ru/images/jobseeker/logo2.png')
  .then((image: HTMLImageElement) => {
    init({
      container: document.getElementById('puzzle-wrapper'),
      control: document.querySelector('#control'),
      picture: image.src,
      minMatrixSize: 5,
      maxMatrixSize: 10,
      startMatrixSize: 5
    })
  })
  .catch((err) => {
    console.log(err)
  })