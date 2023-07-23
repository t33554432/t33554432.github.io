let state, grid, gridScore, spaces, bag, letterScore, hand1, hand2, hand1Score, hand2Score, score1, resetConfirm
  score2, letterToggle, turn, currentPositions, letterSelected, currentLetter, currentScore, firstTurn;

function keyPressed() {
  if(keyCode == 67) {
    turn = (turn%2)+1;
  }
}

function setup() {
  var canvas = createCanvas(1100, 1200);
  textAlign(CENTER, CENTER);
  canvas.parent('sketch-holder');
  windowResized();
  resetBoard();
  state = 'game';
}

function windowResized() {
    // Resize the canvas to fit the div
    var holderWidth = document.getElementById('sketch-holder').offsetWidth;
    resizeCanvas(holderWidth * 0.95, holderWidth * 0.95 * 12 / 11);
}
  
// Call windowResized() whenever the window is resized
window.addEventListener('resize', windowResized);

function draw() {
    switch(state) {
        case 'game':
            drawGame();
            break;
    }
}

function drawGame() {
  background(255);
  drawLayout();
}

function drawLayout() {
    let inc = width / 110;
  
    //Draw squares
    noStroke();
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (grid[i][j] == "" || letterToggle) {
          fill(calcFill(spaces[i][j]));
        } else {
          fill(255, 220, 120);
        }
        rect(5 * inc * (i + 1), 5 * inc * (j + 1), 5 * inc);
      }
    }
    fill(255, 220, 120);
    for (let i = 0; i < 7; i++) {
      if (hand1[i] != "") {
        rect(5 * inc + 10.8 * inc * i, 85 * inc, 10 * inc);
      }
      if (hand2[i] != "") {
        rect(5 * inc + 10.8 * inc * i, 100 * inc, 10 * inc);
      }
    }
    fill(255);
    stroke(0);
    strokeWeight(0.2 * inc);
    rect(85 * inc, 5 * inc, 20 * inc, 5 * inc, 10);
    rect(85 * inc, 15 * inc, 20 * inc, 5 * inc, 10);
    rect(85 * inc, 30 * inc, 20 * inc, 5 * inc, 10);
    rect(85 * inc, 40 * inc, 20 * inc, 5 * inc, 10);
    if (letterToggle) {
      fill(150);
    }
    rect(85 * inc, 50 * inc, 20 * inc, 10 * inc, 10);
    fill(255);
    rect(85 * inc, 65 * inc, 20 * inc, 10 * inc, 10);
    rect(85 * inc, 80 * inc, 20 * inc, 10 * inc, 10);
    rect(85 * inc, 95 * inc, 20 * inc, 10 * inc, 10);
  
    //Draw outlines
    stroke(0);
    strokeWeight(0.2 * inc);
    noFill();
    for (let i = 1; i < 17; i++) {
      line(5 * inc * i, 5 * inc, 5 * inc * i, 80 * inc);
      line(5 * inc, 5 * inc * i, 80 * inc, 5 * inc * i);
    }
    for (let i = 0; i < 7; i++) {
      if (hand1[i] != "") {
        rect(5 * inc + 10.8 * inc * i, 85 * inc, 10 * inc);
      }
      if (hand2[i] != "") {
        rect(5 * inc + 10.8 * inc * i, 100 * inc, 10 * inc);
      }
    }
    if (turn == 1) {
      rect(2.5 * inc, 82.5 * inc, 80 * inc, 15 * inc);
    } else {
      rect(2.5 * inc, 97.5 * inc, 80 * inc, 15 * inc);
    }
  
    //Write in text
    fill(0);
    noStroke();
    textSize(5 * inc);
    textAlign(CENTER, CENTER);
    for (let i = 0; i < 7; i++) {
      textSize(5 * inc);
      if (hand1[i] != "-") {
        text(hand1[i].toUpperCase(), 10 * inc + 10.8 * inc * i, 90 * inc);
      }
      if (hand2[i] != "-") {
        text(hand2[i].toUpperCase(), 10 * inc + 10.8 * inc * i, 105 * inc);
      }
      textSize(3 * inc);
      text(str(hand1Score[i]), 13 * inc + 10.8 * inc * i, 93.5 * inc);
      text(str(hand2Score[i]), 13 * inc + 10.8 * inc * i, 108.5 * inc);
    }
  
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (!letterToggle) {
          textSize(3 * inc);
          if (grid[i][j] != "-") {
            text(grid[i][j].toUpperCase(), 2.5 * inc + 5 * inc * (i + 1), 2.5 * inc + 5 * inc * (j + 1));
          }
          textSize(1.5 * inc);
          text(str(gridScore[i][j]), 4 * inc + 5 * inc * (i + 1), 4 * inc + 5 * inc * (j + 1));
        } else {
          textSize(3 * inc);
          if (spaces[i][j] != "") {
            text(
              spaces[i][j].split("")[0] + spaces[i][j].split("")[1].toUpperCase(),
              2.5 * inc + 5 * inc * (i + 1),
              2.5 * inc + 5 * inc * (j + 1)
            );
          }
        }
      }
    }
    textSize(2 * inc);
    text("Player 1 Score", 95 * inc, 7.5 * inc);
    text(str(score1), 95 * inc, 17.5 * inc);
    text("Player 2 Score", 95 * inc, 32.5 * inc);
    text(str(score2), 95 * inc, 42.5 * inc);
    text("Toggle letters", 95 * inc, 55 * inc);
    text("End Turn", 95 * inc, 70 * inc);
    text("Clear", 95 * inc, 85 * inc);
    text((!resetConfirm) ? "Restart Game" : "Confirm", 95 * inc, 100 * inc);

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

function gamePressed() {
  
  let inc = width / 110;

  if (checkRect(85 * inc, 50 * inc, 20 * inc, 10 * inc)) {
    letterToggle = !letterToggle;
  }
  if (checkRect(85 * inc, 95 * inc, 20 * inc, 10 * inc)) {
    if(!resetConfirm) {
        resetConfirm = true;
    } else {
        resetBoard();
    }
  } else {
    if(resetConfirm) {
        resetConfirm = false;
    }
  }
  if (!letterSelected) {
    for (let i = 0; i < 7; i++) {
      if (checkRect(5 * inc + 10.8 * i * inc, 85 * inc, 10 * inc, 10 * inc) && turn == 1) {
        currentLetter = hand1[i];
        currentScore = hand1Score[i];
        letterSelected = true;
        hand1[i] = "";
        hand1Score[i] = "";
      }
      if (checkRect(5 * inc + 10.8 * i * inc, 100 * inc, 10 * inc, 10 * inc) && turn == 2) {
        currentLetter = hand2[i];
        currentScore = hand2Score[i];
        letterSelected = true;
        hand2[i] = "";
        hand2Score[i] = "";
      }
    }
    if (checkRect(85 * inc, 80 * inc, 20 * inc, 10 * inc)) {
      for (let i = 0; i < currentPositions.length / 2; i++) {
        let x = currentPositions[i * 2];
        let y = currentPositions[i * 2 + 1];
        currentLetter = grid[x][y];
        currentScore = gridScore[x][y];
        grid[x][y] = "";
        gridScore[x][y] = "";
        let test = true;
        let j = 0;
        while (test) {
          if (turn == 1) {
            if (hand1[j] == "") {
              hand1[j] = currentLetter;
              hand1Score[j] = currentScore;
              test = false;
            }
          } else {
            if (hand2[j] == "") {
              hand2[j] = currentLetter;
              hand2Score[j] = currentScore;
              test = false;
            }
          }
          j++;
        }
      }
      currentPositions = [];
    }
    if (checkRect(85 * inc, 65 * inc, 20 * inc, 10 * inc)) {
      let score = calcTurnScore();
      if (str(score).split("").length < 4) {
        if (turn == 1) {
          score1 += score;
          for (let i = 0; i < 7; i++) {
            if (hand1[i] == "" && bag.length > 0) {
              let a = floor(random(bag.length));
              hand1[i] = bag[a];
              hand1Score[i] = calcLetterScore(bag[a]);
              bag.splice(a, 1);
            }
          }
        } else {
          score2 += score;
          for (let i = 0; i < 7; i++) {
            if (hand2[i] == "" && bag.length > 0) {
              let a = floor(random(bag.length));
              hand2[i] = bag[a];
              hand2Score[i] = calcLetterScore(bag[a]);
              bag.splice(a, 1);
            }
          }
        }
        currentPositions = [];
        turn = 2 - ((turn + 1) % 2);
        firstTurn = false;
      }
    }
  }
  if (letterSelected && checkRect(5 * inc, 5 * inc, 75 * inc, 75 * inc)) {
    let x = floor(mouseX / (5 * inc)) - 1;
    let y = floor(mouseY / (5 * inc)) - 1;
    if (grid[x][y] != "") {
      return;
    }
    grid[x][y] = currentLetter;
    gridScore[x][y] = currentScore;
    currentLetter = "";
    currentScore = "";
    letterSelected = false;
    currentPositions.push(x);
    currentPositions.push(y);
  }
}

function resetBoard() {
  createArrays();
  score1 = 0;
  score2 = 0;
  letterToggle = false;
  letterSelected = false;
  turn = 1;
  firstTurn = true;
  resetConfirm = false;
}

function checkRect(x, y, r1, r2) {
  if (mouseX < x) {
    return false;
  }
  if (mouseX > x + r1) {
    return false;
  }
  if (mouseY < y) {
    return false;
  }
  if (mouseY > y + r2) {
    return false;
  }
  return true;
}

function calcFill(c) {
  if (c == "") {
    return color(50, 150, 100);
  }
  if (c == "3w") {
    return color(255, 50, 50);
  }
  if (c == "2w") {
    return color(255, 200, 100);
  }
  if (c == "3l") {
    return color(80, 150, 255);
  }
  if (c == "2l") {
    return color(150, 200, 255);
  }
  return null;
}

function createArrays() {
  //Defining arrays
  currentPositions = [];
  grid = [];
  spaces = [];
  gridScore = [];
  for (let i = 0; i < 15; i++) {
    grid[i] = [];
    spaces[i] = [];
    gridScore[i] = [];
    for (let j = 0; j < 15; j++) {
      grid[i][j] = "";
      spaces[i][j] = "";
      gridScore[i][j] = "";
    }
  }

  //Triple words
  spaces[0][0] = "3w";
  spaces[0][7] = "3w";
  spaces[0][14] = "3w";
  spaces[7][0] = "3w";
  spaces[7][14] = "3w";
  spaces[14][0] = "3w";
  spaces[14][7] = "3w";
  spaces[14][14] = "3w";

  //Double words
  spaces[1][1] = "2w";
  spaces[2][2] = "2w";
  spaces[3][3] = "2w";
  spaces[4][4] = "2w";
  spaces[10][10] = "2w";
  spaces[11][11] = "2w";
  spaces[12][12] = "2w";
  spaces[13][13] = "2w";
  spaces[1][13] = "2w";
  spaces[2][12] = "2w";
  spaces[3][11] = "2w";
  spaces[4][10] = "2w";
  spaces[10][4] = "2w";
  spaces[11][3] = "2w";
  spaces[12][2] = "2w";
  spaces[13][1] = "2w";
  spaces[7][7] = "2w";

  //Triple letters
  for (let i = 1; i < 14; i += 4) {
    for (let j = 1; j < 14; j += 4) {
      if (i == 5 || i == 9 || j == 5 || j == 9) {
        spaces[i][j] = "3l";
      }
    }
  }

  //Double letters
  spaces[0][3] = "2l";
  spaces[0][11] = "2l";
  spaces[14][3] = "2l";
  spaces[14][11] = "2l";
  spaces[3][0] = "2l";
  spaces[11][0] = "2l";
  spaces[3][14] = "2l";
  spaces[11][14] = "2l";
  spaces[6][2] = "2l";
  spaces[7][3] = "2l";
  spaces[8][2] = "2l";
  spaces[6][12] = "2l";
  spaces[7][11] = "2l";
  spaces[8][12] = "2l";
  spaces[2][6] = "2l";
  spaces[3][7] = "2l";
  spaces[2][8] = "2l";
  spaces[12][6] = "2l";
  spaces[11][7] = "2l";
  spaces[12][8] = "2l";
  spaces[6][6] = "2l";
  spaces[8][8] = "2l";
  spaces[6][8] = "2l";
  spaces[8][6] = "2l";

  //Defining the bag
  let bagString =
    "aaaaaaaaabbccddddeeeeeeeeeeeeffggghhiiiiiiiiijkllllmmnnnnnnooooooooppqrrrrrrssssttttttuuuuvvwwxyyz--";
  bag = bagString.split("");

  //Defining the scores
  letterScore = [
    1,
    3,
    3,
    2,
    1,
    4,
    2,
    4,
    1,
    8,
    5,
    1,
    3,
    1,
    1,
    3,
    10,
    1,
    1,
    1,
    1,
    4,
    4,
    8,
    4,
    10,
  ];

  //Defining the hands
  hand1 = [];
  hand2 = [];
  for (let i = 0; i < 7; i++) {
    let a = 0;
    let b = 0;
    while (a == b) {
      a = floor(random(bag.length));
      b = floor(random(bag.length));
    }
    hand1.push(bag[a]);
    hand2.push(bag[b]);
    let c = max(a, b);
    let d = min(a, b);
    bag.splice(c, 1);
    bag.splice(d, 1);
  }

  //Defining hand scores
  hand1Score = [];
  hand2Score = [];
  for (let i = 0; i < 7; i++) {
    hand1Score[i] = calcLetterScore(hand1[i]);
    hand2Score[i] = calcLetterScore(hand2[i]);
  }
}

function calcLetterScore(a) {
  if (a == "-") {
    return 0;
  }
  let b = a.charCodeAt(0);
  b -= 97;
  return letterScore[b];
}

function calcWordScore(x, y, orient, length) {
  let mult = 1;
  let count = 0;
  let a = 0;
  let b = 0;
  if (orient == "h") {
    a = 1;
  } else {
    b = 1;
  }
  for (let i = 0; i < length; i++) {
    if (grid[x + a * i][y + b * i] == "") {
      return "";
    }
    if (spaces[x + a * i][y + b * i] == "3w") {
      mult = 3;
      count += gridScore[x + a * i][y + b * i];
    } else if (spaces[x + a * i][y + b * i] == "2w") {
      mult = 2;
      count += gridScore[x + a * i][y + b * i];
    } else if (spaces[x + a * i][y + b * i] == "3l") {
      count += 3 * gridScore[x + a * i][y + b * i];
    } else if (spaces[x + a * i][y + b * i] == "2l") {
      count += 2 * gridScore[x + a * i][y + b * i];
    } else {
      count += gridScore[x + a * i][y + b * i];
    }
  }
  return count * mult;
}

function calcTurnScore() {
  if (currentPositions.length == 0) {
    return "No Letters Placed";
  }
  if (currentPositions.length == 2) {
    //CASE WHERE THEY PLACED ONE LETTER
  }
  let score = 0;
  let orient;
  let testh = true;
  let testv = true;
  let a = currentPositions[0];
  let b = currentPositions[1];
  let x = a;
  let y = b;
  let mx = a;
  let my = b;
  for (let i = 1; i < currentPositions.length / 2; i++) {
    if (currentPositions[2 * i] != a) {
      testv = false;
    }
    if (currentPositions[2 * i + 1] != b) {
      testh = false;
    }
    x = min(x, currentPositions[2 * i]);
    y = min(y, currentPositions[2 * i + 1]);
    mx = max(mx, currentPositions[2 * i]);
    my = max(my, currentPositions[2 * i + 1]);
  }
  if (testv && !testh) {
    orient = "v";
  } else if (testh && !testv) {
    orient = "h";
  } else {
        print('AAAAAAAAAAA');
    return "Letters in invalid positions";
  }
  if (orient == "h") {
    let test = true;
    while (test && x > 0) {
      if (grid[x - 1][y] != "") {
        x--;
      } else {
        test = false;
      }
    }
    let length = 1;
    test = true;
    while (x + length < 15 && test) {
      if (grid[x + length][y] != "") {
        length++;
      } else {
        test = false;
      }
    }
    if (
      mx - x > length - 1 &&
      !(firstTurn || length > currentPositions.length)
    ) {
              print('BBBBBBBBBB');

      return "Letters in invalid positions";
    }
    let r1 = calcWordScore(x, y, orient, length);
    if (r1 != "") {
      score += r1;
    } else {
              print('CCCCCCCCCCC');

      return "Letters in invalid positions";
    }
    for (let i = 0; i < currentPositions.length / 2; i++) {
      let btest = true;
      if (y > 0) {
        if (grid[currentPositions[2 * i]][y - 1] != "") {
          btest = false;
          let nx = currentPositions[2 * i];
          let ny = y - 1;
          let test = true;
          while (ny > 0 && test) {
            if (grid[nx][ny - 1] == "") {
              test = false;
            } else {
              ny--;
            }
          }
          test = true;
          let len1 = 1;
          while (ny + len1 < 15 && test) {
            if (grid[nx][ny + len1] == "") {
              test = false;
            } else {
              len1++;
            }
          }
          let r2 = calcWordScore(nx, ny, "v", len1);
          score += r2;
        }
      }
      if (y < 14 && btest) {
        if (grid[currentPositions[2 * i]][y + 1] != "") {
          let nx = currentPositions[2 * i];
          let ny = y;
          let test = true;
          let len1 = 1;
          while (ny + len1 < 15 && test) {
            if (grid[nx][ny + len1] == "") {
              test = false;
            } else {
              len1++;
            }
          }
          let r3 = calcWordScore(nx, ny, "v", len1);
          score += r3;
        }
      }
    }
  } else if (orient == "v") {
    let test = true;
    while (test && y > 0) {
      if (grid[x][y - 1] != "") {
        y--;
      } else {
        test = false;
      }
    }
    let length = 1;
    test = true;
    while (y + length < 15 && test) {
      if (grid[x][y + length] != "") {
        length++;
      } else {
        test = false;
      }
    }
    if (
      my - y > length - 1 &&
      !(firstTurn || length > currentPositions.length)
    ) {
              print('DDDDDDDDDDDDDD');

      return "Letters in invalid positions";
    }
    let r1 = calcWordScore(x, y, orient, length);
    if (r1 != "") {
      score += r1;
    } else {
              print('EEEEEEEEEE');

      return "Letters in invalid positions";
    }
    for (let i = 0; i < currentPositions.length / 2; i++) {
      let btest = true;
      if (x > 0) {
        if (grid[x - 1][currentPositions[2 * i + 1]] != "") {
          btest = false;
          let ny = currentPositions[2 * i + 1];
          let nx = x - 1;
          let test = true;
          while (nx > 0 && test) {
            if (grid[nx - 1][ny] == "") {
              test = false;
            } else {
              nx--;
            }
          }
          test = true;
          let len1 = 1;
          while (nx + len1 < 15 && test) {
            if (grid[nx + len1][ny] == "") {
              test = false;
            } else {
              len1++;
            }
          }
          let r2 = calcWordScore(nx, ny, "h", len1);
          score += r2;
        }
      }
      if (x < 14 && btest) {
        if (grid[x + 1][currentPositions[2 * i + 1]] != "") {
          let ny = currentPositions[2 * i + 1];
          let nx = x;
          let test = true;
          let len1 = 1;
          while (nx + len1 < 15 && test) {
            if (grid[nx + len1][ny] == "") {
              test = false;
            } else {
              len1++;
            }
          }
          let r3 = calcWordScore(nx, ny, "h", len1);
          score += r3;
        }
      }
    }
  }
  return score;
}
