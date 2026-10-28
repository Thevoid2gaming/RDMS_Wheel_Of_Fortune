
let answer = "";
let guessedLetters = [];

fetch("wof.json")
    .then(response => response.json())
    .then(puzzles => {
        // fetch random puzzle from json
        let puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
        // make user input uppercase
        answer = puzzle.answer.toUpperCase();
        //get random category to display in the category div
        document.getElementById("category").textContent =
            "Category: " + puzzle.category;
        document.getElementById("hint").textContent =
            "Hint: " + puzzle.hint;

        let board = document.getElementById("board");
        let tiles = board.querySelectorAll("rect");

        // The first rectangles are the outer frame, so skip them.
        let squares = Array.from(tiles).slice(2);

        let letters = answer.replace(/ /g, "");

        squares.forEach((square, index) => {
            if (index < letters.length) {
                square.dataset.letter = letters[index];
                square.dataset.used = "true";
            }
        });
            // l
        document.addEventListener("keydown", function(event) {
            let letter = event.key.toUpperCase();

            if (!/^[A-Z]$/.test(letter)) {
                return;
            }

            if (guessedLetters.includes(letter)) {
                document.getElementById("message").textContent =
                    "You already guessed " + letter + "!";

                return;
            }

            guessedLetters.push(letter);

            let found = false;

            squares.forEach(square => {
                if (square.dataset.letter === letter) {
                    square.setAttribute("fill", "#00a651");

                    let text = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "text"
                    );

                    text.setAttribute("x",
                        Number(square.getAttribute("x")) +
                        Number(square.getAttribute("width")) / 2);

                    text.setAttribute("y",
                        Number(square.getAttribute("y")) +
                        Number(square.getAttribute("height")) / 2 + 12);

                    text.setAttribute("text-anchor", "middle");
                    text.setAttribute("font-size", "40");
                    text.setAttribute("font-weight", "bold");
                    text.setAttribute("fill", "#101820");
                    text.textContent = letter;

                    board.appendChild(text);
                    found = true;
                }
            });

            if (found) {
                document.getElementById("message").textContent =
                    "Correct! You guessed " + letter + ".";
            } else {
                document.getElementById("message").textContent =
                    "Sorry, " + letter + " is not in the puzzle.";
                document.getElementById("wrong").textcontent = 
                "Wrong guesses:" + letter +",";
            }
        });
    })
    .catch(error => {
        document.getElementById("message").textContent =
            "Could not load wof.json.";
        console.error(error);
    });
