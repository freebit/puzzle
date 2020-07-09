export const loadImage = (url: string) => {
  const image = new Image()
  const promise = new Promise((resolve, reject) => {
    image.onload = () => resolve(image)
    image.onerror = () => reject(Error('Image loading error'))
  })
  image.src = url
  return promise
}

export const createState = (matrixSize: number, puzzleSize: number): Puzzle.State => {
  const state: Puzzle.State = {
    matrixSize: matrixSize,
    tiles: [],
    emptyTile: null
  }

  const rows = matrixSize;
  const cols = matrixSize;
  const bottomRight = rows * cols

  const tileBordersSizePercent = 100 / (puzzleSize / 2);
  const tileSizePercent = 100 / (puzzleSize / (puzzleSize / matrixSize));
  const bgStepPercent = 100 / (matrixSize - 1)

  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      const position = ((i * cols) + j) + 1;
      const tileData: Puzzle.TileData = {
        position,
        size: `${tileSizePercent - tileBordersSizePercent}%`,
        left: `${j * tileSizePercent}%`,
        top: `${i * tileSizePercent}%`,
        bgPosition: `${j * bgStepPercent}% ${i * bgStepPercent}%`
      };
      // если это последняя колонка в последней строке
      (position === bottomRight) && (tileData.empty = true)
      state.tiles.push(tileData)
    }
  }
  state.emptyTile = state.tiles[bottomRight]
  return state;
}

export const drawTiles = (state: Puzzle.State, container: HTMLElement) => {
  const documentFragment = document.createDocumentFragment();

  for (const tileData of state.tiles) {
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


export const shuffleTiles = (state: Puzzle.State, container: HTMLElement): Puzzle.State => {
  // на время перемешивания убираем верхнюю левую плитку, делаем ее пустой
  const topLeftTile = state.tiles.shift()
  topLeftTile.empty = true

  // перемешиваем
  state.tiles.sort(() => Math.random() - 0.5);

  const childTiles = Array.from(container.childNodes);

  for(let i = 0; i < childTiles.length; i++) {
    const childTile = childTiles[i] as HTMLElement

    // childTile.style.willChange = 'left, top';
    childTile.setAttribute('position', `${state.tiles[i].position}`)
    childTile.style.left = state.tiles[i].left;
    childTile.style.top = state.tiles[i].top;
    state.tiles[i].empty && (delete state.tiles[i].empty);
    // childTile.style.willChange = 'auto';
  }
  // возвращаем пустую плитку в начало (так нагляднее, чем unshift())
  state.tiles = [topLeftTile, ...state.tiles]
  state.emptyTile = topLeftTile
  return state;
}

export const calcActiveTilesPositions = (state: Puzzle.State): Array<number> => {

  enum PlaceInRow {
    Start = 'start',
    Middle = 'middle',
    End = 'end'
  }
  const activeTiles = [];
  const { matrixSize } = state;
  const { position: emptyPosition } = state.emptyTile;

  const mod = emptyPosition % matrixSize;
  const div = emptyPosition / matrixSize;

  const row = Number.isInteger(div) ? div : Math.ceil(div);
  const placeInRow = (mod === 1) ? PlaceInRow.Start : (mod === 0) ? PlaceInRow.End : PlaceInRow.Middle;

  switch (placeInRow) {
    case PlaceInRow.Start:
      activeTiles.push(emptyPosition + 1);
      break;
    case PlaceInRow.Middle:
      activeTiles.push(emptyPosition - 1);
      activeTiles.push(emptyPosition + 1);
      break;
    case PlaceInRow.End:
      activeTiles.push(emptyPosition - 1);
      break;
  }

  if (row > 1) activeTiles.push(emptyPosition - matrixSize);
  if (row < matrixSize) activeTiles.push(emptyPosition + matrixSize);

  state.activeTilesPositions = activeTiles;
  return activeTiles;
}