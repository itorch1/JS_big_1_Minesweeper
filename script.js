document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const flagsEl = document.querySelector('#flags');
    let width = 10;
    let bombAmount = 20;
    let flags = 0;
    let matches = 0;
    let squares = [];
    let isGameOver = false;

    flagsEl.innerText = bombAmount;

    // Create board
    function createBoard() {
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width*width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
        console.log(shuffledArray)

        for (let i=0; i<width*width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.className = shuffledArray[i];
            grid.appendChild(square);
            squares.push(square);

            square.addEventListener('click', () => click(square));
            square.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                addFlag(square);
            });
        }

        // Add numbers
        for (let i=0; i<squares.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width - 1);
            const isTopEdge = (i - width < 0);
            const isBotEdge = (i + width >= squares.length);

            if (squares[i].classList.contains('valid')) {
                if (!isLeftEdge && squares[i-1].classList.contains('bomb')) total++; // W
                if (!isLeftEdge && !isBotEdge && squares[i+width-1].classList.contains('bomb')) total++; // SW
                if (!isBotEdge && squares[i+width].classList.contains('bomb')) total++; // S
                if (!isBotEdge && !isRightEdge && squares[i+width+1].classList.contains('bomb')) total++; // SE
                if (!isRightEdge && squares[i+1].classList.contains('bomb')) total++; // E
                if (!isRightEdge && !isTopEdge && squares[i-width+1].classList.contains('bomb')) total++; // NE
                if (!isTopEdge && squares[i-width].classList.contains('bomb')) total++; // N
                if (!isTopEdge && !isLeftEdge && squares[i-width-1].classList.contains('bomb')) total++; //NW

                squares[i].setAttribute('data', total);
            }
        }
    }
    createBoard();

    function addFlag (square) {
        if (isGameOver) return;
        if (!square.classList.contains('checked') && flags < bombAmount) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag');
                square.innerText = '🚩';
                flags++;
                if (square.classList.contains('flag') && square.classList.contains('bomb'))
                    matches++;
                checkForWin();
            } else {
                if (square.classList.contains('flag') && square.classList.contains('bomb'))
                    matches--;
                square.classList.remove('flag');
                square.innerText = '';
                flags--;
            }
            flagsEl.innerText = bombAmount - flags;
        }
    }

    function click(square) {
        const currentId = +square.id;
        if (isGameOver) return;
        if (square.classList.contains('checked') || square.classList.contains('flag')) return;
        if (square.classList.contains('bomb')) {
            gameOver();
        } else {
            const total = square.getAttribute('data');
            if (total != 0) {
                square.classList.add('checked');
                square.innerText = total;
                return;
            }
            square.classList.add('checked');
            const isLeftEdge = (currentId % width === 0);
            const isRightEdge = (currentId % width === width - 1);
            const isTopEdge = (currentId - width < 0);
            const isBotEdge = (currentId + width >= squares.length);

            setTimeout(() => {
            if (!isLeftEdge) {
                const newId = currentId - 1;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (!isLeftEdge && !isBotEdge) {
                const newId = currentId + width - 1;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (!isBotEdge) {
                const newId = currentId + width;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (!isBotEdge && !isRightEdge) {
                const newId = currentId + width + 1;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (!isRightEdge) {
                const newId = currentId + 1;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (!isRightEdge && !isTopEdge) {
                const newId = currentId - width + 1;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (!isTopEdge) {
                const newId = currentId - width;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (!isTopEdge && !isLeftEdge) {
                const newId = currentId - width - 1;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
        }, 30)

        }
    }

    function gameOver() {
        console.log('Game Over');
        isGameOver = true;
        document.body.style.backgroundColor = '#ff6767'

        squares.forEach(square => {
            if (square.classList.contains('bomb'))
                square.innerText = '💣';
        })
    }

    function checkForWin() {
        if (matches === bombAmount) {
            console.log('YOU WON!');
            isGameOver = true;
            document.body.style.backgroundColor = 'rgb(11, 179, 75)';
        }
    }
})