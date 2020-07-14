export default class TileStep {

  constructor(
    private from: Puzzle.TileData,
    private toIdx: number
  ) {}

  public turn() {
    return ({ toIdx: this.from.idx, from: { idx: this.toIdx} } = this);
  }

  public get data(): any {
    return { from: this.from, toIdx: this.toIdx };
  }

}