declare namespace Puzzle {

  interface AppParams {
    container: HTMLElement;
    control: HTMLInputElement;
    picture: string;
    minMatrixSize: number;
    maxMatrixSize: number;
    startMatrixSize: number;
  }

  interface TilePosition {
    idx: number | null;
    top: string | null;
    left: string | null;
  }

  interface TileData extends TilePosition {
    size?: string;
    bgPosition: string;
  }

  interface TileStep {
    from: TileData;
    toIdx: number;
  }

}
