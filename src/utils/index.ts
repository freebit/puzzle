export const createPuzzleState = (matrixSize: number): Puzzle.State => {
  const state: Puzzle.State = {
    tiles: [],
    emptyTile: null
  }

  const puzzleWrapper = document.getElementById('puzzle-wrapper');
  const { width: puzzleWidth } = puzzleWrapper.getBoundingClientRect();

  const rows = matrixSize;
  const cols = matrixSize;

  const tileBordersSizePercent = 100 / (puzzleWidth / 2);
  const tileSizePercent = 100 / (puzzleWidth / (puzzleWidth / matrixSize));
  const bgStepPercent = 100 / (matrixSize - 1)

  // Указываем кастомные свойства для контейнера
  puzzleWrapper.style.setProperty('--bg-size', `${100 * matrixSize}%`);

  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      const idx = (i * cols) + j;
      state.tiles.push({ idx,
        size: `${tileSizePercent - tileBordersSizePercent}%`,
        left: `${j * tileSizePercent}%`,
        top: `${i * tileSizePercent}%`,
        bgPosition: `${j * bgStepPercent}% ${i * bgStepPercent}%`
      });

      // если это последняя колонка в последней строке
      if(idx === rows * cols - 1) {
        const emptyTile: Puzzle.TileData = state.tiles.slice(-1)[0]
        state.emptyTile = state.tiles.slice(-1)[0]
        continue;
      }
    }
  }

  return state;
}

export const drawTiles = (state: Puzzle.State, container: HTMLElement) => {
  const documentFragment = document.createDocumentFragment();

  for (const tileData of state.tiles) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.setAttribute('idx', `${tileData.idx}`);
    tile.style.width = tileData.size;
    tile.style.height = tileData.size;
    tile.style.left = tileData.left;
    tile.style.top = tileData.top;
    tile.style.backgroundPosition = tileData.bgPosition;

    if(tileData.idx === state.emptyTile.idx) continue;

    documentFragment.appendChild(tile);
  }

  container.innerHTML = '';
  container.append(documentFragment);
}

export const loadImage = (url: string) => {
  const image = new Image()
  const promise = new Promise((resolve, reject) => {
    image.onload = () => resolve(image)
    image.onerror = () => reject(Error('Image loading error'))
  })
  image.src = url
  return promise
}