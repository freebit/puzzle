export const drawTiles = (matrixSize: number, picture: Puzzle.Picture): void => {
  const puzzleWrapper = document.getElementById('puzzle-wrapper');
  const fragment = document.createDocumentFragment();
  const { src: pictureSrc, width: pictureWidth, height: pictureHeight } = picture;
  const { width: puzzleWidth, height: puzzleHeight} = puzzleWrapper.getBoundingClientRect();

  const tilesPositions = [];

  const rows = matrixSize;
  const cols = matrixSize;
  const emptyTile = rows * cols - 1;
  const tileBordersSizePercent = 100 / (puzzleWidth / 2);
  const tileSizePercent = 100 / (puzzleWidth / (puzzleWidth / matrixSize));
  const bgStepPercent = 100 / (matrixSize - 1)


  puzzleWrapper.style.setProperty('--bg-size', `${100 * matrixSize}%`);
  puzzleWrapper.style.setProperty('--bg-img', `url(${pictureSrc})`);

  // console.log('picture size px - ', pictureWidth)
  // console.log('puzzle size px -', puzzleWidth)
  // console.log('tile size % -', tileSizePercent)

  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      const tile = document.createElement('div');
      const idx = (i * cols) + j;

      tile.setAttribute('pos', `${idx}`);
      tile.classList.add('tile');
      tile.style.width = `${tileSizePercent - tileBordersSizePercent}%`;
      tile.style.height = `${tileSizePercent -tileBordersSizePercent}%`;

      tile.style.left = `${j * tileSizePercent}%`;
      tile.style.top = `${i * tileSizePercent}%`;

      tile.style.backgroundPosition = `${j * bgStepPercent}% ${i * bgStepPercent}%`;

      tilesPositions.push([tile.style.left, tile.style.top]);

      if(idx === emptyTile) continue;

      fragment.append(tile);
    }
  }

  puzzleWrapper.innerHTML = '';
  // console.log('tiles - ', tilesPositions);
  puzzleWrapper.append(fragment);

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

export const resizeImage = (image: HTMLImageElement, size: number): string => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = size
  canvas.height = size
  ctx.drawImage(image, 0, 0, size, size)

  const { src } = image
  const ext = src.split('.').slice(-1)[0]

  return canvas.toDataURL(`image/${ext}`)
}
