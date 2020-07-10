class State {

  private matrixSize: number;
  private tiles: Array<Puzzle.TileData>;
  private emptyTile: Puzzle.TileData;
  private activeTilePositions: Array<number>;

  constructor() {
    this.matrixSize = null;
    this.tiles = [];
    this.emptyTile = {
      position: null,
      top: null,
      left: null
    }
    this.activeTilePositions = []
  }

  public initialize (matrixSize: number, puzzleSize: number) {
    const rows = matrixSize;
    const cols = matrixSize;
    const bottomRight = rows * cols

    const tileBordersSizePercent = 100 / (puzzleSize / 2);
    const tileSizePercent = 100 / (puzzleSize / (puzzleSize / matrixSize));
    const bgStepPercent = 100 / (matrixSize - 1)

    this.tiles = [];

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
        this.tiles.push(tileData)
      }
    }
    this.emptyTile = this.tiles[bottomRight - 1]
    this.matrixSize = matrixSize
  }

  public shuffleTiles () {
    this.tiles.sort(() => Math.random() - 0.5);
  }

  public updateTiles (tiles: Array<Puzzle.TileData>) {
    this.tiles = tiles;
  }

  public updateEmptyTile (data: Puzzle.TileData) {
    this.emptyTile = data;
  }

  public calcActiveTilePositions () {
    enum PlaceInRow {
      Start = 'start',
      Middle = 'middle',
      End = 'end'
    }
    const activeTiles = [];
    const { position: emptyPosition } = this.emptyTile;

    const mod = emptyPosition % this.matrixSize;
    const div = emptyPosition / this.matrixSize;

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

    if (row > 1) activeTiles.push(emptyPosition - this.matrixSize);
    if (row < this.matrixSize) activeTiles.push(emptyPosition + this.matrixSize);

    this.activeTilePositions = activeTiles;
  }

  public get MatrixSize (): number {
    return this.matrixSize;
  }

  public get Tiles (): Array<Puzzle.TileData> {
    return this.tiles;
  }

  public get EmptyTile (): Puzzle.TileData {
    return this.emptyTile;
  }

  public get ActiveTilePositions () : Array<Number> {
    return this.activeTilePositions;
  }

}

export default new State()