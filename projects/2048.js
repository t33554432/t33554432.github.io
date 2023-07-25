let state, gravity, highscore, board, anim, numCols, currentDirection, currentScore, currenthighile, hightile;

function setup() {

    //Create the canvas
    var canvas = createCanvas(800, 800);
    canvas.parent('sketch-holder');
    windowResized();
    textAlign(CENTER, CENTER);

    state = 'menu';
    numCols = [color('#edeaed'), color('#ece5dc'), color('#ebe0ca'), color('#e8b481'), color('#e89a6c'), color('#e68366'), 
    color('#e46b49'), color('#e46848'), color('#e9d17f'), color('#e8cd70'), color('#e6c964'), color('#eec22e')];

    if(!localStorage.getItem('2048highScore')) {
        localStorage.setItem('2048highScore', 0);
        highscore = 0;
    } else {
        highscore = localStorage.getItem('2048highScore');
    }

    if(!localStorage.getItem('2048highTile')) {
        localStorage.setItem('2048highTile', 0);
        hightile = 0;
    } else {
        hightile = localStorage.getItem('2048highTile');
    }

    resetBoard();

}

function windowResized() {
    // Resize the canvas to fit the div
    var holderWidth = document.getElementById('sketch-holder').offsetWidth;
    resizeCanvas(holderWidth * 0.95, holderWidth * 0.95 * 5.2 / 4);
    gravity = 15 * width / 800;
}
  
// Call windowResized() whenever the window is resized
window.addEventListener('resize', windowResized);

function draw() {

    switch(state) {
        case 'menu':
            menuDraw();
            break;
        case 'game':
            gameDraw();
            break;
    }

}

function mousePressed() {

    switch(state) {
        case 'menu':
            menuPressed();
            break;
        case 'game':
            gamePressed();
            break;
    }
    
}

function keyPressed() {

    switch(state) {
        case 'game':
            gameTyped();
            break;
    }

}

function menuDraw() {

    background(255);
    let inc = width / 5;

    drawBoard();

    strokeWeight(inc / 30);
    stroke(0);
    fill(220);
    rect(inc, inc, 3 * inc, inc, 10);
    rect(inc, 3 * inc, 3 * inc, inc, 10);

    noStroke();
    fill(0);
    textSize(inc * 0.27);
    text('Highscore', 2 * inc, 1.25 * inc);
    text(highscore, 3.25 * inc, 1.25 * inc);
    text('Highest Tile', 2 * inc, 1.75 * inc);
    text(2 ** hightile, 3.25 * inc, 1.75 * inc);
    textSize(inc / 2);
    text('Play', 2.5 * inc, 3.5 * inc);

}

function menuPressed() {

    let inc = width / 5;
    if(checkRect(inc, 3 * inc, 3 * inc, inc)) {
        state = 'game';
        resetBoard();
    }

}

function gameDraw() {

    background(255);
    drawBoard();

    let inc = width / 64

    //Score
    fill(220);
    stroke(0);
    strokeWeight(inc * 0.3);
    rect(inc, 65 * inc, 14 * inc, 14 * inc, 10);
    noStroke();
    fill(0);
    textSize(2.8 * inc);
    text('Score', inc * 8, inc * (64 + 16 / 3));
    text(currentScore, inc * 8, inc * (64 + 32 / 3));

    //High Score
    fill(220);
    stroke(0);
    rect(17 * inc, 65 * inc, 14 * inc, 14 * inc, 10);
    noStroke();
    fill(0);
    text('Highscore', inc * 24, inc * (64 + 16 / 3));
    text(highscore, inc * 24, inc * (64 + 32 / 3));

    //Back button
    fill(220);
    stroke(0);
    rect(49 * inc, 65 * inc, 14 * inc, 14 * inc, 10);
    noStroke();
    fill(0);
    text('Back', inc * 56, inc * 72);
    text(currentScore, inc * 8, inc * (64 + 32 / 3));

    //Movement buttons
    fill(220);
    stroke(0);
    ellipse(40 * inc, 67 * inc, 6 * inc);
    ellipse(40 * inc, 77 * inc, 6 * inc);
    ellipse(35 * inc, 72 * inc, 6 * inc);
    ellipse(45 * inc, 72 * inc, 6 * inc);
    noStroke();
    fill(0);
    textSize(3 * inc);
    text('↑', 40 * inc, 67 * inc);
    text('↓', 40 * inc, 77 * inc);
    text('←', 35 * inc, 72 * inc);
    text('→', 45 * inc, 72 * inc);

}

function gamePressed() {

    let inc = width / 64;

    if(checkRect(49 * inc, 65 * inc, 14 * inc, 14 * inc)) {

        if(currentScore > highscore) {
            highscore = currentScore;
            localStorage.setItem('2048highScore', highscore);
        }
        if(currenthightile > hightile) {
            hightile = currenthightile;
            localStorage.setItem('2048highTile', hightile);
        }
        state = 'menu';
        resetBoard();
    }

    if(anim[0] > 60 && anim[0] < 121) {
        if(checkRect(inc * (16 + (anim[0] - 61)), inc * 33, 32 * inc, 14 * inc)) {
            resetBoard();
        }
    }

    if(anim[0] <= 0) {
        if(checkEllipse(40 * inc, 67 * inc, 3 * inc)) {
            currentDirection = [createVector(0, -1), -4];
            moveBoard();
            return;
        }
        if(checkEllipse(40 * inc, 77 * inc, 3 * inc)) {
            currentDirection = [createVector(0, 1), 4];
            moveBoard();
            return;
        }
        if(checkEllipse(35 * inc, 72 * inc, 3 * inc)) {
            currentDirection = [createVector(-1, 0), -1];
            moveBoard();
            return;
        }
        if(checkEllipse(45 * inc, 72 * inc, 3 * inc)) {
            currentDirection = [createVector(1, 0), 1];
            moveBoard();
            return;
        }
    }

}

function gameTyped() {

    if(anim[0] > 0) {
        return;
    }

    if(keyCode == 87 || keyCode == 38) {
        currentDirection = [createVector(0, -1), -4];
        moveBoard();
    }
    if(keyCode == 65 || keyCode == 37) {
        currentDirection = [createVector(-1, 0), -1];
        moveBoard();
    }
    if(keyCode == 83 || keyCode == 40) {
        currentDirection = [createVector(0, 1), 4];
        moveBoard();
    }
    if(keyCode == 68 || keyCode == 39) {
        currentDirection = [createVector(1, 0), 1];
        moveBoard();
    }

}

function drawBoard() {

    let inc = width / 64;

    fill(200);
    noStroke();
    for(let x = 0; x < 4; x++) {
        for(let y = 0; y < 4; y++) {
            rect((16 * x + 1) * inc, (16 * y + 1) * inc, 14 * inc, 14 * inc, 10);
        }
    }

    let currentBoard = board.split('');

    currentBoard.forEach( (e,i) => {
        let x = (i % 4);
        let y = floor(i / 4);
        if(e != '-') {
            fill(numCols[min(11, e)]);
            rect((16 * x + 1) * inc, (16 * y + 1) * inc, 14 * inc, 14 * inc, 10);
            if(e > 2) {
                fill('#faf7f2');
            } else {
                fill('#756f65');
            }
            if(2 ** e < 1000) {
                textSize(inc * 7.5);
            } else {
                textSize(inc * 6);
            }
            text(2 ** e, (16 * x + 8) * inc, (16 * y + 8) * inc);
        }
    });

    if(anim[0] > 0 && anim[0] < 61) {
        anim[0] -= gravity;
        let currentDist = currentDirection[0].copy().mult(16 * inc * ((60 - anim[0]) / 60));

        anim[1].forEach(cell => {
            let x = (cell[0] % 4);
            let y = floor(cell[0] / 4);
            fill(numCols[min(11, cell[1])]);
            rect((16 * x + 1) * inc + currentDist.x, (16 * y + 1) * inc + currentDist.y, 14 * inc, 14 * inc, 10);
            if(cell[1] > 2) {
                fill('#faf7f2');
            } else {
                fill('#756f65');
            }
            if(2 ** cell[1] < 1000) {
                textSize(inc * 7.5);
            } else {
                textSize(inc * 6);
            }
            text(2 ** cell[1], (16 * x + 8) * inc + currentDist.x, (16 * y + 8) * inc + currentDist.y);
            if(anim[0] <= 0) {
                if(currentBoard[cell[0] + currentDirection[1]] == '-') {
                    currentBoard[cell[0] + currentDirection[1]] = cell[1];
                } else {
                    currentBoard[cell[0] + currentDirection[1]] = str(parseInt(cell[1]) + 1);
                    if(parseInt(cell[1]) + 1 > currenthightile) {
                        currenthightile = parseInt(cell[1]) + 1;
                    }
                    currentScore += 2 ** (parseInt(cell[1]) + 1);
                }
            }
        });

        board = currentBoard.join('');
        if(anim[0] <= 0) {
            anim = [0, []];
            moveBoard();
            if(anim[0] <= 0) {
                if(!addRandomPiece() && checkForGameOver()) {
                    if(state == 'game') {
                        anim = [120, []];
                        if(currentScore > highscore) {
                            highscore = currentScore;
                            localStorage.setItem('2048highScore', highscore);
                        }
                        if(currenthightile > hightile) {
                            hightile = currenthightile;
                            localStorage.setItem('2048highTile', hightile);
                        }
                    } else {
                        resetBoard();
                    }
                } else {
                    if(state == 'menu') {
                        randomiseDirection();
                        moveBoard();
                    }
                }
            }
        }
    }
    
    if(anim[0] > 60 && anim[0] < 121) {
        anim[0] -= gravity / 5;
        if(anim[0] < 61) {
            anim[0] = 61;
        }
        fill(220);
        stroke(0);
        strokeWeight(inc);
        rect(inc * (16 - (anim[0] - 61)), inc * 17, 32 * inc, 14 * inc, 10);
        rect(inc * (16 + (anim[0] - 61)), inc * 33, 32 * inc, 14 * inc, 10);
        noStroke();
        fill(0);
        textSize(12 * inc);
        text(currentScore, inc * (32 - (anim[0] - 61)), inc * 24);
        textSize(10 * inc);
        text('Retry', inc * (32 + (anim[0] - 61)), inc * 40);
    }

}

function moveBoard() {

    let currentBoard = board.split('');
    let moving = [];
    currentBoard.forEach((e, i) => {
        if(e != '-') {
            let nx = i % 4 + currentDirection[0].x;
            let ny = floor(i / 4) + currentDirection[0].y;
            if(nx >= 0 && nx <= 3 && ny >= 0 && ny <= 3) {
                let newIndex = 4 * ny + nx;
                let newCell = currentBoard[newIndex];
                if(newCell == '-' || newCell == e) {
                    moving.push([i, e]);
                }
            }
        }
    });
    moving.forEach(e => {
        currentBoard[e[0]] = '-';
    });
    board = currentBoard.join('');
    if(moving.length > 0) {
        anim = [60, moving];
    } else {
        if(state == 'menu' && !checkForGameOver()) {
            addRandomPiece();
            randomiseDirection();
            moveBoard();
        }
    }

}

function checkRect(x, y, w, h) {

    let c1 = (mouseX >= x);
    let c2 = (mouseX <= x + w);
    let c3 = (mouseY >= y);
    let c4 = (mouseY <= y + h);
    return c1 && c2 && c3 && c4;

}

function checkEllipse(x, y, r) {

    let dist = sqrt( (x - mouseX) ** 2 + (y - mouseY) ** 2);
    return dist <= r;

}

function resetBoard() {

    board = '----------------';
    addRandomPiece();
    anim = [0, []];
    currentScore = 0;
    currenthightile = 0;
    if(state == 'menu') {
        randomiseDirection();
        moveBoard();
    }

}

function addRandomPiece() {

    let currentBoard = board.split('');
    let possible = [];
    currentBoard.forEach((e,i) => {
        if(e == '-') {
            possible.push(i);
        }
    });
    if(possible.length > 0) {
        let value = getNewValue(currentScore);
        currentBoard[possible[floor(random(possible.length))]] = value;
        board = currentBoard.join('');
        if(possible.length > 1) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }

}

function checkForGameOver() {
    
    let currentBoard = board.split('');
    let move = false;
    for(let x = 0; x < 3; x++) {
        for(let y = 0; y < 4; y++) {
            let i1 = 4 * y + x;
            let i2 = 4 * y + x + 1;
            if(currentBoard[i1] == currentBoard[i2]) {
                move = true;
            }
            if(currentBoard[i1] == '-' || currentBoard[i2] == '-') {
                move = true;
            }
        }
    }
    for(let y = 0; y < 3; y++) {
        for(let x = 0;x < 4; x++) {
            let i1 = 4 * y + x;
            let i2 = 4 * y + x + 4;
            if(currentBoard[i1] == currentBoard[i2]) {
                move = true;
            }
        }
    }
    return !move;

}

function randomiseDirection() {

    let options = [
        [createVector(0, -1), -4],
        [createVector(0, 1), 4],
        [createVector(-1, 0), -1],
        [createVector(1, 0), 1]
    ];
    let ran = floor(random(4));
    currentDirection = options[ran];

}

function getNewValue(score) {
    let mean = (Math.log(score) / Math.log(10)) / 3;
    let sd = 2;
    let result = randomGaussian(mean, sd);
    return max(floor(result), 0);
}