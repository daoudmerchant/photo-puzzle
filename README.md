# [Live](https://daoudmerchant.github.io/photo-puzzle/)

## Brief

A simple photo puzzle app with click to drag, built with vanilla JavaScript.

## Disclaimer

Partly because I've mostly been working with React recently, partly because the brief looked fun, I spent longer than 3hrs on my solution (2 sessions on the code and a third on cleaning, testing and writing up). I hope that the 'suggested' 3hrs permits me to submit the code as-is, and that the code base isn't too complicated for a hypothetical interview.
Please also excuse the lack of commit history; I didn't realise I was committing to `photo-puzzle-game` when all my code was in `photo-puzzle-game/starter-kit`, so I had to initialise the starter kit in Git and push that to my repo after finishing. Please review my commit histories on my other projects for a feel of how I commit.

## Functionality

- [x] One variable instantiates games of any size (both grid tiles and player tiles)
- [x] One image file is manipulated client-side for games of any size
- [x] Hint button
- [x] Score, error and hint counters
- [x] Basic 'verdict' at game over
- [x] Some test coverage

## Future improvements (excluding further functionalities mentioned in brief)

- [ ] Further separate concerns
  - At the moment both `index.js` and `Game.js` access `manipulateDOM.js` just to keep the DOM manipulation logic all in one file for readability, but I'm aware of the code smell. For a start, I could separate (or at least namespace) methods used to specifically update the page related to the current game (e.g. tile deletion) and related to the current session (e.g. permitted grid size range).
- [ ] Further test coverage
  - In the spirit of not installing further dependencies (and to avoid spending too long on the project), I only tested `utils.js` as very soon I'd need something like [jestdom](https://github.com/testing-library/jest-dom) to continue.
- [ ] Refactor to TypeScript
  - Some (incomplete) error handling has been included, the need for most of which would be eliminated with a refactor to TypeScript.
- [ ] Improved presentation / responsiveness
  - Choices had to be made with the time, so the app currently breaks at screen sizes below about 550px. As it is, for this to work on mobile devices it would need to handle the lack of native browser drag event (something I achieved in React with [React DnD](https://react-dnd.github.io/react-dnd/about)'s touch backend in my [Battleships](https://github.com/daoudmerchant/battleships/) app).

## Concept

The JavaScript consists of 4 files:

- `index.js` - the main file including game defaults, initialisation of the game and drag event listeners
- `Game.js` - a 'game' factory function
- `manipulateDOM.js` - a module exposing methods for updating the DOM using scoped element queries
- `utils.js`

For simplicity, each board tile and player tile contains a `data-key` property. If a drag event begins on a player tile and ends on an unplayed board tile, the tile is played and the score incremented if both `data-key`s match or an error is recorded if they don't.

Understanding that I couldn't make a 'perfect' response without putting in significant time, I decided to focus on **game logic** and **scalability**.

### Game Logic

I wrote the `takeTurn` function with an optional parameter function that will randomly generate a key if not provided, serving as 'hint' functionality. Score, errors and hints are counted (and displayed) in order to provide a simple 'verdict' on the success of the player's game at the end.

### Scalability

Very quickly after beginning, I came to two conclusions to provide scalability:

- **One variable** should dynamically determine the **grid size** of the game area (and subsequent contity of player tiles) to allow for theoretically infinite difficulty
- **One image file** should dynamically fill both the game area and tiles client-side, not only as the grid size is now infinitely variable but to allow future functionality such as game generation from a player-uploaded image file etc.

As such, a small set of form controls allow selection of an image (for now from three low-resolution square images) and a grid size (within minimum and maximum values declared in `index.js`) before the game is initiated.

> #### `background-position`
>
> The solution for this implementation with one image file was simple for the game area - setting the image as the background for the `div` and subsequently filling with opaque squares to hide it which turn transparent upon correct turns - but I feel I should explain my solution for the `background-position` of the player tiles generated in `getBackgroundPositions` in `utils.js` and applied to the element on line 120 of `manipulateDOM.js`, if only to prove that I've understood what I'm doing(!)
>
> `background-position` percentages place the percentage coordinate of the image at the percentage coordinate of the element. If I was, for example, tiling a 3x3 grid, I would first expand the image to 3x its size (`background-size: 300%`), and then offset each tile from one horizontal side and one vertical side to 'expose' only the corresponding fraction of the picture, i.e.:
>
> ```
> -------
> |1|2|3|
> -------
> |4|5|6|
> -------
> |7|8|9|
> -------
> ```
>
> Here, square 1 would have the _left_ side of the image aligned with the _left_ side of the element and the _top_ side of the image aligned with the _top_ side of the element (therefore `background-position: left 0% top 0%`). Square 9 would therefore be `background-position: left 100% top 100%` so that the right and bottom sides are aligned. For piece 5, `background-position: left 50% top 50%` effectively states that the _very centre_ of the picture should be aligned with the _very centre_ of the element, with the scaling of 300% exposing only that middle tile's-worth of the picture. As such, the equations in pseudo-code are:
>
> i = grid square number from the above diagram
>
> grid length = the number of tiles across any axis (e.g. 3)
>
> percentage = (100 / (grid length - 1)) (e.g. 50% if grid length = 3)
>
> `background-position: left ${`_(the remainder of the grid length in to i) times the percentage_`}% top ${`_(i divided by the grid length, then rounded down to the nearest integer) times the percentage_`}%`
>
> I decided to put this logic separately in `getBackgroundPositions` in `utils.js` and return the complete string. This way, the complete CSS value would be exposed for testing (`utils.test.js`), but I could also have returned an object with the two calculations assigned to `left` and `top` keys before inserting in to a template string on line 120 of `manipulateDOM`. One of many possible refactoring choices.

## Conclusion

This was a really fun little puzzle. I love this kind of problem solving!

Thank you for your time, and I welcome all suggestions / comments.
