declare namespace Puzzle {

  interface AppParams {
    container: HTMLElement;
    picture: string;
    startMatrixSize?: number;
  }

  interface TilePosition {
    idx: number;
    top?: string;
    left?: string;
  }

  interface TileData extends TilePosition {
    size?: string;
    bgPosition?: string;
  }

}
