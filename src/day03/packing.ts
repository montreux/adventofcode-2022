// Split character array into two
// Find single matching character, and save
// Sum values of duplicate characters

export function findMispackedItem(bagContents: string): string {
  // vJrwpWtwJgWrhcsFMMfFFhFp
  // vJrwpWtwJgWr hcsFMMfFFhFp
  // 'p' is mispacked

  const halfWayIndex = bagContents.length / 2;
  const compartmentOneContents = bagContents.slice(0, halfWayIndex);
  const compartmentTwoContents = bagContents.slice(halfWayIndex);

  let mispackedItem = "";
  [...compartmentOneContents].forEach((item) => {
    // console.log(`Testing if ${compartmentTwoContents} contains ${item}`);
    if (compartmentTwoContents.includes(item)) {
      mispackedItem = item;
    }
  });

  return mispackedItem;
}

export function findAllMispackedItems(allBagsContents: string[]): string[] {
  const allMispackedItems = allBagsContents.map((bagContents) =>
    findMispackedItem(bagContents)
  );
  return allMispackedItems;
}

export function calculatePriorityOfItems(items: string): number {
  const itemPrioritiesLookup = buildItemPrioritiesMap();

  const itemsArray = [...items];
  const itemPriorities = itemsArray.map(
    (item) => itemPrioritiesLookup.get(item)!
  );
  const sumOfItemPriorities = itemPriorities.reduce(
    (previousValue, currentValue) => previousValue + currentValue
  );

  return sumOfItemPriorities;
}

function buildItemPrioritiesMap(): Map<string, number> {
  const itemPriorities = new Map<string, number>();
  const aCharCode = "a".charCodeAt(0);
  const upperACharCode = "A".charCodeAt(0);
  for (let index = 0; index < 26; index++) {
    const lowercaseItem = String.fromCharCode(aCharCode + index);
    const lowercaseItemValue = 1 + index;
    itemPriorities.set(lowercaseItem, lowercaseItemValue);
    const uppercaseItem = String.fromCharCode(upperACharCode + index);
    const uppercaseItemValue = 27 + index;
    itemPriorities.set(uppercaseItem, uppercaseItemValue);
  }
  return itemPriorities;
}

// split into three lines each
export function splitBagsIntoTriplets(allBagContents: string[]): string[][] {
  const teamBagContents: string[][] = [];
  for (let index = 0; index < allBagContents.length; index += 3) {
    teamBagContents.push([
      allBagContents[index],
      allBagContents[index + 1],
      allBagContents[index + 2],
    ]);
  }
  return teamBagContents;
}

// for each triplet, find the matching letter in all three lines
export function findItemInAllThreeBags(
  bagOneContents: string,
  bagTwoContents: string,
  bagThreeContents: string
): string {
  const itemsInBagOne = [...bagOneContents];
  let itemInAllThreeBags = "";
  itemsInBagOne.forEach((item) => {
    if (bagTwoContents.includes(item) && bagThreeContents.includes(item)) {
      itemInAllThreeBags = item;
    }
  });
  return itemInAllThreeBags;
}

export function calculatePriorityOfBadgeItems(
  allBagsContents: string[]
): number {
  const bagsByTeam = splitBagsIntoTriplets(allBagsContents);
  const teamBadgeItems: string[] = [];
  bagsByTeam.forEach((bagContents) => {
    const teamBagdeItem = findItemInAllThreeBags(
      bagContents[0],
      bagContents[1],
      bagContents[2]
    );
    teamBadgeItems.push(teamBagdeItem);
  });
  const sumOfPriorities = calculatePriorityOfItems(teamBadgeItems.join(""));
  return sumOfPriorities;
}
