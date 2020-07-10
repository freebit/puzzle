declare namespace Puzzle {

  interface AppParams {
    container: HTMLElement;
    picture: string;
    startMatrixSize?: number;
  }

  interface TileData {
    position: number;
    size?: string;
    left: string;
    top: string;
    bgPosition?: string;
    empty?: boolean;
  }

  interface State {
    matrixSize: number;
    tiles: Array<TileData>;
    emptyTile?: TileData | null;
    activeTilesPositions?: Array<number>;
  }

}
