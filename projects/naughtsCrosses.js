let state, board, anim, turn, animSpeed, players, score, botStart, alternate, prevFirstTurn;

function setup() {
    var canvas = createCanvas(600,700);
    canvas.parent('sketch-holder');
    state = 'menu';
    anim = [0, 0];
    turn = 0;
    animSpeed = 3;
    players = 2;
    score = [0,0];
    botStart = 1;
    prevFirstTurn = 1;
    alternate = true;
    resetBoard();
    windowResized();
}

function windowResized() {
    // Resize the canvas to fit the div
    var holderWidth = document.getElementById('sketch-holder').offsetWidth;
    resizeCanvas(holderWidth * 0.95, 7 * holderWidth * 0.95 / 6);
}

// Call windowResized() whenever the window is resized
window.addEventListener('resize', windowResized);

function draw() {
    background(255);
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
    drawBoard();

    strokeWeight(width / 120);
    stroke(0);
    fill(255,255,255,150);
    rect(width / 5, width / 5, 3 * width / 5, width / 5, 10);
    rect(width / 5, 3 * width / 5, 3 * width / 5, width / 5, 10);
    textAlign(CENTER, CENTER);
    textSize(4 * width / 75);
    fill(0);
    noStroke();
    text('1 Player', width / 2, 3 * width / 10);
    text('2 Players', width / 2, 7 * width / 10);
}

function drawGame() {
    
    drawBoard();
    let inc = width / 60;

    //Draw back button
    strokeWeight(5 * width / 800);
    stroke(0);
    fill(255,255,255,150);
    rect(inc, 61 * inc, 10 * inc, 8 * inc, 10);
    textSize(32 * width / 800);
    fill(0);
    noStroke();
    text('Back', 6 * inc, 65 * inc);

    //Draw the turn display
    strokeWeight(5 * width / 800);
    stroke(0);
    fill(255,255,255,150);
    rect(12 * inc, 61 * inc, 8 * inc, 8 * inc, 10);
    noStroke();
    fill(0);
    textSize(28 * width / 800);
    text('Turn', 16 * inc, 63 * inc);
    noFill();
    stroke(0);
    if(turn == 0) {
        line(15 * inc, 65 * inc, 17 * inc, 67 * inc);
        line(17 * inc, 65 * inc, 15 * inc, 67 * inc);
    } else {
        ellipse(16 * inc, 66 * inc, 2 * inc);
    }    

    //Draw the alternate turns display
    if(players == 2) {
        strokeWeight(5 * width / 800);
        stroke(0);
        fill(255,255,255,150);
        rect(21 * inc, 61 * inc, 17 * inc, 8 * inc, 10);
        textSize(28 * width / 800);
        fill(0);
        noStroke();
        text('Alternate', 27 * inc, 63 * inc);
        text((alternate) ? 'on' : 'off', 27 * inc, 67 * inc);
        text('Swap', 35 * inc, 65 * inc);
    }
    

    //Draw the player display
    if(players == 1) {
        strokeWeight(5 * width / 800);
        stroke(0);
        fill(255,255,255,150);
        rect(21 * inc, 61 * inc, 17 * inc, 8 * inc, 10);
        textSize(28 * width / 800);
        fill(0);
        noStroke();
        text('Bot goes', 27 * inc, 63 * inc);
        text((botStart == 0) ? 'first' : 'second', 27 * inc, 67 * inc);
        text('Swap', 35 * inc, 65 * inc);
    }

    //Show the score displays
    strokeWeight(5 * width / 800);
    stroke(0);
    fill(255,255,255,150);
    rect(42 * inc, 61 * inc, 8 * inc, 8 * inc, 10);
    rect(51 * inc, 61 * inc, 8 * inc, 8 * inc, 10);
    line(45 * inc, 62 * inc, 47 * inc, 64 * inc);
    line(47 * inc, 62 * inc, 45 * inc, 64 * inc);
    ellipse(55 * inc, 63 * inc, 2 * inc);
    textSize(32 * width / 800);
    noStroke();
    fill(0);
    text(score[0], 46 * inc, 67 * inc);
    text(score[1], 55 * inc, 67 * inc);
}

function menuPressed() {

    if(checkRect(width / 5, width / 5, 3 * width / 5, width / 5)) {
        state = 'game';
        players = 1;
        score = [0,0];
        resetBoard();
        return;
    }
    if(checkRect(width / 5, 3 * width / 5, 3 * width / 5, width / 5)) {
        state = 'game';
        players = 2;
        score = [0,0];
        resetBoard();
        return;
    }
}

function gamePressed() {

    let currentBoard = board.split('');

    let inc = width / 60;

    if(checkRect(inc, 61 * inc, 10 * inc, 8 * inc)) {
        state = 'menu';
        resetBoard();
        return;
    }

    if(checkRect(31 * inc, 61 * inc, 7 * inc, 8 * inc)) {
        if(players == 1) {
            botStart = (botStart + 1) % 2;
            score = [0, 0];
            resetBoard();
        }
        if(players == 2) {
            alternate = !alternate;
        }
        return;
    }

    if(checkRect(0,0,width,width) && anim[0] == 0) {
        if(players == 1 && turn == botStart) {
            return;
        }
        let x = floor(mouseX / (width / 3));
        let y = floor(mouseY / (width / 3));
        if(currentBoard[x+3*y] == '-') {
            placePiece(x+3*y);
        }
        return;
    }
}

function drawBoard() {
    let currentBoard = board.split('');
    noFill();
    stroke(0);
    strokeWeight(width / 120);
    line(width / 3, 0, width / 3, width);
    line(2 * width / 3, 0, 2 * width / 3, width);
    line(0, width / 3, width, width / 3);
    line(0, 2 * width / 3, width, 2 * width / 3);
    currentBoard.forEach( (e, i) => {
        let x = ((i % 3) + 0.5) * (width / 3);
        let y = (floor(i / 3) + 0.5) * (width / 3);
        let inc = width / 10;
        if(e == 0) {
            line(x - inc, y - inc, x + inc, y + inc);
            line(x + inc, y - inc, x - inc, y + inc);
        } else if(e == 1){
            ellipse(x, y, 2 * inc);
        }
    });
    if(anim[0] > 0 && anim[0] < 61) {
        anim[0] -= animSpeed;
        let x = ((anim[1] % 3) + 0.5) * (width / 3);
        let y = (floor(anim[1] / 3) + 0.5) * (width / 3);
        if(turn == 0) {
            let inc = width / 10;
            if(anim[0] > 30) {
                let newLength = (60 - anim[0]) * (inc / 15);
                line(x - inc, y - inc, x - inc + newLength, y - inc + newLength);
            } else {
                line(x - inc, y - inc, x + inc, y + inc);
                let newLength = (30 - anim[0]) * (inc / 15);
                line(x + inc, y - inc, x + inc - newLength, y - inc + newLength);
            }
        } else {
            let angle = (60 - anim[0]) * (PI / 30);
            arc(x, y, width / 5, width / 5, - PI / 2, angle - PI / 2);
        }
        if(anim[0] < 1) {
            currentBoard[anim[1]] = turn;
            board = currentBoard.join('');
            turn = (turn + 1) % 2;
            startNextMove();
        }
    }
    if(anim[0] > 60 && anim[0] < 121) {
        anim[0] -= animSpeed;
        stroke(0,255,0);
        let x1 = ((anim[1][0] % 3) + 0.5) * (width / 3);
        let y1 = (floor(anim[1][0] / 3) + 0.5) * (width / 3);
        let x2 = ((anim[1][1] % 3) + 0.5) * (width / 3);
        let y2 = (floor(anim[1][1] / 3) + 0.5) * (width / 3);
        let x3 = x1 + (120 - anim[0]) * (x2 - x1) / 60;
        let y3 = y1 + (120 - anim[0]) * (y2 - y1) / 60;
        line(x1, y1, x3, y3);
        if(anim[0] < 61) {
            let winner = checkForWin(board);
            score[winner]++;
            resetBoard();
        }
    }
    if(anim[0] > 120 && anim[0] < 181) {
        anim[0] -= animSpeed;
        if(anim[0] < 121) {
            resetBoard();
        }
    }
}

function placePiece(index) {
    anim = [60, index];
}

function resetBoard() {
    board = '---------';
    anim = [0,0];
    turn = 0;
    if((alternate && players == 2) || state == 'menu') {
        turn = (prevFirstTurn + 1) % 2;
        prevFirstTurn = turn;
    }
    startNextMove();
}

function startNextMove() {
    let currentBoard = board.split('');
    let possible = [];
    currentBoard.forEach((e,i) => {
        if(e == '-') {
            possible.push(i);
        }
    });
    if(checkForWin(board) != 0.5) {
        anim = [120,getWin()];
        return;
    }
    if(possible.length == 0) {
        anim = [180,0];
        return;
    }
    if(state == 'menu') {
        placePiece(possible[floor(random() * possible.length)]);
    }
    if(state == 'game') {
        if(players == 1 && turn == botStart) {
            placePiece(findChange(getMove(board, turn, 9)));
        }
    }
}

function checkForWin(state) {
  
    //Convert to an array
    let grid = state.split('');
    
    //Check rows
    if(grid[0] == grid[1] && grid[0] == grid[2] && grid[0] != '-') return grid[0];
    if(grid[3] == grid[4] && grid[3] == grid[5] && grid[3] != '-') return grid[3];
    if(grid[6] == grid[7] && grid[6] == grid[8] && grid[6] != '-') return grid[6];
    
    //Check Cols
    if(grid[0] == grid[3] && grid[0] == grid[6] && grid[0] != '-') return grid[0];
    if(grid[1] == grid[4] && grid[1] == grid[7] && grid[1] != '-') return grid[1];
    if(grid[2] == grid[5] && grid[2] == grid[8] && grid[2] != '-') return grid[2];
    
    //Check Diags
    if(grid[0] == grid[4] && grid[0] == grid[8] && grid[0] != '-') return grid[0];
    if(grid[2] == grid[4] && grid[2] == grid[6] && grid[2] != '-') return grid[2];
    
    //Return draw if no win
    return 0.5;
    
}

function getWin() {
  
    //Convert to an array
    let grid = board.split('');
    
    //Check rows
    if(grid[0] == grid[1] && grid[0] == grid[2] && grid[0] != '-') return [0,2];
    if(grid[3] == grid[4] && grid[3] == grid[5] && grid[3] != '-') return [3,5];
    if(grid[6] == grid[7] && grid[6] == grid[8] && grid[6] != '-') return [6,8];
    
    //Check Cols
    if(grid[0] == grid[3] && grid[0] == grid[6] && grid[0] != '-') return [0,6];
    if(grid[1] == grid[4] && grid[1] == grid[7] && grid[1] != '-') return [1,7];
    if(grid[2] == grid[5] && grid[2] == grid[8] && grid[2] != '-') return [2,8];
    
    //Check Diags
    if(grid[0] == grid[4] && grid[0] == grid[8] && grid[0] != '-') return [0,8];
    if(grid[2] == grid[4] && grid[2] == grid[6] && grid[2] != '-') return [2,6];
    
    return false;
}

function checkRect(x,y,w,h) {
    let c1 = mouseX >= x;
    let c2 = mouseX <= x + w;
    let c3 = mouseY >= y;
    let c4 = mouseY <= y + h;
    return c1 && c2 && c3 && c4;
}

function getOptions(state, player) {
  
    //Convert to an array
    let grid = state.split('');
    
    //Loop over the grid and add potential options
    let options = [];
    grid.forEach((spot, index) => {
      
      //Check if it is empty
      if(spot == '-') {
        grid[index] = player;
        options.push(grid.join(''));
        grid[index] = '-';
      }
      
    });
    
    //Return our list of options
    return options;
    
}

function outcome(state, player, depth) {

    //checkForWin returns 0/1 for player 0/1 winning and 0.5 for draw
    let check = checkForWin(state);

    //If checkForWin finds a winner or the depth limit is reached return the result
    if(check != 0.5 || depth <= 0) {
        return check;
    }

    //Get a list of all states that could come from all possible moves
    let options = getOptions(state, player);

    //If no options return draw
    if(options.length == 0) {
        return 0.5;
    }

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

function findChange(newBoard) {
    let oldB = board.split('');
    let newB = newBoard.split('');
    let result = 0;
    oldB.forEach((e,i) => {
        if(newB[i] != e) {
            result =  i;
        }
    });
    return result;
}