// const grid = document.querySelector('.grid');
// const scoreElement = document.querySelector('.score');
// let score = 0;

// function generateRandomState() {
//     const states = ['empty', 'number', 'hidden'];
//     return states[Math.floor(Math.random() * states.length)];
// }

// function createGrid() {
//     for (let i = 0; i < 16; i++) {
//         const cell = document.createElement('div');
//         cell.classList.add('cell');
//         const state = generateRandomState();
//         cell.dataset.state = state;

//         if (state === 'number') {
//             cell.textContent = Math.floor(Math.random() * 9) + 1;
//         }

//         cell.addEventListener('click', handleCellClick);
//         grid.appendChild(cell);
//     }
// }

// function handleCellClick(e) {
//     const cell = e.target;

//     if (cell.dataset.state === 'number' || cell.dataset.state === 'hidden') {
//         if (cell.dataset.state === 'number') {
//             score++;
//             scoreElement.textContent = score;
//         } else {
//             alert('Game Over!');
//             resetGame();
//         }
//     }
// }

// function resetGame() {
//     score = 0;
//     scoreElement.textContent = score;
//     grid.innerHTML = '';
//     createGrid();
// }

// createGrid();

class Tile {
    constructor(btn, gameState) {
        this.gameState = gameState
        this.btn = btn
        this.unset()
    }

    unset() {
        this.number = -1
        this.state = "unset"
        this.btn.textContent = ""
        // TODO change UI element
    }

    set(number) {
        this.number = number
        this.state = "set"
        this.btn.textContent = number
        // TODO change UI element
    }

    setAndHide(number) {
        this.set(number)
        setTimeout(this.hide, 500) // ms
    }

    hide() {
        this.state = "hidden"
        // TODO change UI element
    }

    select() {
        // Special handling for first tile click
        if (this.gameState.currentNumber === 1) {
            // Only check set tiles for first tile click
            if (this.state === "set") {
                // correct tile clicked hide the rest
                if (this.number === 1) {
                    this.gameState.incScore()
                    this.unset()
                    this.gameState.next()
                }

                /// incorrect tile clicked alert user to click the first tile to start game
                else {
                    // TODO: alert using UI
                }
            }
        }

        // Subsequent tile clicks
        else {
            if (this.state === "hidden") {
                if (this.number === this.gameState.currentNumber) {
                    this.gameState.incScore()
                    this.unset()
                    this.gameState.hideTiles()
                    this.gameState.next()
                }
            }
        }
    }
}

class GameState {
    constructor(leadingCount, max, score, startNumber) {
        this.randomArray = new RandomArray(leadingCount, max)
        this.score = score
        this.max = max
        this.leadingNumber = startNumber
        this.currentNumber = startNumber
        this.tiles = []
    }

    init() {
        let grid = document.getElementById("grid")
        for (let i = 0; i < this.max; i++) {
            let btn = grid.children[i]
            this.tiles.push(new Tile(btn, this))
        }

        for (const tileIndex of this.randomArray.array) {
            let tile = this.tiles[tileIndex]
            tile.set(this.leadingNumber)
            this.leadingNumber += 1
        }
    }

    next() {
        const nextTileIndex = this.randomArray.next()
        this.tiles[nextTileIndex].setAndHide(this.leadingNumber)
        this.leadingNumber += 1
    }

    incScore() {
        this.score += 1
        // TODO: change UI element
    }
    
    hideTiles() {
        for (const tile in tiles) {
            if (tile.state === "set") {
                tile.hide()
            }
        }
    }
}

class RandomArray {
    constructor(length, max) {
        this.length = length;
        this.max = max;
        this.array = [];
        this.init();
    }

    init() {
        while (this.array.length < this.length) {
            const randomNumber = this.getRandomNumber();
            if (!this.array.includes(randomNumber)) {
                this.array.push(randomNumber);
            }
        }
    }

    next() {
        let nextNumber = this.getRandomNumber();
        while (this.array.includes(nextNumber)) {
            nextNumber = this.getRandomNumber();
        }
        this.array.shift();
        this.array.push(nextNumber);
    }

    getRandomNumber() {
        return Math.floor(Math.random() * this.max)
    }
}

// Usage example
game = new GameState(5, 9, 0, 1)
game.init()
