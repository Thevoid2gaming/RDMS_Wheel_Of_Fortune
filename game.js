
window.gameState = {
    canSpin: true,
    canGuess: false,
    currentValue: 0,
    activePlayer: 1,
    scores: { 1: 0, 2: 0 }
};

let answer = "";
let guessedLetters = [];
let squares = [];

function switchTurn() {
    window.gameState.activePlayer = window.gameState.activePlayer === 1 ? 2 : 1;
    window.gameState.canSpin = true;
    window.gameState.canGuess = false;

    document.querySelectorAll(".player-card").forEach(card => card.classList.remove("active"));
    document.getElementById(`player-${window.gameState.activePlayer}-card`).classList.add("active");
    document.getElementById("message").textContent = `Player ${window.gameState.activePlayer}'s turn! Spin the wheel.`;
}

function updateScoreboard() {
    document.getElementById("player-1-score").textContent = `$${window.gameState.scores[1]}`;
    document.getElementById("player-2-score").textContent = `$${window.gameState.scores[2]}`;
}

// Attach wheel listener
document.querySelectorAll('.ui-wheel-of-fortune').forEach(el => {
    wheelOfFortune(el, (resultValue) => {
        const numericValue = parseInt(resultValue?.replace(/[^0-9]/g, ""), 10) || 1000;
        window.gameState.currentValue = numericValue;
        window.gameState.canGuess = true;
        document.getElementById("message").textContent =
            `Player ${window.gameState.activePlayer} spun ${resultValue}! Guess a letter on your keyboard.`;
    });
});

// Load puzzle data
fetch("WOF.json")
    .then(response => response.json())
    .then(puzzles => {
        let puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

        answer = puzzle.answer.toUpperCase();

        document.getElementById("category").textContent = "Category: " + puzzle.category;
        document.getElementById("hint").textContent = "Hint: " + puzzle.hint;

        const board = document.getElementById("board");
        const allTiles = board.querySelectorAll("#puzzle-tiles rect");

        // Filter out border/padding teal rects
        squares = Array.from(allTiles)
            .filter(sq => sq.getAttribute("fill") !== "teal")
            .sort((a, b) => {
                let yA = parseFloat(a.getAttribute("y"));
                let yB = parseFloat(b.getAttribute("y"));

                if (yA !== yB) {
                    return yA - yB;
                }

                return parseFloat(a.getAttribute("x")) -
                       parseFloat(b.getAttribute("x"));
            });

        let letters = answer.replace(/ /g, "");

        squares.forEach((square, index) => {
            if (index < letters.length) {
                square.dataset.letter = letters[index];
                square.dataset.used = "true";
            }
        });

        document.addEventListener("keydown", function(event) {
            if (!window.gameState.canGuess) {
                return;
            }

            let letter = event.key.toUpperCase();

            if (!/^[A-Z]$/.test(letter)) {
                return;
            }

            if (guessedLetters.includes(letter)) {
                document.getElementById("message").textContent = `You already guessed ${letter}!`;
                return;
            }

            guessedLetters.push(letter);

            let foundCount = 0;

            squares.forEach(square => {
                if (square.dataset.letter === letter) {
                    square.setAttribute("fill", "#00a651");

                    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    text.setAttribute("x", Number(square.getAttribute("x")) + Number(square.getAttribute("width")) / 2);
                    text.setAttribute("y", Number(square.getAttribute("y")) + Number(square.getAttribute("height")) / 2 + 12);
                    text.setAttribute("text-anchor", "middle");
                    text.setAttribute("font-size", "40");
                    text.setAttribute("font-weight", "bold");
                    text.setAttribute("fill", "#101820");
                    text.textContent = letter;

                    board.appendChild(text);
                    foundCount++;
                }
            });

            if (foundCount > 0) {
                const earned = window.gameState.currentValue * foundCount;
                window.gameState.scores[window.gameState.activePlayer] += earned;
                updateScoreboard();

                const allRevealed = squares
                    .filter(sq => sq.dataset.used === "true")
                    .every(sq => guessedLetters.includes(sq.dataset.letter));

                if (allRevealed) {
                    document.getElementById("message").textContent =
                        `🎉 Player ${window.gameState.activePlayer} solved the puzzle and wins!`;
                    window.gameState.canGuess = false;
                    window.gameState.canSpin = false;
                    return;
                }

                document.getElementById("message").textContent =
                    `Correct! ${foundCount} '${letter}' found (+${earned}). Player ${window.gameState.activePlayer}, spin again!`;

                window.gameState.canGuess = false;
                window.gameState.canSpin = true;

            } else {
                const wrongList = guessedLetters.filter(l => !answer.includes(l));
                document.getElementById("wrong").textContent = "Wrong guesses: " + wrongList.join(", ");
                document.getElementById("message").textContent = `Sorry, ${letter} is not in the puzzle.`;
                switchTurn();
            }
        });
    })
    .catch(error => {
        document.getElementById("message").textContent = "Could not load WOF.json.";
        console.error(error);
    });

