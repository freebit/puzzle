import State from '@/State'

export const loadImage = (url: string) => {
  const image = new Image();
  const promise = new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject(Error(`Loading error - ${image.src}`));
  })
  image.src = url;
  return promise;
}


export const drawTiles = (container: HTMLElement) => {
  const documentFragment = document.createDocumentFragment();

  for(let i = 0; i < State.Tiles.length; i++) {
    const tileData = State.Tiles[i];
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.setAttribute('idx', `${tileData.idx}`);
    ({ size: tile.style.width,
        size: tile.style.height,
        top: tile.style.top,
        left: tile.style.left
    } = tileData);
    tile.style.backgroundPosition = tileData.bgPosition;

    documentFragment.appendChild(tile);
  }

  container.innerHTML = '';
  container.append(documentFragment);
}


export const drawShuffleTiles = (container: HTMLElement) => {

  const childTiles = Array.from(container.childNodes);
  for(let i = 0; i < childTiles.length; i++) {
    const childTile = childTiles[i] as HTMLElement;
    childTile.setAttribute('idx', `${State.Tiles[i].idx}`);
    childTile.style.left = State.Tiles[i].left;
    childTile.style.top = State.Tiles[i].top;

    State.updateTileBgPosition(i, childTile.style.backgroundPosition);
  }

}


export const tileClickHandler = (tile: HTMLElement) => {
  const tileIdx = Number(tile.getAttribute('idx'));

  const onTransitionEnd = () => {
    tile.classList.remove('to-step');
    tile.classList.remove('shake');
    tile.removeEventListener('transitionend', onTransitionEnd);
  }

  // если можно двигать
  if(State.canMovieTile(tileIdx)) {
    tile.addEventListener('transitionend', (evt) => onTransitionEnd());
    tile.classList.add('to-step');

    // кэшируем
    const newEmptyTile: Puzzle.TileData = {
      idx: tileIdx,
      left: tile.style.left,
      top: tile.style.top,
      bgPosition: tile.style.backgroundPosition
    };

    // меняем позицию
    tile.style.left = State.EmptyTile.left;
    tile.style.top = State.EmptyTile.top;
    tile.setAttribute('idx', `${State.EmptyTile.idx}`);

    State.pushHistoryState({ from: newEmptyTile, toIdx: State.EmptyTile.idx });
    State.updateAfterMove(newEmptyTile);
  }
  // если нельзя двигать
  else {
    tile.addEventListener('animationend', () => onTransitionEnd());
    tile.classList.add('shake');
  }

}

export const moveTile = () => {
  const tileStep = State.CurrentTileStep;
  if (!tileStep) return;

  const { data: tileStepData } = tileStep


  const tileIdx = tileStepData.toIdx;
  const tile: HTMLElement = document.querySelector(`[idx="${tileIdx}"]`);

  const onTransitionEnd = () => {
    tile.classList.remove('to-step');
    tile.removeEventListener('transitionend', onTransitionEnd);
  }
  if (tile) {
    tile.addEventListener('transitionend', (evt) => onTransitionEnd());
    tile.classList.add('to-step');
    // кэшируем
    const newEmptyTile: Puzzle.TileData = {
      idx: tileIdx,
      left: tile.style.left,
      top: tile.style.top,
      bgPosition: tile.style.backgroundPosition
    };
    // меняем позицию
    tile.style.left = tileStepData.from.left;
    tile.style.top = tileStepData.from.top;
    tile.setAttribute('idx', `${tileStepData.from.idx}`);
    State.updateAfterMove(newEmptyTile);
  }
}

export const popstateHandler = function (state: Puzzle.HistoryStateItem) {
  if(!state || state === null || typeof state !== 'object') {
    throw Error('popstate handler - Not event data');
    return;
  }

  if(state.type && state.type === Puzzle.StateType.Common) {
    State.checkHash();
  }

  if (Array.isArray(state)) {
    moveTile();

  }
  State.popHistoryState();
}


export const startGame = function (control: HTMLInputElement, container: HTMLElement) {
  /* Указываем background-size для контейнера,
    а значит для всех плиток (нужно для правильной отрисовки картинки в плитке)
  */
  location.hash = '';
  container.style.setProperty('--bg-size', `${100 * State.MatrixSize}%`);
  control.disabled = true;

  drawTiles(container);

  setTimeout(() => {
    State.shuffleTiles();
    drawShuffleTiles(container);
    State.saveToHash(true);
    control.disabled = false;
  }, 1000)
}

export const continueGame = function(control: HTMLInputElement, container: HTMLElement) {
  control.value = State.MatrixSize.toString();
  container.style.setProperty('--bg-size', `${100 * State.MatrixSize}%`);
  drawTiles(container);
  State.saveToHash(true);
}

