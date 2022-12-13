import { notDeepEqual } from "assert";
import { loadDataFrom } from "../textFileReader";
import {
  findFullyOverlappingAssignments,
  findPartiallyOverlappingAssignments,
  parseTextAssignment,
} from "./sectionAssignments";

test("Parse section assignment text", () => {
  const testData = loadDataFrom(
    "./src/day04/sectionassignments.exampledata.txt"
  );
  const assignment = parseTextAssignment(testData[0]);
  // 2-4,6-8
  expect(assignment.elfOne.fromSection).toBe(2);
  expect(assignment.elfOne.toSection).toBe(4);
  expect(assignment.elfTwo.fromSection).toBe(6);
  expect(assignment.elfTwo.toSection).toBe(8);
});

test("findOverlappingAssignments", () => {
  const testData = loadDataFrom(
    "./src/day04/sectionassignments.exampledata.txt"
  );
  const assignments = testData.map((assignmentText) =>
    parseTextAssignment(assignmentText)
  );
  const fullyOverlappingAssignments =
    findFullyOverlappingAssignments(assignments);
  expect(fullyOverlappingAssignments).toHaveLength(2);
});

test("findFullyOverlappingAssignments - part 1", () => {
  const testData = loadDataFrom("./src/day04/sectionassignments.data.txt");
  const assignments = testData.map((assignmentText) =>
    parseTextAssignment(assignmentText)
  );
  const fullyOverlappingAssignments =
    findFullyOverlappingAssignments(assignments);
  expect(fullyOverlappingAssignments).toHaveLength(584);
});

test("findPartiallyOverlappingAssignments", () => {
  const testData = loadDataFrom(
    "./src/day04/sectionassignments.exampledata.txt"
  );
  const assignments = testData.map((assignmentText) =>
    parseTextAssignment(assignmentText)
  );
  const partiallyOverlappingAssignments =
    findPartiallyOverlappingAssignments(assignments);
  expect(partiallyOverlappingAssignments).toHaveLength(4);
});

test("findPartiallyOverlappingAssignments - part 2", () => {
  const testData = loadDataFrom("./src/day04/sectionassignments.data.txt");
  const assignments = testData.map((assignmentText) =>
    parseTextAssignment(assignmentText)
  );
  const partiallyOverlappingAssignments =
    findPartiallyOverlappingAssignments(assignments);
  expect(partiallyOverlappingAssignments).toHaveLength(933);
});
