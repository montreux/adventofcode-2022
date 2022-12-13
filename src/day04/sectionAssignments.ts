const assignmentsRegex = /(\d+)-(\d+),(\d+)-(\d+)/;

interface Assignment {
  fromSection: number;
  toSection: number;
}
interface PairAssignment {
  elfOne: Assignment;
  elfTwo: Assignment;
}

export function parseTextAssignment(assignmentText: string): PairAssignment {
  const match = assignmentText.match(assignmentsRegex);
  if (match == null || match.length !== 5) {
    throw new Error();
  }
  return {
    elfOne: {
      fromSection: Number.parseInt(match[1]),
      toSection: Number.parseInt(match[2]),
    },
    elfTwo: {
      fromSection: Number.parseInt(match[3]),
      toSection: Number.parseInt(match[4]),
    },
  };
}

export function doAssignmentsFullyOverlap(
  pairAssignment: PairAssignment
): boolean {
  const assignmentOne = pairAssignment.elfOne;
  const assignmentTwo = pairAssignment.elfTwo;
  return (
    (assignmentOne.fromSection >= assignmentTwo.fromSection &&
      assignmentOne.toSection <= assignmentTwo.toSection) ||
    (assignmentTwo.fromSection >= assignmentOne.fromSection &&
      assignmentTwo.toSection <= assignmentOne.toSection)
  );
}

export function findFullyOverlappingAssignments(
  pairAssignments: PairAssignment[]
): PairAssignment[] {
  const overlappingAssignments = pairAssignments.filter((pairAssignment) =>
    doAssignmentsFullyOverlap(pairAssignment)
  );
  return overlappingAssignments;
}

export function doAssignmentsPartiallyOverlap(
  pairAssignment: PairAssignment
): boolean {
  const assignmentOne = pairAssignment.elfOne;
  const assignmentTwo = pairAssignment.elfTwo;

  // beginning of one assignment is between the other assignment points, or
  // end of one assignment is between the other assignment points
  const assignmentOneStartsInAssigmentTwo =
    assignmentOne.fromSection >= assignmentTwo.fromSection &&
    assignmentOne.fromSection <= assignmentTwo.toSection;
  const assignmentOneEndsInAssigmentTwo =
    assignmentOne.toSection >= assignmentTwo.fromSection &&
    assignmentOne.toSection <= assignmentTwo.toSection;
  const assignmentTwoStartsInAssigmentOne =
    assignmentTwo.fromSection >= assignmentOne.fromSection &&
    assignmentTwo.fromSection <= assignmentOne.toSection;
  const assignmentTwoEndsInAssigmentOne =
    assignmentTwo.toSection >= assignmentOne.fromSection &&
    assignmentTwo.toSection <= assignmentOne.toSection;

  return (
    assignmentOneStartsInAssigmentTwo ||
    assignmentOneEndsInAssigmentTwo ||
    assignmentTwoStartsInAssigmentOne ||
    assignmentTwoEndsInAssigmentOne
  );
}

export function findPartiallyOverlappingAssignments(
  pairAssignments: PairAssignment[]
): PairAssignment[] {
  const overlappingAssignments = pairAssignments.filter((pairAssignment) =>
    doAssignmentsPartiallyOverlap(pairAssignment)
  );
  return overlappingAssignments;
}
