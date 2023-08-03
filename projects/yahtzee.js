let state, cellHeight, cols, hold, dice, turn, rolls, resetConfirm;

function setup() {

    //Create canvas and size it
    var canvas = createCanvas(800,800);
    canvas.parent('sketch-holder');
    windowResized();

    //Set necessary initial states
    textAlign(CENTER, CENTER);
    state = 'menu';
    dice = [];

}

function windowResized() {

    // Resize the canvas to fit the div
    var holderWidth = document.getElementById('sketch-holder').offsetWidth;
    cellHeight = (holderWidth / 28) * 0.95;
    resizeCanvas(cellHeight * 28, cellHeight * 39);

}
  
//Call windowResized() whenever the window is resized
window.addEventListener('resize', windowResized);

function draw() {

    //Draw the correct state
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

    //Press correct state
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
    
    //Create background
    background(255);

    //Draw start button
    let inc = width / 5;
    strokeWeight(inc * 0.03);
    stroke(0);
    fill(220);
    rect(inc, 2 * inc, 3 * inc, inc, 10);
    noStroke();
    fill(0);
    textSize(inc * 0.4);
    text('Start', 2.5 * inc, 2.5 * inc);

}

function menuPressed() {

    //Handle state button pressed
    let inc = width / 5;
    if(checkRect(inc, 2 * inc, 3 * inc, inc)) {
        state = 'game';
        resetBoard();
    }

}

function gameDraw() {

    background(255);

    //Draw back button
    strokeWeight(cellHeight * 0.1);
    stroke(0);
    fill(220);
    rect(cellHeight * 1, cellHeight * 34, cellHeight * 6, cellHeight * 4);
    noStroke();
    fill(0);
    textSize(cellHeight * 1);
    text('Back', cellHeight * 4, cellHeight * 36);

    //Draw reset button
    strokeWeight(cellHeight * 0.1);
    stroke(0);
    fill(220);
    rect(cellHeight * 21, cellHeight * 34, cellHeight * 6, cellHeight * 4);
    noStroke();
    fill(0);
    textSize(cellHeight * 1);
    text((!resetConfirm) ? 'Reset' : 'Confirm', cellHeight * 24, cellHeight * 36);
    

    //Draw the board
    drawBoard();

}

function gamePressed() {

    //Handle back button pressed
    if(checkRect(cellHeight * 1, cellHeight * 34, cellHeight * 6, cellHeight * 4)) {
        state = 'menu';
    }

    //Handle reset button pressed
    if(checkRect(cellHeight * 21, cellHeight * 34, cellHeight * 6, cellHeight * 4)) {
        if(!resetConfirm) {
            resetConfirm = true;
        }
        else {
            resetBoard();
        }
    } else {
        resetConfirm = false;
    }

    //Handle board pressed
    if(checkRect((17 + 5 * turn) * cellHeight, 11 * cellHeight, 5 * cellHeight, 22 * cellHeight)) {
        let y = floor(mouseY / cellHeight - 11);
        let result = getScore(cols[0][y]);
        if(cols[turn + 2][y] == "" && y != 8 && y != 10 && !(y == 18 && cols[turn + 2][16] != 50)) {
            cols[turn + 2][y] = result;
            updateTotals();
            turn = (turn + 1) % 2;
            rolls = 3;
            roll();
        }
    }

    //Handle roll button pressed
    if(checkRect(cellHeight * 21, cellHeight * 1, cellHeight * 6, cellHeight * 6)) {
        roll();
    }

    //Handle holding dice
    if(checkRect(cellHeight * 1, cellHeight * 1, cellHeight * 20, cellHeight * 4)) {
        let x = floor((mouseX / cellHeight - 1) / 4);
        hold[x] = true;
    }
    if(checkRect(cellHeight * 1, cellHeight * 5, cellHeight * 20, cellHeight * 4)) {
        let x = floor((mouseX / cellHeight - 1) / 4);
        hold[x] = false;
    }

}

function resetBoard() {

    //Reset the values in the columns
    resetCols();

    //Set nothing being held
    hold = [false, false, false, false, false];

    //Set the turn
    turn = 0;

    //Set the rolls
    rolls = 3;

    //Roll the dice
    roll();

    //Set reset confirm
    resetConfirm = false;

}

function checkRect(x, y, w, h) {

    //Check if mouse is within the given box
    let c1 = mouseX >= x;
    let c2 = mouseX <= x + w;
    let c3 = mouseY >= y;
    let c4 = mouseY <= y + h;
    return c1 && c2 && c3 && c4;

}

function resetCols() {

    //Create the array
    cols = [];

    //Set the value of column 1
    cols[0] = "Upper Section|Aces|Twos|Threes|Fours|Fives|Sixes|Total Score|Bonus|Total|Lower Section|3 of a kind|4 of a kind|Full House|Sm Straight|Lg Straight|Yahtzee|Chance|Yahtzee Bonus|Lower Total|Upper Total|Grand Total".split("|");

    //Set the value of column 2
    cols[1] = "Scoring|Add Ones|Add Twos|Add Threes|Add Fours|Add Fives|Add Sixes||35 Points|||Add Total|Add Total|25 Points|30 Points|40 Points|50 Points|Add Total|100 Each|||".split("|");

    //Set the value of column 3
    cols[2] = "P1|||||||0||0||||||||||0|0|0".split("|");

    //Set the value of column 4
    cols[3] = "P2|||||||0||0||||||||||0|0|0".split("|");

}

function roll() {

    //Check there are still rolls 
    if(rolls == 0) return;

    //Rolls the dice
    hold.forEach((e, i) => {
        if(!e) {
            dice[i] = floor(random(6) + 1);
        }
    });

    //Remove 1 roll
    rolls--;

}

function getScore(selected) {

    //Store the final result
    result = 0;

    //Store the ordered list of dice
    let orderedDice = [...dice].sort((a,b) => a - b);

    //Get the sum of the dice
    let diceSum = dice.reduce((a,b) => a + b);

    //Check if already filled
    if(cols[0].includes(selected)) {
        let index = cols[0].indexOf(selected);
        if(cols[turn + 2][index] != "" && index != 18) {
            return;
        }
    }

    //Swtich through possible selections
    switch(selected) {

        //Get score for aces
        case "Aces": 
            dice.forEach(e => {
                result += (e == 1) ? e : 0;
            });
            break;

        //Get score for twos
        case "Twos": 
            dice.forEach(e => {
                result += (e == 2) ? e : 0;
            });
            break;

        //Get score for threes
        case "Threes": 
            dice.forEach(e => {
                result += (e == 3) ? e : 0;
            });
            break;

        //Get score for fours
        case "Fours": 
            dice.forEach(e => {
                result += (e == 4) ? e : 0;
            });
            break;

        //Get score for fives
        case "Fives": 
            dice.forEach(e => {
                result += (e == 5) ? e : 0;
            });
            break;

        //Get score for sixes
        case "Sixes": 
            dice.forEach(e => {
                result += (e == 6) ? e : 0;
            });
            break;
        
        //Get score for 3 of a kind
        case "3 of a kind": 
            if(orderedDice[0] == orderedDice[2] || orderedDice[1] == orderedDice[3] || orderedDice[2] == orderedDice[4]) {
                result = diceSum;
            }
            break;

        //Get score for 4 of a kind
        case "4 of a kind": 
            if(orderedDice[0] == orderedDice[3] || orderedDice[1] == orderedDice[4]) {
                result = diceSum;
            }
            break;

        //Get score for full house
        case "Full House": 
            if(orderedDice[0] == orderedDice[2] && orderedDice[3] == orderedDice[4]) {
                result = 25;
            }
            if(orderedDice[0] == orderedDice[1] && orderedDice[2] == orderedDice[4]) {
                result = 25;
            }
            break;

        //Get score for small straight
        case "Sm Straight": 
            if(orderedDice[0] == orderedDice[1] - 1 && orderedDice[1] == orderedDice[2] - 1 && orderedDice[2] == orderedDice[3] - 1) {
                result = 30;
            }
            if(orderedDice[1] == orderedDice[2] - 1 && orderedDice[2] == orderedDice[3] - 1 && orderedDice[3] == orderedDice[4] - 1) {
                result = 30;
            }
            break;

        //Get score for large straight
        case "Lg Straight": 
            if(orderedDice[0] == orderedDice[1] - 1 && orderedDice[1] == orderedDice[2] - 1 && orderedDice[2] == orderedDice[3] - 1 && orderedDice[3] == orderedDice[4] - 1) {
                result = 40;
            }
            break;

        //Get score for yahtzee
        case "Yahtzee": 
            if(orderedDice[0] == orderedDice[4]) {
                result = 50;
            }
            break;

        //Get score for chance
        case "Chance": 
            result = diceSum;
            break;

        //Get score for yahtzee bonus
        case "Yahtzee Bonus": 
            if(orderedDice[0] == orderedDice[4] && cols[turn + 2][16] != "") {
                result = (cols[turn + 2][18] == "") ? 100 : cols[turn + 2][16] + 100;
            }
            break;

    }

    return result;

}

function drawDice(x, y, num) {

    //Draw outline
    stroke(0);
    noFill();
    strokeWeight(cellHeight / 10);
    rect(x + cellHeight * 0.2, y + cellHeight * 0.2, cellHeight * 3.6, cellHeight * 3.6, cellHeight * 0.5);

    //Switch through the possible nums
    fill(0);
    noStroke();
    switch(num) {

        case 1:
            ellipse(x + cellHeight * 2, y + cellHeight * 2, cellHeight * 0.5);
            break;

        case 2:
            ellipse(x + cellHeight * 1, y + cellHeight * 1, cellHeight * 0.5);
            ellipse(x + cellHeight * 3, y + cellHeight * 3, cellHeight * 0.5);
            break;

        case 3:
            ellipse(x + cellHeight * 1, y + cellHeight * 1, cellHeight * 0.5);
            ellipse(x + cellHeight * 2, y + cellHeight * 2, cellHeight * 0.5);
            ellipse(x + cellHeight * 3, y + cellHeight * 3, cellHeight * 0.5);
            break;

        case 4:
            ellipse(x + cellHeight * 1, y + cellHeight * 1, cellHeight * 0.5);
            ellipse(x + cellHeight * 1, y + cellHeight * 3, cellHeight * 0.5);
            ellipse(x + cellHeight * 3, y + cellHeight * 1, cellHeight * 0.5);
            ellipse(x + cellHeight * 3, y + cellHeight * 3, cellHeight * 0.5);
            break;

        case 5:
            ellipse(x + cellHeight * 1, y + cellHeight * 1, cellHeight * 0.5);
            ellipse(x + cellHeight * 1, y + cellHeight * 3, cellHeight * 0.5);
            ellipse(x + cellHeight * 2, y + cellHeight * 2, cellHeight * 0.5);
            ellipse(x + cellHeight * 3, y + cellHeight * 1, cellHeight * 0.5);
            ellipse(x + cellHeight * 3, y + cellHeight * 3, cellHeight * 0.5);
            break;

        case 6:
            ellipse(x + cellHeight * 1, y + cellHeight * 1, cellHeight * 0.5);
            ellipse(x + cellHeight * 1, y + cellHeight * 2, cellHeight * 0.5);
            ellipse(x + cellHeight * 1, y + cellHeight * 3, cellHeight * 0.5);
            ellipse(x + cellHeight * 3, y + cellHeight * 1, cellHeight * 0.5);
            ellipse(x + cellHeight * 3, y + cellHeight * 2, cellHeight * 0.5);
            ellipse(x + cellHeight * 3, y + cellHeight * 3, cellHeight * 0.5);
            break;

    }

}

function drawBoard() {

    //Draw the dice section
    stroke(0);
    strokeWeight(cellHeight / 10);
    noFill();
    rect(cellHeight * 1, cellHeight * 1, cellHeight * 20, cellHeight * 4);
    rect(cellHeight * 1, cellHeight * 5, cellHeight * 20, cellHeight * 4);
    rect(cellHeight * 21, cellHeight * 1, cellHeight * 6, cellHeight * 6);
    rect(cellHeight * 21, cellHeight * 7, cellHeight * 6, cellHeight * 2);

    //Draw the dice
    hold.forEach((e, i) => {
        drawDice(cellHeight * (4 * i + 1), (e) ? 5 * cellHeight : cellHeight, dice[i]);
    });

    //Write dice section text
    noStroke();
    fill(0);
    textSize(2 * cellHeight);
    text("Roll", 24 * cellHeight, 4 * cellHeight);
    textSize(0.7 * cellHeight);
    text("Rolls remaining: " + rolls, 24 * cellHeight, 8 * cellHeight);

    //Draw the main section
    stroke(0);
    strokeWeight(cellHeight / 10);
    noFill();
    rect(cellHeight * 1, cellHeight * 11, cellHeight * 26, cellHeight * 22);
    for(let y=0; y<21; y++) {
        line(cellHeight * 1, (12 + y) * cellHeight, cellHeight * 27, (12 + y) * cellHeight);
    }
    line(cellHeight * 9, cellHeight * 11, cellHeight * 9, cellHeight * 33);
    line(cellHeight * 17, cellHeight * 11, cellHeight * 17, cellHeight * 33);
    line(cellHeight * 22, cellHeight * 11, cellHeight * 22, cellHeight * 33);

    //Draw the main section text
    noStroke();
    fill(0);
    textSize(cellHeight * 0.7);
    let textX = [5, 13, 19.5, 24.5];
    for(let x = 0; x < 4; x++) {
        for(let y = 0; y < 22; y++) {
            if((x == 0 && (y == 7 || y == 9 || y == 10 || y == 19 || y == 20 || y == 21)) || (y == 0)) {
                textStyle(BOLD);
            } else {
                textStyle(NORMAL);
            }
            text(cols[x][y], textX[x] * cellHeight, (y + 11.5) * cellHeight);
        }
    }

    //Show value of hover
    fill(100);
    if(checkRect((17 + 5 * turn) * cellHeight, 11 * cellHeight, 5 * cellHeight, 22 * cellHeight)) {
        let y = floor(mouseY / cellHeight - 11);
        let result = getScore(cols[0][y]);
        if(result) {
            text(result, (19.5 + 5 * turn) * cellHeight, (11.5 + y) * cellHeight);
        }
    }

    //Show turn circle
    noStroke();
    fill(0);
    ellipse((19.5 + 5 * turn) * cellHeight, 10 * cellHeight, cellHeight);

}

function updateTotals() {

    //Player 1 upper section
    let p1UpperTotal = 0;
    let empty = false;
    for(let y = 1; y < 7; y++) {
        if(typeof cols[2][y] != 'string') {
            p1UpperTotal += cols[2][y];
        } else {
            empty = true;
        }
    }
    cols[2][7] = p1UpperTotal;
    if(!empty) {
        if(p1UpperTotal >= 63) {
            cols[2][8] = 35;
            p1UpperTotal += 35;
        } else {
            cols[2][8] = 0;
        }
    }
    cols[2][9] = p1UpperTotal;
    cols[2][20] = p1UpperTotal;

    //Player 2 upper section
    let p2UpperTotal = 0;
    empty = false;
    for(let y = 1; y < 7; y++) {
        if(typeof cols[3][y] != 'string') {
            p2UpperTotal += cols[3][y];
        } else {
            empty = true;
        }
    }
    cols[3][7] = p2UpperTotal;
    if(!empty) {
        if(p2UpperTotal >= 63) {
            cols[3][8] = 35;
            p2UpperTotal += 35;
        } else {
            cols[3][8] = 0;
        }
    }
    cols[3][9] = p2UpperTotal;
    cols[3][20] = p2UpperTotal;

    //Player 1 lower section
    let p1LowerTotal = 0;
    for(let y = 11; y < 19; y++) {
        if(typeof cols[2][y] != 'string') {
            p1LowerTotal += cols[2][y];
        }
    }
    cols[2][19] = p1LowerTotal;
    cols[2][21] = p1LowerTotal + p1UpperTotal;

    //Player 2 lower section
    let p2LowerTotal = 0;
    for(let y = 11; y < 19; y++) {
        if(typeof cols[3][y] != 'string') {
            p2LowerTotal += cols[3][y];
        }
    }
    cols[3][19] = p2LowerTotal;
    cols[3][21] = p2LowerTotal + p2UpperTotal;

}