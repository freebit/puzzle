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

  for (const tileData of State.Tiles) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.setAttribute('position', `${tileData.position}`);
    tile.style.width = tileData.size;
    tile.style.height = tileData.size;
    tile.style.left = tileData.left;
    tile.style.top = tileData.top;
    tile.style.backgroundPosition = tileData.bgPosition;

    if(tileData.empty) continue;

    documentFragment.appendChild(tile);
  }

  container.innerHTML = '';
  container.append(documentFragment);
}


export const drawShuffleTiles = (container: HTMLElement) => {
  // на время перемешивания убираем верхнюю левую плитку, делаем ее пустой
  const topLeftTile = State.Tiles.shift()
  topLeftTile.empty = true

  State.shuffleTiles()

  const childTiles = Array.from(container.childNodes);

  for(let i = 0; i < childTiles.length; i++) {
    const childTile = childTiles[i] as HTMLElement

    // childTile.style.willChange = 'left, top';
    childTile.setAttribute('position', `${State.Tiles[i].position}`)
    childTile.style.left = State.Tiles[i].left;
    childTile.style.top = State.Tiles[i].top;
    State.Tiles[i].empty && (delete State.Tiles[i].empty);
    // childTile.style.willChange = 'auto';
  }

  State.updateTiles([topLeftTile, ...State.Tiles])
  State.updateEmptyTile(topLeftTile)
}


export const tileClickHandler = (tile: HTMLElement) => {
  const tilePosition = Number(tile.getAttribute('position'));

  const onTransitionEnd = () => {
    tile.classList.remove('to-step');
    tile.classList.remove('shake')
    tile.removeEventListener('transitionend', onTransitionEnd)
  }

  // если можно двигать
  if(State.ActiveTilePositions.includes(tilePosition)) {
    tile.addEventListener('transitionend', (evt) => onTransitionEnd())
    tile.classList.add('to-step')

    // кэшируем
    const cache: Puzzle.TileData = {
      left: tile.style.left,
      top: tile.style.top,
      position: tilePosition
    }

    // меняем позицию
    tile.style.left = State.EmptyTile.left;
    tile.style.top = State.EmptyTile.top;
    tile.setAttribute('position', `${State.EmptyTile.position}`);

    State.updateEmptyTile(cache)
    State.calcActiveTilePositions()
  }
  // если нельзя двигать
  else {
    tile.addEventListener('animationend', (evt) => onTransitionEnd())
    tile.classList.add('shake');
  }

}