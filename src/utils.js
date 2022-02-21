// randomisers
export const randomiseArray = (arr) => {
  if (!Array.isArray(arr)) throw new Error("Parameter must be array");
  return arr.sort(() => Math.random() - 0.5); // TODO: Improve randomisation
};

export const getRandomIndex = (length) => {
  if (typeof length !== "number" || length < 1 || !Number.isInteger(length)) {
    throw new Error("Parameter must be positive integer");
  }
  if (length === 1) return 0;
  return Math.floor(Math.random() * (length - 1));
};

export const getBackgroundPositions = (gridLength) => {
  if (typeof gridLength !== "number")
    throw new Error("Parameter must be number");
  // NOTE: See README for explanation
  const percentage = 100 / (gridLength - 1);
  let positions = [];
  for (let i = 0; i < gridLength ** 2; i++) {
    positions.push(
      `left ${(i % gridLength) * percentage}% top ${
        Math.floor(i / gridLength) * percentage
      }%`
    );
  }
  return positions;
};
