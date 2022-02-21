import { getRandomIndex } from "./utils";
import manipulateDOM from "./manipulateDOM";

const Game = (gridSize) => {
  if (typeof gridSize !== "number" || gridSize < 2) {
    throw new Error("Parameter must be number >= 2");
  }

  // initialise game on DOM
  manipulateDOM.setNewGame(gridSize);

  // scoped game variables
  let _score = 0;
  let _hints = 0;
  let _errors = 0;
  let _turns = [];

  // initialise turns
  for (let i = 0; i < gridSize ** 2; i++) {
    _turns.push(i);
  }

  // counter management
  const _incrementScore = () => {
    _score += 1;
    manipulateDOM.setScore(_score);
  };

  const _incrementHints = () => {
    _hints += 1;
    manipulateDOM.setHints(_hints);
  };

  const incrementError = () => {
    _errors += 1;
    manipulateDOM.setErrors(_errors);
  };

  const _checkGameOver = () => {
    if (_turns.length > 0) return;
    // game over
    const tileCount = gridSize ** 2;
    if (_score === tileCount && _errors === 0) {
      // perfect game!
      manipulateDOM.endGame({ perfect: true });
      return;
    }
    const thirdOfTiles = Math.floor(tileCount / 3); // TODO: Refine logic for bad game
    if (_errors > thirdOfTiles || _hints > thirdOfTiles) {
      // over third of tiles wrongly played / filled with hints
      manipulateDOM.endGame({ bad: true });
      return;
    }
    // pretty good
    manipulateDOM.endGame({ good: true });
  };

  const takeTurn = (key = undefined) => {
    const _playTurn = (k) => {
      manipulateDOM.playTurn(k);
      _checkGameOver();
    };
    if (key === undefined) {
      // No index, is hint
      if (!_turns.length) throw new Error("No more turns available");
      const randomIndex = getRandomIndex(_turns.length);
      [key] = _turns.splice(randomIndex, 1);
      _incrementHints();
      _playTurn(key);
      return;
    }
    // Player turn
    const turnIndex = _turns.indexOf(key);
    if (turnIndex < 0) throw new Error("Turn does not exist");
    _turns.splice(turnIndex, 1); // Or filter out?
    _incrementScore();
    _playTurn(key);
  };

  return {
    incrementError,
    takeTurn,
  };
};

export default Game;

/* Draft pseudo-code
 *
 * Instantiate game
 * - Set everything back to defaults (inc. DOM)
 * - Square gridSize to get tile count
 * - For each tile, push an image to an array
 * - Give each image:
 *   - An aspect ratio of 1:1
 *   - A width and height of (100% / gridSize)
 *   - A background of the image
 *   - A background offset corresponding to the tile
 *   - A data key of the tile number
 * - Randomise the array
 * - Append each image to the rack
 *
 * - Give the background the gameArea the url
 * - Fill with squares of (100% / gridSize) height and width
 * - Apply a class to each with;
 *   - A white fill
 *   - A data key of the tile number
 *
 * Take a turn (WITH or WITHOUT number)
 * - If number:
 *   - Filter turn out of _turns
 *   - If !newArray.length
 *     - doesn't exist
 *     - _errors += 1
 *     - Update error counter in DOM
 *   - Else (exists)
 *     - Make white square with corresponding data key transparent
 *     - Delete player tile with corresponding data key
 *     - _score += 1
 *     - Update score counter in DOM
 * - Else if no number (is hint):
 *   - Randomly generate index from remaining turns
 *   - Splice item out of _turns
 *   - Make white square with corresponding data key transparent
 *   - Remove player tile with corresponding data key
 *   - _hints += 1
 *   - Update hint counter in DOM
 */
