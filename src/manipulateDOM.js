import { randomiseArray, getBackgroundPositions } from "./utils";

const manipulateDOM = (() => {
  // grid range
  const _GridSizeLabel = document.getElementById("gridsizelabel");
  const _GridSizeInput = document.getElementById("gridsize");

  // counters
  const _Score = document.getElementById("score");
  const _Errors = document.getElementById("errors");
  const _Hints = document.getElementById("hints");

  // buttons
  const _HintButton = document.getElementById("hint");

  // containers
  const _TileRack = document.getElementById("tilerack");
  const _GameArea = document.getElementById("gamearea");

  // outcome
  const _Outcome = document.getElementById("outcome");

  let imgUrl;

  // Counter management
  const setScore = (scoreCount) => {
    _Score.textContent = scoreCount;
  };
  const setErrors = (errorCount) => {
    _Errors.textContent = errorCount;
  };
  const setHints = (hintCount) => {
    _Hints.textContent = hintCount;
  };
  // Endgame message
  const _setOutcome = (message, color) => {
    _Outcome.textContent = message;
    _Outcome.style.color = color;
  };

  const _resetAllText = () => {
    [_Score, _Errors, _Hints].forEach((Elem) => (Elem.textContent = "0"));
    _setOutcome("");
  };

  // Image management
  const setImage = (url) => {
    imgUrl = url;
    _GameArea.style.backgroundImage = `url('${imgUrl}')`;
  };

  // Grid range management
  const setGridSizes = ({ min, max, base }) => {
    if (min === undefined || max === undefined || base === undefined)
      throw new Error("Undeclared value");
    _GridSizeLabel.textContent = `Grid size (between ${min} and ${max}):`;
    _GridSizeInput.min = min;
    _GridSizeInput.max = max;
    _GridSizeInput.value = base;
  };

  // Button management
  const _hintButton = {
    enable: () => {
      _HintButton.removeAttribute("disabled");
    },
    disable: () => {
      _HintButton.setAttribute("disabled", "true");
    },
  };

  // Board tiles
  const _boardTiles = (() => {
    let BoardTiles;
    return {
      generate: (gridSize) => {
        BoardTiles = [];
        // Guarantee that game area is empty
        _GameArea.innerHTML = "";
        _GameArea.style.display = "grid";
        const gridTemplate = `repeat(${gridSize}, 1fr)`;
        _GameArea.style.gridTemplateColumns = gridTemplate;
        _GameArea.style.gridAutoRows - gridTemplate;
        for (let i = 0; i < gridSize ** 2; i++) {
          const BoardTile = document.createElement("div");
          BoardTile.classList.add("boardtile");
          BoardTile.addEventListener("dragover", (e) => e.preventDefault());
          BoardTile.dataset.key = i;
          // Store locally for access later
          BoardTiles.push(BoardTile);
          _GameArea.appendChild(BoardTile);
        }
      },
      play: (key) => {
        BoardTiles[key].classList.add("revealedtile");
      },
      removeBoarders: () => {
        BoardTiles.forEach((Tile) => Tile.classList.add("noborder"));
      },
    };
  })();

  // Player tiles
  const _playerTiles = (() => {
    let PlayerTiles;
    return {
      generate: (gridSize) => {
        PlayerTiles = [];
        // Guarantee that tile rack is empty
        _TileRack.innerHTML = "";
        const positionsArray = getBackgroundPositions(gridSize);
        let Tiles = [];
        if (!imgUrl)
          throw new Error("Cannot set tile background without image");
        for (let i = 0; i < gridSize ** 2; i++) {
          const PlayerTile = document.createElement("div");
          PlayerTile.classList.add("playertile");
          PlayerTile.style.backgroundImage = `url('${imgUrl}')`;
          PlayerTile.style.backgroundSize = `${gridSize * 100}%`;
          PlayerTile.style.backgroundPosition = positionsArray[i];
          PlayerTile.draggable = true;
          PlayerTile.dataset.key = i;
          // Store locally for access later
          PlayerTiles.push(PlayerTile);
          Tiles.push(PlayerTile);
        }
        // Randomise tiles
        randomiseArray(Tiles);
        Tiles.forEach((Tile) => _TileRack.appendChild(Tile));
      },
      play: (key) => {
        PlayerTiles[key].remove();
      },
    };
  })();

  const playTurn = (key) => {
    _boardTiles.play(key);
    _playerTiles.play(key);
  };

  const setNewGame = (gridSize) => {
    _resetAllText();
    _boardTiles.generate(gridSize);
    _playerTiles.generate(gridSize);
    _hintButton.enable();
  };

  const endGame = ({ good = false, bad = false, perfect = false }) => {
    _boardTiles.removeBoarders();
    _hintButton.disable();
    if (good) {
      _setOutcome("Good job!", "lime");
      return;
    }
    if (bad) {
      _setOutcome("Hmmm... Maybe try a smaller grid size?", "lightsalmon");
      return;
    }
    if (perfect) {
      _setOutcome("Perfect game!", "goldenrod");
      return;
    }
    throw new Error("Uncaught endgame state");
  };

  return {
    setImage,
    setNewGame,
    endGame,
    playTurn,
    setScore,
    setErrors,
    setHints,
    setGridSizes,
  };
})();

export default manipulateDOM;
