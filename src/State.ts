class State {

  private matrixSize: number;
  private tiles: Array<Puzzle.TileData>;
  private emptyTile: Puzzle.TileData;
  private activeTilesIdx: Array<number>;

  private tileSteps: Array<Puzzle.TileStep>;

  constructor() {
    this.matrixSize = null;
    this.tiles = [];
    this.activeTilesIdx = [];
    this.tileSteps = [];
  }

  public checkHash (): boolean {
    const hash = location.hash.replace('#', '');
    if(hash.length) {
      try {
        const decodedState = atob(hash);
        // инициализируем
        ({
          matrixSize: this.matrixSize,
          tiles: this.tiles,
          emptyTile: this.emptyTile,
          activeTilesIdx: this.activeTilesIdx,
          // tileSteps: this.tileSteps
        } = JSON.parse(decodedState))

        console.log('state from hash -', this)
        return true

      } catch (e) {
        alert('State not valid!')
        location.hash = '';
        return false;
      }
    } else {
      return false
    }

  }

  public async saveToHash () {
    const hash = `#${btoa(this.dataToString())}`
    history.pushState(null, '', hash)

    // location.hash = btoa(this.dataToString())
    console.log('save hash history state - ', window.history.state)
  }

  public initialize (matrixSize: number, puzzleSize: number) {
    const rows = matrixSize;
    const cols = matrixSize;
    const bottomRight = rows * cols;

    const tileBordersSizePercent = 100 / (puzzleSize / 2);
    const tileSizePercent = 100 / (puzzleSize / (puzzleSize / matrixSize));
    const bgStepPercent = 100 / (matrixSize - 1)

    this.tiles = [];
    for(let i = 0; i < rows; i++) {
      for(let j = 0; j < cols; j++) {
        const idx = ((i * cols) + j) + 1;
        const tileData: Puzzle.TileData = {
          idx,
          size: `${tileSizePercent - tileBordersSizePercent}%`,
          top: `${i * tileSizePercent}%`,
          left: `${j * tileSizePercent}%`,
          bgPosition: `${j * bgStepPercent}% ${i * bgStepPercent}%`
        };
        // если это последняя колонка в последней строке
        if (idx === bottomRight) {
          this.emptyTile = {...tileData}
        } else {
          this.tiles.push(tileData);
        }
      }
    }

    this.matrixSize = matrixSize;
    this.calcactiveTilesIdx();
  }

  public shuffleTiles () {
    // вернем пустой тайл в конец массива
    this.tiles.push(this.emptyTile)

    // делаем верхнюю левую плитку пустой
    this.emptyTile = {...this.tiles[0]};

    // мешаем позиции
    this.tiles.sort(() => Math.random() - 0.5);

    // извлекаем пустой тайл
    this.tiles = this.tiles.filter((tile) => tile.idx !== this.emptyTile.idx)
    this.calcactiveTilesIdx();
  }

  public updateTileBgPosition (index: number, bgPosition: string) {
    this.tiles[index].bgPosition = bgPosition;
  }

  public canMovieTile (tileIdx: number): boolean {
    return this.activeTilesIdx.includes(tileIdx);
  }

  public updateAfterMove (newEmptyTile: Puzzle.TileData) {
    const removableIndex = this.tiles.findIndex((tile) => tile.idx === newEmptyTile.idx)
    this.emptyTile.bgPosition = newEmptyTile.bgPosition;
    this.emptyTile = this.tiles.splice(removableIndex, 1, this.emptyTile)[0];
    this.calcactiveTilesIdx();
    this.saveToHash();
  }

  public pushHistoryState ({ from, toIdx }: Puzzle.TileStep) {
    this.tileSteps.push({ from, toIdx })
    history.pushState(this.tileSteps.length - 1, '')

    console.log('push history state - ', history.state, this.tileSteps)
  }

  public popHistoryState () {
    this.tileSteps.pop()
      // history.go(-1)
    if(this.tileSteps.length === 0) {
      return;
    } {
      // history.forward()
    }

    history.replaceState(this.tileSteps.length - 1, '');

    console.log('push history state - ', history.state, this.tileSteps)
  }

  private calcactiveTilesIdx () {
    enum PlaceInRow {
      Start = 'start',
      Middle = 'middle',
      End = 'end'
    }
    const activeTiles = [];
    const { idx: emptyPosition } = this.emptyTile;

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

    this.activeTilesIdx = activeTiles;
  }

  private dataToString (): string {
    const state = {
      "matrixSize": this.matrixSize,
      "tiles": this.tiles,
      "emptyTile": this.emptyTile,
      "activeTilesIdx": this.activeTilesIdx,
      "tileSteps": this.tileSteps
    }
    return JSON.stringify(state);
  }

  public get MatrixSize (): number {
    return this.matrixSize;
  }

  public get Tiles (): Array<Puzzle.TileData> {
    return [...this.tiles];
  }

  public get EmptyTile (): Puzzle.TileData {
    return {...this.emptyTile};
  }

  public get ActiveTilesIdx () : Array<Number> {
    return this.activeTilesIdx;
  }

  public get TileSteps (): Array<Puzzle.TileStep> {
    return [...this.tileSteps];
  }

}

export default new State()