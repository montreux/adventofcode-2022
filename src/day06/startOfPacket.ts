export function findStartOfPacket(streamInput: string): number {
  const searchDepth = 4;
  return findUniqueCharacterSequence(streamInput, searchDepth);
  //   const allCharactersInStream = [...streamInput];
  //   for (let index = 0; index < allCharactersInStream.length - 4; index++) {
  //     const firstCharacter = allCharactersInStream[index];
  //     const secondCharacter = allCharactersInStream[index + 1];
  //     const thirdCharacter = allCharactersInStream[index + 2];
  //     const fourthCharacter = allCharactersInStream[index + 3];

  //     if (
  //       firstCharacter !== secondCharacter &&
  //       firstCharacter !== thirdCharacter &&
  //       firstCharacter !== fourthCharacter &&
  //       secondCharacter !== thirdCharacter &&
  //       secondCharacter !== fourthCharacter &&
  //       thirdCharacter !== fourthCharacter
  //     ) {
  //       const startOfPacketPosition = index + 4;
  //       return startOfPacketPosition;
  //     }
  //   }
  //   return 0;
}

export function findStartOfMessage(streamInput: string): number {
  const searchDepth = 14;
  return findUniqueCharacterSequence(streamInput, searchDepth);
}

export function findUniqueCharacterSequence(
  streamInput: string,
  searchDepth: number
): number {
  const allCharactersInStream = [...streamInput];

  for (
    let index = 0;
    index < allCharactersInStream.length - searchDepth;
    index++
  ) {
    let containsAllUniqueCharacters = true;
    const substringBeingTested = streamInput.slice(index, index + searchDepth);
    for (const testCharacter of [...substringBeingTested]) {
      const firstIndex = substringBeingTested.indexOf(testCharacter);
      const lastIndex = substringBeingTested.lastIndexOf(testCharacter);
      const isUnique = firstIndex === lastIndex;

      containsAllUniqueCharacters &&= isUnique;
    }

    if (containsAllUniqueCharacters) {
      const startPosition = index + searchDepth;
      return startPosition;
    }
  }
  return 0;
}
