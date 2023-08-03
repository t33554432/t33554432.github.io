let state;

let boardImg, board, falling, turn, players, score, winningLine, tripleWeighting, alternateTurns, lastStarted;

let gravity, depth, botStarts, gameEnded;


function preload() {

    boardImg = loadImage('../img/connect4board.png');

}

function setup() {
  
    //Create the canvas
    var canvas = createCanvas(800, 800);
    canvas.parent('sketch-holder');
    windowResized();

    //Set starting conditions
    state = 'menu';
    resetBoard();
    gravity = 15 * width / 800;
    players = 1;
    depth = 5;
    botStarts = false;
    score = [0,0];
    gameEnded = false;
    winningLine = [0,0];
    tripleWeighting = 0.01;
    alternateTurns = true;
    lastStarted = 1;

}

function windowResized() {
  // Resize the canvas to fit the div
  var holderWidth = document.getElementById('sketch-holder').offsetWidth;
  resizeCanvas(holderWidth * 0.95, holderWidth * 0.95);
  gravity = 15 * width / 800;
}

// Call windowResized() whenever the window is resized
window.addEventListener('resize', windowResized);

function draw() {
    
    switch(state) {
        case 'menu':
            drawMenu();
            break;
        case 'game':
            drawGame();
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

function drawMenu() {

    //Draw the menu background
    background(255);
    drawMenuBackground();

    //Draw buttons
    strokeWeight(5 * width / 800);
    stroke(0);
    fill(255,255,255,150);
    rect(width / 5, width / 5, 3 * width / 5, width / 5, 10);
    rect(width / 5, 3 * width / 5, 3 * width / 5, width / 5, 10);
    textAlign(CENTER, CENTER);
    textSize(32 * width / 800);
    fill(0);
    noStroke();
    text('1 Player', width / 2, 3 * width / 10);
    text('2 Players', width / 2, 7 * width / 10);

}

function drawMenuBackground() {

    //Create the background
    background(255);
    drawConnect4Board();
}

function menuPressed() {

    if(checkRect(width / 5, width / 5, 3 * width / 5, width / 5)) {
        state = 'game';
        players = 1;
        resetBoard();
    }

    if(checkRect(width / 5, 3 * width / 5, 3 * width / 5, width / 5)) {
        state = 'game';
        players = 2;
        resetBoard();
    }

}

function drawGame() {

    //Draw the board
    drawConnect4Board();

    //Draw back button
    strokeWeight(5 * width / 800);
    stroke(0);
    fill(255,255,255,150);
    rect(width / 56, 49 * width / 56, 10 * width / 56, 6 * width / 56, 10);
    textSize(32 * width / 800);
    fill(0);
    noStroke();
    text('Back', 6 * width / 56, 52 * width / 56);

    //Draw the turn display
    strokeWeight(5 * width / 800);
    stroke(0);
    fill(255,255,255,150);
    rect(12 * width / 56, 49 * width / 56, 6 * width / 56, 6 * width / 56, 10);
    textSize(20 * width / 800);
    fill(0);
    noStroke();
    text('Turn', 15 * width / 56, 51 * width / 56);
    if(turn == 0) {
        fill(255,255,0);
    } else {
        fill(255,0,0);
    }
    ellipse(15 * width / 56, 53 * width / 56, 1.5 * width / 56);

    //Draw the depth display
    if(players == 1) {
        strokeWeight(5 * width / 800);
        stroke(0);
        fill(255,255,255,150);
        rect(19 * width / 56, 49 * width / 56, 12 * width / 56, 6 * width / 56, 10);
        textSize(20 * width / 800);
        fill(0);
        noStroke();
        text('Depth', 22 * width / 56, 51 * width / 56);
        text(depth, 22 * width / 56, 53 * width / 56);
        textSize(32 * width / 800);
        text('-', 27 * width / 56, 52 * width / 56);
        text('+', 29 * width / 56, 52 * width / 56);
    }

    //Draw the alternate turns display
    if(players == 2) {
        strokeWeight(5 * width / 800);
        stroke(0);
        fill(255,255,255,150);
        rect(19 * width / 56, 49 * width / 56, 11 * width / 56, 6 * width / 56, 10);
        textSize(20 * width / 800);
        fill(0);
        noStroke();
        text('Alternate', 22.5 * width / 56, 51 * width / 56);
        text((alternateTurns) ? 'on' : 'off', 22 * width / 56, 53 * width / 56);
        textSize(18 * width / 800);
        text('Swap', 28 * width / 56, 52 * width / 56);
    }

    //Draw the player display
    if(players == 1) {
        strokeWeight(5 * width / 800);
        stroke(0);
        fill(255,255,255,150);
        rect(32 * width / 56, 49 * width / 56, 11 * width / 56, 6 * width / 56, 10);
        textSize(20 * width / 800);
        fill(0);
        noStroke();
        text('Bot goes', 35 * width / 56, 51 * width / 56);
        text((botStarts) ? 'first' : 'second', 35 * width / 56, 53 * width / 56);
        textSize(18 * width / 800);
        text('Swap', 41 * width / 56, 52 * width / 56);
    }

    //Show the score displays
    strokeWeight(5 * width / 800);
    stroke(0);
    fill(255,255,255,150);
    rect(44 * width / 56, 49 * width / 56, 5 * width / 56, 6 * width / 56, 10);
    rect(50 * width / 56, 49 * width / 56, 5 * width / 56, 6 * width / 56, 10);
    noStroke();
    fill(255,255,0);
    ellipse(46.5 * width / 56, 51 * width / 56, 1.5 * width / 56);
    fill(255,0,0);
    ellipse(52.5 * width / 56, 51 * width / 56, 1.5 * width / 56);
    textSize(20 * width / 800);
    fill(0);
    text(score[0], 46.5 * width / 56, 53 * width / 56);
    text(score[1], 52.5 * width / 56, 53 * width / 56);

}

function gamePressed() {

    //Check if back button was pressed
    if(checkRect(width / 56, 49 * width / 56, 10 * width / 56, 6 * width / 56)) {

        resetBoard();
        score = [0,0];
        state = 'menu';
        startNextMove();

    }

    //Check if depth buttons were pressed
    if(players == 1) {
        
        if(checkRect(25 * width / 56, 49 * width / 56, 3 * width / 56, 6 * width / 56)) {
            if(depth > 1) {
                depth--;
            }
        }
        if(checkRect(28 * width / 56, 49 * width / 56, 3 * width / 56, 6 * width / 56)) {
            if(depth < 9) {
                depth++;
            }
        }
    }

    if(players == 2) {

        if(checkRect(25 * width / 56, 49 * width / 56, 5 * width / 56, 6 * width / 56)) {
            alternateTurns = !alternateTurns;
        }

    }

    //Check if bot goes first button was pressed
    if(players == 1) {
        
        if(checkRect(38 * width / 56, 49 * width / 56, 5 * width / 56, 6 * width / 56)) {
            botStarts = !botStarts;
            resetBoard();
        }
    }

    //Check if a column was pressed
    if(checkRect(0, 0, width, 6 * width / 7)) {
        if(gameEnded) {
            gameEnded = false;
            resetBoard();
            return;
        }

        if(falling[0] == 0) {
            let possible = getAvailableCols();
            let x = floor(mouseX / (width / 7));
            if(possible.includes(x)) {
                placePiece(x);
            }
        }
    }
}

function drawConnect4Board() {

    fill(0,0,150);
    rect(0.02 * width, 0.02 * width, 0.96 * width, 0.96 * height);
    
    let currentBoard = board.split('');
    noStroke();
    let r = width / 9;

    if(falling[0] == 'doMove') {
      falling = [0,0,0];
      startNextMove();
    }

    if(falling[0] > 0) {
      falling[0] -= gravity;
      falling[2] += gravity;
      if(turn == 0) {
        fill(255,255,0);
      } else {
        fill(255,0,0);
      }
      ellipse(falling[1], falling[2], r);
      if(falling[0] <= 0) {
        let x = round((falling[1] / (width / 7)) - 0.5);
        let y = round((falling[2] / (width / 7)) - 0.5);
        currentBoard[getIndex(x,y)] = turn;
        turn = (turn + 1) % 2;
        board = currentBoard.join('');
        falling = ['doMove'];
      }
    }

    //Draw ghost piece
    if(state == 'game') {
      if(checkRect(0, 0, width, 6 * width / 7)) {
        noStroke();
        fill(200);
        let x = floor(mouseX / (width / 7));
        if(getAvailableCols().includes(x)) {
          for(let y = 5; y > -1; y--) {
            if(currentBoard[7 * y + x] == '-') {
              ellipse((x + 0.5) * (width / 7), (y + 0.5) * (width / 7), (width / 7.5));
              y = -1;
            }
          }
        }
      }
    }

    for(let i=0;i<42;i++) {
        if(currentBoard[i] != '-') {
            let x = getXCoord(i);
            let y = getYCoord(i);
            if(currentBoard[i] == 0) {
                fill(255,255,0);
            } else {
                fill(255,0,0);
            }
            ellipse(x,y,r)
        }
    }

    image(boardImg, 0, 0, width, height);

    if(gameEnded && winningLine != [0,0]) {
        noFill();
        stroke(0,255,0);
        strokeWeight(10 * width / 800);
        line(winningLine[0].x, winningLine[0].y, winningLine[1].x, winningLine[1].y);
    }
}

function getXCoord(index) {

    let x = index % 7;
    return (x + 0.5) * (width / 7);

}

function getYCoord(index) {

    let y = floor(index / 7);
    return (y + 0.5) * (width / 7);

}

function getIndex(x, y) {
    return 7*y+x;
}

function startNextMove() {

    if(state == 'menu') {
        if(checkForFull(board) || checkForWin(board) != 0.5) {
            resetBoard();
        }
        let possible = getAvailableCols();
        let ran = floor(possible.length * random());
        placePiece(possible[ran]);
    }
    if(state == 'game') {

        if(checkForWin(board) != 0.5) {
            let result = checkForWin(board);
            score[result]++;
            winningLine = getWinningLine(board);
            winningLine[0] = createVector(getXCoord(winningLine[0]), getYCoord(winningLine[0]));
            winningLine[1] = createVector(getXCoord(winningLine[1]), getYCoord(winningLine[1]));
            gameEnded = true;
            return;
        }

        if(checkForFull(board)) {
            gameEnded = true;
            winningLine = [0,0];
            return;
        }

        if(players == 2 || (botStarts && turn == 1) || (!botStarts && turn == 0) ) {
            return;
        }

        let x = findChange(board,getMove(board, turn, depth));
        placePiece(x);

    }

}

function getAvailableCols() {

    let current = board.split('');
    let possible = [];
    for(let x=0;x<7;x++) {
        if(current[x] == '-') {
            possible.push(x);
        }
    }
    return possible;

}

function checkForFull(state) {
  
    //Convert board to an array
    let grid = state.split('');
    
    //Assume grid is full
    result = true;
    
    //Check for an empty square
    grid.forEach(cell => {
      if(cell == '-') {
        result = false;
      }
    });
    
    //Return result
    return result;
    
}

function resetBoard() {
    board = '------------------------------------------';
    turn = 0;
    if(players == 2 && alternateTurns && state == 'game') {
        turn = (lastStarted + 1) % 2;
        lastStarted = turn;
    }
    falling = [0,0,0];
    startNextMove();
}

function placePiece(x) {

    let current = board.split('');
    for(let y=5;y>-1;y--) {
        if(current[getIndex(x, y)] == '-') {
            falling = [(y + 0.5) * (width / 7), getXCoord(x), 0];
            y = -1;
        }
    }

}

function checkForWin(state) {
  
    //Convert the state to an array
    let grid = state.split('');
    
    //Go through the rows
    for(let y=0;y<6;y++) {
      for(let x=0;x<4;x++) {
        let start = y*7+x;
        if(grid[start] == grid[start+1] && 
           grid[start] == grid[start+2] && 
           grid[start] == grid[start+3] && 
           grid[start] != '-') {
          return grid[start];
        }
      }
    }
    
    //Go through the columns
    for(let x=0;x<7;x++) {
      for(let y=0;y<3;y++) {
        let start = y*7+x;
        if(grid[start] == grid[start+7] && 
           grid[start] == grid[start+14] && 
           grid[start] == grid[start+21] && 
           grid[start] != '-') {
          return grid[start];
        }
      }
    }
    
    //Go through the positive diagonals
    for(let x=0;x<4;x++) {
      for(let y=0;y<3;y++) {
        let start = y*7+x;
        if(grid[start] == grid[start+8] && 
           grid[start] == grid[start+16] && 
           grid[start] == grid[start+24] && 
           grid[start] != '-') {
          return grid[start];
        }
      }
    }
    
    //Go through the negative diagonals
    for(let x=0;x<4;x++) {
      for(let y=3;y<6;y++) {
        let start = y*7+x;
        if(grid[start] == grid[start-6] && 
           grid[start] == grid[start-12] && 
           grid[start] == grid[start-18] && 
           grid[start] != '-') {
          return grid[start];
        }
      }
    }
    
    //Return draw if no result
    return 0.5;
    
}

function checkRect(x, y, w, h) {

    let c1 = mouseX >= x;
    let c2 = mouseX <= x + w;
    let c3 = mouseY >= y;
    let c4 = mouseY <= y + h;
    return c1 && c2 && c3 && c4;

}

function evaluate(state) {
  
    //Convert board to an array
    let grid = state.split('');
    
    //Create a list of all possible triples
    let triples = 
        ['000- 00-0 0-00 -000',
         '111- 11-1 1-11 -111'];
    
    //Set the initial score to 0.5
    let score = 0.5;
    
    //Go through the rows
    for(let y=0;y<6;y++) {
      for(let x=0;x<4;x++) {
        let start = y*7+x;
        let current = [grid[start], grid[start+1], grid[start+2], grid[start+3]].join('');
        if(triples[0].includes(current)) {
          score -= tripleWeighting;
        }
        if(triples[1].includes(current)) {
          score += tripleWeighting;
        }
      }
    }
    
    //Go through the columns
    for(let x=0;x<7;x++) {
      for(let y=0;y<2;y++) {
        let start = y*7+x;
        let current = [grid[start], grid[start+7], grid[start+14], grid[start+21]].join('');
        if(triples[0].includes(current)) {
          score -= tripleWeighting;
        }
        if(triples[1].includes(current)) {
          score += tripleWeighting;
        }
      }
    }
    
    //Go through the positive diagonals
    for(let x=0;x<4;x++) {
      for(let y=0;y<3;y++) {
        let start = y*7+x;
        let current = [grid[start], grid[start+8], grid[start+16], grid[start+24]].join('');
        if(triples[0].includes(current)) {
          score -= tripleWeighting;
        }
        if(triples[1].includes(current)) {
          score += tripleWeighting;
        }
      }
    }
    
    //Go through the negative diagonals
    for(let x=0;x<4;x++) {
      for(let y=3;y<6;y++) {
        let start = y*7+x;
        let current = [grid[start], grid[start-6], grid[start-12], grid[start-18]].join('');
        if(triples[0].includes(current)) {
          score -= tripleWeighting;
        }
        if(triples[1].includes(current)) {
          score += tripleWeighting;
        }
      }
    }
    
    //Return the final evaluation of the position
    return score
    
}

function getWinningLine(state) {
  
    //Convert the state to an array
    let grid = state.split('');
    
    //Go through the rows
    for(let y=0;y<6;y++) {
      for(let x=0;x<4;x++) {
        let start = y*7+x;
        if(grid[start] == grid[start+1] && 
           grid[start] == grid[start+2] && 
           grid[start] == grid[start+3] && 
           grid[start] != '-') {
          return [start, start+3];
        }
      }
    }
    
    //Go through the columns
    for(let x=0;x<7;x++) {
      for(let y=0;y<3;y++) {
        let start = y*7+x;
        if(grid[start] == grid[start+7] && 
           grid[start] == grid[start+14] && 
           grid[start] == grid[start+21] && 
           grid[start] != '-') {
          return [start, start+21];
        }
      }
    }
    
    //Go through the positive diagonals
    for(let x=0;x<4;x++) {
      for(let y=0;y<3;y++) {
        let start = y*7+x;
        if(grid[start] == grid[start+8] && 
           grid[start] == grid[start+16] && 
           grid[start] == grid[start+24] && 
           grid[start] != '-') {
          return [start, start+24];
        }
      }
    }
    
    //Go through the negative diagonals
    for(let x=0;x<4;x++) {
      for(let y=3;y<6;y++) {
        let start = y*7+x;
        if(grid[start] == grid[start-6] && 
           grid[start] == grid[start-12] && 
           grid[start] == grid[start-18] && 
           grid[start] != '-') {
          return [start, start-18];
        }
      }
    }
    
}

function getOptions(state, player) {
  
    //Convert the state to an array
    let grid = state.split('');
  
    //Loop over all cells in the grid and add them to options array
    let options = [];
    for(let x=0;x<7;x++) {
      let current = 35+x;
      while(current >= 0) {
        if(grid[current] == '-') {
          grid[current] = player;
          options.push(grid.join(''));
          grid[current] = '-';
          current = 0;
        }
        current -= 7;
      }
    }
  
    //Return the list of options
    return options;
    
}

function outcome(state, player, depth) {
  
    //checkForWin returns 0/1 for player 0/1 winning and 0.5 for draw
    let check = checkForWin(state);
    
    //If checkForWin finds a winner return the result
    if(check != 0.5) {
      return check;
    }
    
    //If board is full return 0.5
    if(checkForFull(state)) {
      return 0.5;
    }
    
    //If depth limit is reached with no winner return evaluation
    if(depth <= 0) {
      return evaluate(state);
    }
    
    //Get a list of all states that could come from all possible moves
    let options = getOptions(state, player);
    
    //Keep track of the best result seen so far
    let best = (player + 1) % 2;
    
    //Loop over the possible options
    options.forEach(option => {
      
      //Get the overall result for this possible option
      let result = outcome(option, (player + 1) % 2, depth - 1);
      
      //Check if it better than the best result so far
      if(abs(player - result) < abs(player - best)) {
        best = result;
      }
      
    });
    
    //Return the best result from all options
    return best;
    
}

function getMove(state, player, depth) {
  
    //Get a list of all states that could come from all possible moves
    let options = getOptions(state, player);
    
    //Keep track of the best result seen so far
    let best = (player + 1) % 2;
    let bestoption = options[0];
    
    //Loop over the possible options
    options.forEach(option => {
      
      //Get the overall result for this possible option
      let result = outcome(option, (player + 1) % 2, depth - 1);
      
      //Check if it better than the best result so far
      if(abs(player - result) < abs(player - best)) {
        best = result;
        bestoption = option;
      }
      
    });
    
    //Return the best result from all options
    return bestoption;
    
}

function findChange(originalState, newState) {

    let s1 = originalState.split('');
    let s2 = newState.split('');
    let result = 0;
    for(let i=0;i<42;i++) {
        if(s1[i] != s2[i]) {
            result = i % 7; 
        }
    }
    return result;

}