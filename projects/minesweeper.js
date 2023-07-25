let state, anim, gridSize, bombCount, board, gameOver, startTime, endTime, clickMode, flags;

function setup() {

    var canvas = createCanvas(800,800);
    canvas.parent('sketch-holder');
    canvas = document.querySelector('canvas');
    canvas.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
    windowResized();
    textAlign(CENTER, CENTER);
    state = 'menu';
    gridSize = 8;
    bombCount = 16;
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

function menuDraw() {

    background(255);
    drawBoard();
    let inc = width / 5;
    strokeWeight(inc * 0.03);
    stroke(0);
    fill(220);
    rect(inc, inc, 3 * inc, inc, 10);
    rect(inc, 3 * inc, 3 * inc, inc, 10);
    noStroke();
    fill(0);
    textSize(inc * 0.4);
    text('Start', 2.5 * inc, 1.5 * inc);
    textSize(inc * 0.2);
    text('Size: ' + gridSize + ' x ' + gridSize, 1.75 * inc, 3.25 * inc);
    text('-', 1.375 * inc, 3.75 * inc);
    text('+', 2.125 * inc, 3.75 * inc);
    text('Bombs: ' + bombCount, 3.25 * inc, 3.25 * inc);
    text('-', 2.875 * inc, 3.75 * inc);
    text('+', 3.625 * inc, 3.75 * inc);

}

function menuPressed() {

    let inc = width / 5;

    if(checkRect(inc, inc, 3 * inc, inc)) {
        state = 'game';
        resetBoard();
    }

    if(checkRect(inc, 3.5 * inc, 0.75 * inc, 0.5 * inc)) {
        gridSize = max(4, gridSize - 1);
        bombCount = min(bombCount, gridSize * gridSize - 1);
        resetBoard();
    }

    if(checkRect(1.75 * inc, 3.5 * inc, 0.75 * inc, 0.5 * inc)) {
        gridSize = min(100, gridSize + 1);
        resetBoard();
    }

    if(checkRect(2.5 * inc, 3.5 * inc, 0.75 * inc, 0.5 * inc)) {
        bombCount = max(1, bombCount - 1);
    }

    if(checkRect(3.25 * inc, 3.5 * inc, 0.75 * inc, 0.5 * inc)) {
        bombCount = bombCount + 1;
        gridSize = max(gridSize, ceil(sqrt(bombCount + 1)));
    }

}

function gameDraw() {

    background(255);
    let inc = width / 64;

    //Back button
    strokeWeight(inc * 0.5);
    stroke(0);
    fill(220);
    rect(inc, 65 * inc, 14 * inc, 14 * inc, 10);
    noStroke();
    fill(0);
    textSize(inc * 4);
    text('Back', 8 * inc, 72 * inc);

    //Timer
    strokeWeight(inc * 0.5);
    stroke(0);
    fill(220);
    rect(17 * inc, 65 * inc, 14 * inc, 14 * inc, 10);
    noStroke();
    fill(0);
    textSize(inc * 2.5);
    text('Time:', 24 * inc, 69 * inc);
    text(floor((endTime - startTime) / 1000), 24 * inc, 75 * inc);

    //Toggle mode button
    strokeWeight(inc * 0.5);
    stroke(0);
    fill(220);
    rect(33 * inc, 65 * inc, 14 * inc, 14 * inc, 10);
    noStroke();
    fill(0);
    textSize(inc * 2.5);
    text('Time:', 40 * inc, 69 * inc);
    text((clickMode == 0) ? 'Mines' : 'Flags', 40 * inc, 75 * inc);

    //Reset button
    strokeWeight(inc * 0.5);
    stroke(0);
    fill(220);
    rect(49 * inc, 65 * inc, 14 * inc, 14 * inc, 10);
    noStroke();
    fill(0);
    textSize(inc * 4);
    text('Reset', 56 * inc, 72 * inc);

    drawBoard();

}

function gamePressed() {

    let cellSize = width / gridSize;
    let currentBoard = board.split('');
    let inc = width / 64;

    if(checkRect(inc, 65 * inc, 14 * inc, 14 * inc)) {
        state = 'menu';
        resetBoard();
    }

    if(checkRect(33 * inc, 65 * inc, 14 * inc, 14 * inc)) {
        clickMode = (clickMode + 1) % 2;
    }

    if(checkRect(49 * inc, 65 * inc, 14 * inc, 14 * inc)) {
        resetBoard();
    }

    if((clickMode == 0 && mouseButton == RIGHT) || (clickMode == 1 && mouseButton == LEFT)) {
        
        if(checkRect(0, 0, width, width)) {
            let x = floor(mouseX / cellSize);
            let y = floor(mouseY / cellSize);
            let index = x + gridSize * y;
            if(currentBoard[index] == '-' || currentBoard[index] == 'b') {
                if(flags.includes(index)) {
                    flags.splice(flags.indexOf(index), 1);
                } else {
                    flags.push(index);
                }
            }
        }

        return;

    }

    
    if(checkRect(0, 0, width, width)) {
        if(anim[0] > 0 || gameOver > 0) return;
        let x = floor(mouseX / cellSize);
        let y = floor(mouseY / cellSize);
        let index = x + gridSize * y;
        if(currentBoard[index] == 'b') {
            gameOver = 1;
        } else { 
            anim = [1, [index]];
        }
    }

}

function drawBoard() {

    if(gameOver == 0) {
        endTime = millis();
    }

    let cellSize = width / gridSize;
    let currentBoard = board.split('');
    strokeWeight(cellSize * 0.05);
    textSize(cellSize * 0.4);
    let redraw = [];
    currentBoard.forEach((cell, index) => {
        let x = index % gridSize;
        let y = floor(index / gridSize);
        fill(((x + y) % 2 == 0) ? color('#e5c29f') : color('#d7b899'));
        noStroke();
        if(cell == '-' || cell == 'b') {
            fill(((x + y) % 2 == 0) ? color('#aad751') : color('#a0d040'));
            redraw.push([x, y]);
            if(gameOver == 1 && cell == 'b') {
                fill('#db3236');
            }
            if(gameOver == 2 && cell == 'b') {
                fill('#f4c20d');
            }
        }
        rect(x * cellSize, y * cellSize, cellSize + 2);
        noStroke();
        fill(0);
        if(cell > 0) {
            text(cell, (x + 0.5) * cellSize, (y + 0.5) * cellSize);
        }
    });

    noFill();
    if(gameOver != 2) {
        stroke('#87af3a');
    }

    redraw.forEach(cell => {
        let index = gridSize * cell[1] + cell[0];
        if(cell[0] > 0) {
            if(currentBoard[index - 1] != '-' && currentBoard[index - 1] != 'b') {
                line(cell[0] * cellSize, cell[1] * cellSize, cell[0] * cellSize, (cell[1] + 1) * cellSize);
            }
        }
        if(cell[0] < gridSize - 1) {
            if(currentBoard[index + 1] != '-' && currentBoard[index + 1] != 'b') {
                line((cell[0] + 1) * cellSize, cell[1] * cellSize, (cell[0] + 1) * cellSize, (cell[1] + 1) * cellSize);
            }
        }
        if(cell[1] > 0) {
            if(currentBoard[index - gridSize] != '-' && currentBoard[index - gridSize] != 'b') {
                line(cell[0] * cellSize, cell[1] * cellSize, (cell[0] + 1) * cellSize, cell[1] * cellSize);
            }
        }
        if(cell[1] < gridSize - 1) {
            if(currentBoard[index + gridSize] != '-' && currentBoard[index + gridSize] != 'b') {
                line(cell[0] * cellSize, (cell[1] + 1) * cellSize, (cell[0] + 1) * cellSize, (cell[1] + 1) * cellSize);
            }
        }
        if(gameOver > 0) {
            if(currentBoard[index] == 'b') {
                noStroke();
                fill((gameOver == 2) ? color('#e4b203') : color('#cb2226'));
                ellipse((cell[0] + 0.5) * cellSize, (cell[1] + 0.5) * cellSize, cellSize * 0.6);
                noFill();
                if(gameOver != 2) {
                    stroke('#87af3a');
                }
            }
        }
    });

    noStroke();
    fill('#f23607');
    flags.forEach(flag => {
        let x = flag % gridSize;
        let y = floor(flag / gridSize);
        let inc = cellSize / 16;
        beginShape();
        vertex((16 * x + 1) * inc, (16 * y + 15) * inc);
        vertex((16 * x + 3) * inc, (16 * y + 13) * inc);
        vertex((16 * x + 3) * inc, (16 * y + 1) * inc);
        vertex((16 * x + 15) * inc, (16 * y + 5) * inc);
        vertex((16 * x + 4.5) * inc, (16 * y + 8.5) * inc);
        vertex((16 * x + 4.5) * inc, (16 * y + 13) * inc);
        vertex((16 * x + 6.5) * inc, (16 * y + 15) * inc);
        endShape(CLOSE);
    });
    
    if(anim[0] > 0) {
        anim[0]--;
        if(anim[0] == 0) {
            uncover();
        }
    }

}

function resetBoard() {

    board = '';
    for(let i = 0; i < gridSize ** 2; i++) {
        board += '-';
    }
    placeMines();
    anim = [0, []];
    gameOver = 0;
    startTime = millis();
    clickMode = 0;
    flags = [];

}

function placeMines() {

    let currentBoard = board.split('');

    let possible = [];
    for(let i = 0; i < gridSize ** 2; i++) {
        possible.push(i);
    }

    for(let i = 0; i < bombCount; i++) {
        let ran = floor(random(possible.length));
        currentBoard[possible[ran]] = 'b';
        possible.splice(ran,1);
    }

    board = currentBoard.join('');

}

function checkRect(x, y, w, h) {

    let c1 = mouseX >= x;
    let c2 = mouseX <= x + w;
    let c3 = mouseY >= y;
    let c4 = mouseY <= y + h;
    return c1 && c2 && c3 && c4;

}

function uncover() {

    let currentBoard = board.split('');
    let newChecks = [];

    for(let i = 0; i < anim[1].length; i++) {
        let index = anim[1][i];
        let count = getCount(index);
        currentBoard[index] = count;
        if(flags.includes(index)) {
            flags.splice(flags.indexOf(index), 1);
        }
        if(count == 0) {
            let surroundingCells = getSurroundingCells(index);
            surroundingCells.forEach(cell => {
                if(currentBoard[cell] == '-') {
                    if(!anim[1].includes(cell) && !newChecks.includes(cell)) {
                        newChecks.push(cell);
                    }
                }
            })

        }
    }

    anim[1] = newChecks;
    if(newChecks.length == 0) {
        anim[0] = 0;
    } else {
        anim[0] = 15;
    }

    board = currentBoard.join('');
    if(checkForWin()) {
        gameOver = 2;
    }

}

function getCount(index) {

    let currentBoard = board.split('');
    let count = 0;
    let surroundingCells = getSurroundingCells(index);
    surroundingCells.forEach(cell => {
        count += (currentBoard[cell] == 'b') ? 1 : 0;
    });
    return count;

}

function getSurroundingCells(index) {

    let x = index % gridSize;
    let y = floor(index / gridSize);
    let surrounding = [];
    if(x > 0) {
        if(y > 0) {
            surrounding.push(index - gridSize - 1);
        }
        surrounding.push(index - 1);
        if(y < gridSize - 1) {
            surrounding.push(index + gridSize - 1);
        }
    }
    if(y > 0) {
        surrounding.push(index - gridSize);
    }
    if(y < gridSize - 1) {
        surrounding.push(index + gridSize);
    }
    if(x < gridSize - 1) {
        if(y > 0) {
            surrounding.push(index - gridSize + 1);
        }
        surrounding.push(index + 1);
        if(y < gridSize + 1) {
            surrounding.push(index + gridSize + 1);
        }
    }
    return surrounding;

}

function checkForWin() {

    let currentBoard = board.split('');
    return currentBoard.filter(e => {return e == '-'}).length == 0;

}