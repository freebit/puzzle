export const drawTiles = (matrixSize: number, pictureSrc: string): void => {
  const puzzleWrapper = document.getElementById('puzzle-wrapper');
  const fragment = document.createDocumentFragment();

  const { width: puzzleWidth, height: puzzleHeight} = puzzleWrapper.getBoundingClientRect()
  const puzzlePadding = parseInt(getComputedStyle(puzzleWrapper).paddingTop, 10);
  const realWidth = puzzleWidth - (puzzlePadding * 2)
  const realHeight = puzzleHeight - (puzzlePadding * 2)

  // console.log('puzzle sizes -', realWidth, realHeight)
  // console.log('matrix size -', matrixSize)


  const rows = matrixSize;
  const cols = matrixSize;
  const emptyTile = rows * cols - 1;
  console.log('emptyTile -', emptyTile)


  const sizePx = (realWidth / matrixSize)
  const sizePercent = 100 / (realWidth / (realWidth / matrixSize))

  // console.log('tile size in px -', realWidth / matrixSize)
  // console.log('tile size in percent -', sizePercent)

  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      const tile = document.createElement('div')
      const position = i * cols + j
      tile.classList.add('tile')
      tile.style.width = `${sizePercent}%`
      tile.style.height = `${sizePercent}%`
      // tile.style.paddingTop = `${Math.floor(sizePercent/2)}%`
      // tile.style.paddingBottom = `${Math.floor(sizePercent/2)}%`


      tile.style.left = `${j * sizePx + puzzlePadding}px`
      tile.style.top = `${(i) * sizePx + puzzlePadding}px`
      // tile.style.backgroundImage = `url(${pictureSrc})`
      tile.setAttribute('pos', `${position}`)
      if(position === emptyTile) continue
      fragment.append(tile)
    }
  }

  puzzleWrapper.innerHTML = '';
  console.log('puzzle fragment - ', fragment.childNodes.length)
  puzzleWrapper.append(fragment)

}
