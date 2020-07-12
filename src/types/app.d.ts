declare namespace Puzzle {

  interface AppParams {
    container: HTMLElement;
    picture: string;
    startMatrixSize?: number;
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
