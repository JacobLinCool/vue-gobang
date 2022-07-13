export enum BoardState {
    Empty,
    Black,
    White,
}

export const cols = 15;
export const rows = 15;

/**
 * Check if there is a winner.
 * @param board The board to check.
 * @returns The winner, or BoardState.Empty if there is no winner. And the stones.
 */
export function check_winner(board: BoardState[]) {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === BoardState.Empty) {
            continue;
        }

        const state = board[i];
        const [x, y] = [i % cols, Math.floor(i / cols)];

        // check -
        if (x < cols - 4) {
            const stones = [i];
            for (let j = 1; j < 5; j++) {
                if (board[i + j] === state) {
                    stones.push(i + j);
                } else {
                    break;
                }
            }
            if (stones.length === 5) {
                return { winner: state, stones };
            }
        }

        // check |
        if (y < rows - 4) {
            const stones = [i];
            for (let j = 1; j < 5; j++) {
                if (board[(y + j) * cols + x] === state) {
                    stones.push((y + j) * cols + x);
                } else {
                    break;
                }
            }
            if (stones.length === 5) {
                return { winner: state, stones };
            }
        }

        // check \
        if (x < cols - 4 && y < rows - 4) {
            const stones = [i];
            for (let j = 1; j < 5; j++) {
                if (board[(y + j) * cols + x + j] === state) {
                    stones.push((y + j) * cols + x + j);
                } else {
                    break;
                }
            }
            if (stones.length === 5) {
                return { winner: state, stones };
            }
        }

        // check /
        if (x > 3 && y < rows - 4) {
            const stones = [i];
            for (let j = 1; j < 5; j++) {
                if (board[(y + j) * cols + x - j] === state) {
                    stones.push((y + j) * cols + x - j);
                } else {
                    break;
                }
            }
            if (stones.length === 5) {
                return { winner: state, stones };
            }
        }
    }

    return { winner: BoardState.Empty, stones: [] };
}
