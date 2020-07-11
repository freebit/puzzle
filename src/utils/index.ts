import State from '@/State'

export const loadImage = (url: string) => {
  const image = new Image()
  const promise = new Promise((resolve, reject) => {
    image.onload = () => resolve(image)
    image.onerror = () => reject(Error('Image loading error'))
  })
  image.src = url
  return promise
}


export const drawTiles = (container: HTMLElement) => {
  const documentFragment = document.createDocumentFragment();

  for(let i = 0; i < State.Tiles.length; i++) {
    const tileData = State.Tiles[i];
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.setAttribute('idx', `${tileData.idx}`);
    tile.style.width = tileData.size;
    tile.style.height = tileData.size;
    tile.style.top = tileData.top;
    tile.style.left = tileData.left;
    tile.style.backgroundPosition = tileData.bgPosition;

    documentFragment.appendChild(tile);
  }

  container.innerHTML = '';
  container.append(documentFragment);
}


export const drawShuffleTiles = (container: HTMLElement) => {

  const childTiles = Array.from(container.childNodes);
  for(let i = 0; i < childTiles.length; i++) {
    const childTile = childTiles[i] as HTMLElement
    childTile.setAttribute('idx', `${State.Tiles[i].idx}`)
    childTile.style.left = State.Tiles[i].left;
    childTile.style.top = State.Tiles[i].top;

    State.updateTileBgPosition(i, childTile.style.backgroundPosition);
  }

}


export const tileClickHandler = (tile: HTMLElement) => {
  const tileIdx = Number(tile.getAttribute('idx'));

  const onTransitionEnd = () => {
    tile.classList.remove('to-step');
    tile.classList.remove('shake')
    tile.removeEventListener('transitionend', onTransitionEnd)
  }

  // если можно двигать
  if(State.ActiveTileIdx.includes(tileIdx)) {
    tile.addEventListener('transitionend', (evt) => onTransitionEnd())
    tile.classList.add('to-step')

    // кэшируем
    const newEmptyTile: Puzzle.TileData = {
      idx: tileIdx,
      left: tile.style.left,
      top: tile.style.top,
      bgPosition: tile.style.backgroundPosition
    }

    // меняем позицию
    tile.style.left = State.EmptyTile.left;
    tile.style.top = State.EmptyTile.top;
    tile.setAttribute('idx', `${State.EmptyTile.idx}`);

    State.updateAfterMove(newEmptyTile)
  }
  // если нельзя двигать
  else {
    tile.addEventListener('animationend', (evt) => onTransitionEnd())
    tile.classList.add('shake');
  }

}
