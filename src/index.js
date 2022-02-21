import "./styles.scss";
import Game from "./Game";
import manipulateDOM from "./manipulateDOM";

// Images
import Woods from "./assets/woods.jpg";
import Beach from "./assets/beach.jpg";
import City from "./assets/city.jpg";

// Constants
const MAX_GRID_SIZE = 5;
const MIN_GRID_SIZE = 2;
const PICTURES = {
  woods: Woods,
  beach: Beach,
  city: City,
};

// round variables (with defaults)
let game;
let gridSize = 3;
let image = Woods;

// current dragged tile
let draggedKey = undefined;

// track if event listener added
let listeningForHint = false;

// Set grid size range
manipulateDOM.setGridSizes({
  min: MIN_GRID_SIZE,
  max: MAX_GRID_SIZE,
  base: gridSize,
});

// Change background picture
const setPicture = (e) => {
  image = PICTURES[e.target.value];
};
document.getElementById("picture").addEventListener("change", setPicture);

// Change grid size
const setGridSize = (e) => {
  const value = +e.target.value;
  gridSize = value > MAX_GRID_SIZE ? MAX_GRID_SIZE : value;
};
const GridSizeInput = document.getElementById("gridsize");
GridSizeInput.addEventListener("change", setGridSize);

// Start game
const resetGame = () => {
  manipulateDOM.setImage(image);
  // catch user keyboard input > MAX_GRID_SIZE
  GridSizeInput.value = gridSize;
  // instantiate game
  game = Game(gridSize);
  // add event listener to hint if first initialisation of game
  if (listeningForHint) return;
  document
    .getElementById("hint")
    .addEventListener("click", () => game.takeTurn());
  listeningForHint = true;
};
document.getElementById("newgame").addEventListener("click", resetGame);

// Add listeners for drag events
window.addEventListener("dragstart", (e) => {
  const Elem = e.target;
  if (!Elem.classList.contains("playertile")) {
    // not dragging a playable tile
    return;
  }
  // dragging a playable tile
  draggedKey = Elem.dataset.key;
});

window.addEventListener("drop", (e) => {
  const Elem = e.target;
  if (
    !Elem.classList.contains("boardtile") ||
    Elem.classList.contains("revealedtile")
  ) {
    // not dropping on unplayed tile in game area
    draggedKey = undefined;
    return;
  }
  // valid turn
  if (Elem.dataset.key !== draggedKey) {
    // wrong
    game.incrementError();
  } else {
    // right
    game.takeTurn(+Elem.dataset.key);
  }
  draggedKey = undefined;
});
