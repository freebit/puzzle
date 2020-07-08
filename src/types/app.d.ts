declare namespace Puzzle {

  interface Picture {
    src: string;
    width: number;
    height: number;
  }

  interface AppParams {
    elem: HTMLElement;
    picture: Picture;
    startMatrixSize?: number;
  }

  interface TileData {
    idx?: number;
    size?: string;
    left: string;
    top: string;
    bgPosition?: string;
  }

  interface State {
    tiles: Array<TileData>;
    emptyTile: TileData | null;
  }

}
