declare namespace Puzzle {

  interface Picture {
    src: string;
    width: number;
    height: number;
  }

  interface AppParams {
    elem: string | HTMLElement;
    picture: Picture;
    startMatrixSize?: number;
  }

}