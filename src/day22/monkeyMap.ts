type Face = {
  isCellBlocked: boolean[][];
  faceUp: Face;
  faceUpOrientation: Orientation;
  faceLeft: Face;
  faceLeftOrientation: Orientation;
  faceRight: Face;
  faceRightOrientation: Orientation;
  faceDown: Face;
  faceDownOrientation: Orientation;
};

type FaceTiles = {
  isCellBlocked: boolean[][];
};

type Orientation = "Inline" | "90Left" | "90Right" | "180";

export function importData(
  inputData: string[],
  gridWidth: number,
  flatOrCube: "flat" | "cube"
): Face[] {
  const numFacesWide = inputData[0].length / gridWidth;
  const numFacesHigh = inputData.length / gridWidth;

  const facesTiles: FaceTiles[][] = [];
  for (let facesRowIndex = 0; facesRowIndex < numFacesHigh; facesRowIndex++) {
    const facesRow: FaceTiles[] = [];
    for (
      let facesColumnIndex = 0;
      facesColumnIndex < numFacesWide;
      facesColumnIndex++
    ) {
      facesRow.push({
        isCellBlocked: new Array() < boolean > [gridWidth].fill(false),
      });
    }
  }

  inputData.forEach((rowText: string, rowIndex) => {
    for (
      let faceColumnIndex = 0;
      faceColumnIndex < numFacesWide;
      faceColumnIndex++
    ) {
      const startColumn = faceColumnIndex * gridWidth;
      const endColumn = (faceColumnIndex + 1) * gridWidth;
      const faceRowText = rowText.substring(startColumn, endColumn);
      const isBlankFace = faceRowText.startsWith(" ");
      if (isBlankFace) {
        continue;
      }
      const isCellBlocked = [...faceRowText].map(
        (character) => character === "#"
      );
      const faceRowIndex = Math.floor(rowIndex / gridWidth);
      faces[faceRowIndex][faceColumnIndex].isCellBlocked.push(isCellBlocked);
    }
  });
  return [];
}
