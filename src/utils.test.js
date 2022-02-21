import {
  randomiseArray,
  getRandomIndex,
  getBackgroundPositions,
} from "./utils";

describe("getRandomIndex tests", () => {
  // Random number will always be 1
  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(1);
  });
  afterEach(() => {
    jest.spyOn(global.Math, "random").mockRestore();
  });

  test("Chooses a random index", () => {
    expect(getRandomIndex(5)).toBe(4);
    expect(getRandomIndex(1)).toBe(0);
  });

  test("Only accepts numbers", () => {
    expect(() => getRandomIndex("5")).toThrow(
      "Parameter must be positive integer"
    );
  });

  test("Only accepts positive numbers", () => {
    expect(() => getRandomIndex(-3)).toThrow(
      "Parameter must be positive integer"
    );
  });

  test("Only accepts integers", () => {
    expect(() => getRandomIndex(4.5)).toThrow(
      "Parameter must be positive integer"
    );
  });
});

describe("randomiseArray tests", () => {
  // Random number will always be 0
  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0);
  });
  afterEach(() => {
    jest.spyOn(global.Math, "random").mockRestore();
  });

  test("Randomises an array", () => {
    expect(randomiseArray([1, 2, 3, 4, 5])).toStrictEqual([5, 4, 3, 2, 1]);
  });

  test("Only accepts arrays", () => {
    expect(() => randomiseArray("helloworld")).toThrow(
      "Parameter must be array"
    );
    expect(() => randomiseArray(5)).toThrow("Parameter must be array");
  });
});

describe("getBackgroundPositions tests", () => {
  test("Gets background positions", () => {
    expect(getBackgroundPositions(2)).toStrictEqual([
      "left 0% top 0%",
      "left 100% top 0%",
      "left 0% top 100%",
      "left 100% top 100%",
    ]);
    expect(getBackgroundPositions(3)).toStrictEqual([
      "left 0% top 0%",
      "left 50% top 0%",
      "left 100% top 0%",
      "left 0% top 50%",
      "left 50% top 50%",
      "left 100% top 50%",
      "left 0% top 100%",
      "left 50% top 100%",
      "left 100% top 100%",
    ]);
  });

  test("Only accepts numbers", () => {
    expect(() => getBackgroundPositions("helloworld")).toThrow(
      "Parameter must be number"
    );
  });
});
