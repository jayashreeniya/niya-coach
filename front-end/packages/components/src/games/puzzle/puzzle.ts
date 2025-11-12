
function range(max: number) {
  const array = [];

  for (let i = 0; i < max; i++) {
    array[i] = i;
  }

  return array;
}

export function createPuzzle(size: number) {
  const board = range(size * size);

  const puzzle = {
    size,
    board,
    empty: Math.floor(Math.random() * (size * size - 1)),
  };

  return shuffleBoard(puzzle);
}

function shuffleBoard(puzzle: any) {
  let previous: any = null;

  for (let i = 0; i < 1000; i++) {
    const moves = movableSquares(puzzle).filter(square => square !== previous);
    const square = moves[Math.floor(Math.random() * (moves.length - 1))];

    // eslint-disable-next-line no-param-reassign
    puzzle = move(puzzle, square);
    previous = square;
  }

  return puzzle;
}

export function movableSquares(puzzle: any) {
  const { size, board, empty } = puzzle;

  const emptyIndex = getIndex(puzzle, empty);

  const adjacent = [
    emptyIndex - size,
    emptyIndex + size,
    emptyIndex % size !== 0 ? emptyIndex - 1 : null,
    emptyIndex % size !== size - 1 ? emptyIndex + 1 : null,
  ]
    .filter(index => index !== null && index >= 0 && index < size * size)
    .map(index => board[index]);

  return adjacent;
}

export function availableMove(puzzle: any, square: any) {
  const { size, empty } = puzzle;

  const squareIndex = getIndex(puzzle, square);
  const emptyIndex = getIndex(puzzle, empty);

  const canMove = movableSquares(puzzle).includes(square);

  if (canMove && squareIndex - size === emptyIndex) return 'up';
  if (canMove && squareIndex + size === emptyIndex) return 'down';
  if (canMove && squareIndex - 1 === emptyIndex) return 'left';
  if (canMove && squareIndex + 1 === emptyIndex) return 'right';

  return 'none';
}

export function getIndex(puzzle: any, square: any) {
  const { board } = puzzle;

  return board.indexOf(square);
}

export function move(puzzle: any, square: any) {
  const { board, empty } = puzzle;

  const squareIndex = getIndex(puzzle, square);
  const emptyIndex = getIndex(puzzle, empty);

  const copy = board.slice();
  copy[emptyIndex] = board[squareIndex];
  copy[squareIndex] = board[emptyIndex];

  return {
    ...puzzle,
    board: copy,
  };
}

export function isSolved(puzzle: any) {
  const { board } = puzzle;

  return board.every((square: any, index: number) => square === index);
}

/**
 * Prints the puzzle board to the console.
 *
 * @param {Puzzle} puzzle
 */
export function print(puzzle: any) {
  const { size, board } = puzzle;

  for (let i = 0; i < size; i++) {
    console.log(board.slice(i * size, (i + 1) * size).join(', '));
  }
}