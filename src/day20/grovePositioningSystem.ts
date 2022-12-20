/*
Initial arrangement:
1, 2, -3, 3, -2, 0, 4

1 moves between 2 and -3:
2, 1, -3, 3, -2, 0, 4

2 moves between -3 and 3:
1, -3, 2, 3, -2, 0, 4

-3 moves between -2 and 0:
1, 2, 3, -2, -3, 0, 4

3 moves between 0 and 4:
1, 2, -2, -3, 0, 3, 4

-2 moves between 4 and 1:
1, 2, -3, 0, 3, 4, -2

0 does not move:
1, 2, -3, 0, 3, 4, -2

4 moves between -3 and 0:
1, 2, -3, 4, 0, 3, -2
*/

import { RingBuffer } from "./ringBuffer";

// Create array of value, original index, and current index
// Step through values in index order
// Move to new location.
// If moving up change the current index of everything between current index and new current index -1, or +1 if moving down.
// e.g.
// item at original index 0 (1)
// currentIndex = 0, newIndex = 1
// Remove from 0 and insert at 1
// Everything with currentIndex >0 (old current index) and <=1 (new current index) has their current index changed by -1
//
// item at original index 1 (2): currentIndex=0, newIndex=2
// Everything with currentIndex >0 (old current index) and <=2 (new current index) has their current index changed by -1
//
// item at original index 2 (-3): currentIndex=1, newIndex=4 (length -1 + (currentIndex+change)) (7 - 1 +(1-3))
// As wrapped down: Everything with currentIndex >=0  and <=4 (new current index) has their current index changed by -1
//
// item at original index 3 (3): currentIndex=2, newIndex=5
// Everything with currentIndex >2 (old current index) and <=5 (new current index) has their current index changed by -1
//
// item at original index 4 (-2): currentIndex=2, newIndex=6 (length -1 + (currentIndex+change)) (7 - 1 +(2-2))
// As wrapped down: Everything with currentIndex >=0  and <=6 (new current index) has their current index changed by -1

/*
Each 'item' is put into an object. That exact object (reference ) is put into two data structures. One a linear array, the other my own version of a ring buffer.

* Step through each item in the array
* Find that item in the ring buffer (reference equality)
* Ask the ring buffer to move it +/- n places
*/

type Item = {
  value: number;
  originalIndex: number;
};

export function decrypt(items: number[]): number[] {
  const originalItems = items.map((value, originalIndex) => {
    return { value, originalIndex };
  });

  const workingBuffer = RingBuffer.fromArray(originalItems);

  for (const item of originalItems) {
    workingBuffer.shiftItem(item, item.value);
  }

  const decryptedArray = workingBuffer.toArray().map((item) => item.value);
  return decryptedArray;
}

export function decryptPart2(
  items: number[],
  decryptionKey = 811589153,
  mixCount = 10
): number[] {
  const originalItems = items.map((value, originalIndex) => {
    return { value: value * decryptionKey, originalIndex };
  });

  const workingBuffer = RingBuffer.fromArray(originalItems);

  for (let mixIndex = 0; mixIndex < mixCount; mixIndex++) {
    for (const item of originalItems) {
      workingBuffer.shiftItem(item, item.value);
    }
  }

  const decryptedArray = workingBuffer.toArray().map((item) => item.value);
  return decryptedArray;
}
