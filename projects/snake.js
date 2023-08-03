//Global variables that can be changed by the user
let gridSize, borderSize;
let numOfFruits, gridDim, numOfSnakes;  //Page 1 in settings
let p1Controls, p1Speed, p1Colours;     //Page 2 in settings
let p2Controls, p2Speed, p2Colours;     //Page 3 in settings

//Global variables that cannot be changed by the user
let snakes, newSegment, fruits, lastInput, state, highscore, settingsPage;


//Runs at the start of the script
function setup() {
  gridDim = createVector(20, 20);
  numOfFruits = 1;
  if(!localStorage.getItem('snakehighScore')) {
    localStorage.setItem('snakehighScore', 0);
    highscore = 0;
  } else {
    highscore = localStorage.getItem('snakehighScore');
  }
  state = 'menu';
  settingsPage = 1;
  p1Controls = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
  p2Controls = ['w', 'a', 's', 'd'];
  p1Speed = 0.125;
  p2Speed = 0.125;
  p1Colours = [color(200,0,0), color(200,0,0)];
  p2Colours = [color(0,200,0), color(0,200,0)];
  numOfSnakes = 1;
  textAlign(CENTER,CENTER);

  var canvas = createCanvas(800,800);
  canvas.parent('sketch-holder');
  windowResized();

}

function windowResized() {
    // Resize the canvas to fit the div
    var holderWidth = document.getElementById('sketch-holder').offsetWidth;
    gridSize = createVector(holderWidth * 0.95 * 500 / 570, holderWidth * 0.95 * 500 / 570);
    borderSize = createVector(holderWidth * 0.95 * 50 / 570, holderWidth * 0.95 * 50 / 570);
    resizeCanvas(gridSize.x + 2 * borderSize.x, gridSize.y + 2 * borderSize.y);
}
  
// Call windowResized() whenever the window is resized
window.addEventListener('resize', windowResized);

function preventScrolling(event) {
    const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
  
    if (keys[event.keyCode]) {
      event.preventDefault();
      return false;
    }
  }
  
  window.addEventListener('keydown', preventScrolling, false);

//Runs once every frame
function draw() {
  
  if(state == 'game') {
    gameLoop();
  }
  
  if(state == 'menu') {
    menuLoop();
  }
  
  if(state == 'settings') {
    settingsLoop();
  }
  
}

//Runs once everytime a keyboard input is tracked
function keyPressed() {
  
  if(state == 'menu') {
    menuKeyPressed();
  }
  
  if(state == 'game') {
    gameKeyPressed();
  }
  
  if(state == 'settings') {
    settingsKeyPressed();
  }
  
}

//Runs once everytime the mouse is pressed
function mousePressed() {
  
  if(state == 'menu') {
    menuMousePressed();
  }
  
  if(state == 'game') {
    gameMousePressed();
  }
  
  if(state == 'settings') {
    settingsMousePressed();
  }
  
}

//Used to check if the mouse is over a rectangle
function checkRect(x, y, w, h) {
  let c1 = mouseX >= x;
  let c2 = mouseY >= y;
  let c3 = mouseX <= x + w;
  let c4 = mouseY <= y + h;
  return c1 && c2 && c3 && c4;
}

//Used to check if the mouse is over a circle
function checkCirc(x, y, r) {
  let mousePos = createVector(mouseX, mouseY);
  let center = createVector(x, y);
  return (p5.Vector.dist(mousePos, center) <= r);
}

//Draws the menu
function menuLoop() {
  background(255);
  fill(100);
  stroke(0);
  let int = 0.2 * width;
  
  //Play Button
  noStroke();
  fill((checkRect(int, int, 3*int, int)) ? color(100) : color(60));
  rect(int, int, 3*int, int);
  fill(255);
  textSize(32);
  text('Play', 2.5 * int, 1.5 * int);
  
  //Settings button
  noStroke();
  fill((checkRect(int, 3*int, 3*int, int)) ? color(100) : color(60));
  rect(int, 3*int, 3*int, int);
  fill(255);
  textSize(32);
  text('Settings', 2.5 * int, 3.5 * int);
  
}

//Manages mouse presses when in the menu
function menuMousePressed() {
  let int = width / 5;
  if(checkRect(int, int, 3*int, int)) {
    gameSetup();
    state = 'game';
  }
  if(checkRect(int, 3*int, 3*int, int)) {
    state = 'settings';
  }
}

//Manages keyboard inputs in the menu
function menuKeyPressed() {
}

//Runs once when the snake game is started
function gameSetup() {
  snakes = [];
  fruits = [];
  snakes.push(new Snake(p1Controls, p1Speed, p1Colours));
  if(numOfSnakes == 2) {
    snakes.push(new Snake(p2Controls, p2Speed, p2Colours));
  }
  for (let i = 0; i < numOfFruits; i++) {
    addNewFruit();
  }
}

//Draws the game
function gameLoop() {
  background(255);
  noStroke();
  for(let x=0;x<gridDim.x;x++) {
    for(let y=0;y<gridDim.y;y++) {
      if((x+y) % 2 == 0) {
        fill(150);
      } else {
        fill(180);
      }
      let cellSizeX = gridSize.x / gridDim.x;
      let cellSizeY = gridSize.y / gridDim.y;
      rect(borderSize.x + x * cellSizeX, borderSize.y + y * cellSizeY, cellSizeX + 1, cellSizeY + 1);
    }
  }
  drawFruit();
  for(let snake of snakes) {
    snake.update();
  }
  drawBorder();
}

//Manages mouse inputs in the game
function gameMousePressed() {
  if(checkRect(borderSize.x,1.1*borderSize.y+gridSize.y,2*borderSize.x,0.8*borderSize.y)) {
    state = 'menu';
  }
}

//Manages keyboard inputs in the game
function gameKeyPressed() {
  for(let snake of snakes) {
    snake.inputPressed();
  }
}

//Draws the fruits in the game
function drawFruit() {
  fruits.forEach((fruit) => {
    stroke(0, 255, 0);
    strokeWeight(map(gridDim.x,10,40,8,2));
    fill(255, 0, 0);
    let csx = gridSize.x / gridDim.x;
    let csy = gridSize.y / gridDim.y;
    let xpos = borderSize.x + csx / 2 + csx * fruit.x;
    let ypos = borderSize.y + csy / 2 + csy * fruit.y;
    ellipse(xpos, ypos, csx * 0.8, csy * 0.8);
  });
}

//Draws the border around the screen in the game
function drawBorder() {
  fill(255);
  noStroke();
  rect(0, 0, borderSize.x, 2*borderSize.y+gridSize.y);
  rect(0, 0, 2*borderSize.x+gridSize.x, borderSize.y);
  rect(gridSize.x + borderSize.x, 0, borderSize.x, 2*borderSize.y+gridSize.y);
  rect(0, gridSize.y + borderSize.y, 2*borderSize.x+gridSize.x, borderSize.y);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(width / 25);
  let score = snakes[0].score;
  text("Score: " + score, width / 4, borderSize.y / 2);
  text("Highscore: " + highscore, (3 * width) / 4, borderSize.y / 2);
  fill(180);
  if(checkRect(borderSize.x,1.1*borderSize.y+gridSize.y,2*borderSize.x,0.8*borderSize.y)) fill(220);
  rect(borderSize.x,1.1*borderSize.y+gridSize.y,2*borderSize.x,0.8*borderSize.y);
  fill(0);
  text('Back', 2*borderSize.x,1.5*borderSize.y+gridSize.y)
  
}

//Gets an array of all available to spots for placing fruits or snakes
function getAvailableCells() {
  let available = [];
  for (let xc = 0; xc < gridDim.x; xc++) {
    for (let yc = 0; yc < gridDim.y; yc++) {
      let taken = false;
      let space = createVector(xc, yc);
      for(let snake of snakes){
        for (let segment of snake.segments) {
          if (space.dist(segment[0]) < 1) {
            taken = true;
          }
        }
      }
      for (let fruit of fruits) {
        if (space.dist(fruit) < 1) {
          taken = true;
        }
      }
      if (!taken) {
        available.push(space);
      }
    }
  }
  return available;
}

//Adds a new fruit in a random spot 
function addNewFruit() {
  let available = getAvailableCells();

  if (available.length > 0) {
    let picked = random(available);
    fruits.push(picked);
  }
}

//Draws the settings
function settingsLoop() {

  background(255);
  
  let selectableCols = [color(200), color(200,0,0), color(0,200,0), color(0,0,200), color(0), color(200,200,0), color(200,0,200), color(0,200,200)];
  
  let int = height/9;
  //Back Button
  textSize(24);
  highlightableBox(int, 7*int, 3*int, int, 'Back', false);
  
  //Page 1
  if(settingsPage == 1) {
    //Last page button
    highlightableBox(7*int, 7*int, int, int, 'Next', false);
    
    //Create the 3 non-highlightable buttons
    noStroke();
    fill(60);
    rect(int, int, 7*int, int);
    rect(int, 3*int, 7*int, int);
    rect(int, 5*int, 7*int, int);
    fill(255);
    text('Fruits', 2.5 * int, 1.5 * int);
    text('Grid Size', 2.5 * int, 3.5 * int);
    text('Snakes', 2.5 * int, 5.5 * int);
    
    //Number of fruits buttons
    for(let i=0;i<4;i++) {
      highlightableBox((4+i)*int, int, int, int, 1+2*i, (numOfFruits == 1+2*i));
    }
    
    //Size of grid buttons
    for(let i=0;i<4;i++) {
      highlightableBox((4+i)*int, 3*int, int, int, 10+10*i, (gridDim.x == 10+10*i));
    }
    
    //Number of snakes buttons
    for(let i=0;i<2;i++) {
      highlightableBox((4+2*i)*int, 5*int, 2*int, int, i+1, (numOfSnakes == i+1));
    }
    
  }
  
  //Page 2
  if(settingsPage == 2) {
    //Prev and next Page Button
    highlightableBox(5*int, 7*int, int, int, 'Prev', false);
    highlightableBox(7*int, 7*int, int, int, 'Next', false);
    
    //Create the 3 non-highlightable buttons
    noStroke();
    fill(60);
    rect(int, int, 7*int, int);
    rect(int, 3*int, 7*int, int);
    rect(int, 5*int, 7*int, int);
    fill(255);
    text('Player 1 Controls', 2.5 * int, 1.5 * int);
    text('Player 1 Speed', 2.5 * int, 3.5 * int);
    text('Player 1 Colours', 2.5 * int, 5.5 * int);
    
    //Player 1 Controls buttons
    highlightableBox(4*int, int, 2*int, int, "Arrows", (p1Controls[0] == 'ArrowUp'));
    highlightableBox(6*int, int, 2*int, int, "WASD", (p1Controls[0] == 'w'));
    
    //Player 1 speed buttons
    for(let i=0;i<4;i++) {
      highlightableBox((4+i)*int, 3*int, int, int, i+1, (p1Speed == pow(2, i-5)));
    }
    
    //Player 1 Colours
    for(let i=0;i<8;i++) {
      fill(selectableCols[i]);
      noStroke();
      if(p1Colours[0].levels.toString() == selectableCols[i].levels.toString()) {
        if(i == 0) {
          stroke(0);
        } else {
          stroke(255);
        }
      }
      strokeWeight(4);
      ellipse((4.25+0.5*i)*int, 5.25*int, 0.3*int);
      noStroke();
      if(p1Colours[1].levels.toString() == selectableCols[i].levels.toString()) {
        if(i == 0) {
          stroke(0);
        } else {
          stroke(255);
        }
      }
      ellipse((4.25+0.5*i)*int, 5.75*int, 0.3*int);
    }
    
  }
  
  //Page 3
  if(settingsPage == 3) {
    //Prev and next Page Button
    highlightableBox(5*int, 7*int, int, int, 'Prev', false);
    
    //Create the 3 non-highlightable buttons
    noStroke();
    fill(60);
    rect(int, int, 7*int, int);
    rect(int, 3*int, 7*int, int);
    rect(int, 5*int, 7*int, int);
    fill(255);
    text('Player 2 Controls', 2.5 * int, 1.5 * int);
    text('Player 2 Speed', 2.5 * int, 3.5 * int);
    text('Player 2 Colours', 2.5 * int, 5.5 * int);
    
    //Player 2 Controls buttons
    highlightableBox(4*int, int, 2*int, int, "Arrows", (p2Controls[0] == 'ArrowUp'));
    highlightableBox(6*int, int, 2*int, int, "WASD", (p2Controls[0] == 'w'));
    
    //Player 2 speed buttons
    for(let i=0;i<4;i++) {
      highlightableBox((4+i)*int, 3*int, int, int, i+1, (p2Speed == pow(2, i-5)));
    }
    
    //Player 2 Colours
    for(let i=0;i<8;i++) {
      fill(selectableCols[i]);
      noStroke();
      if(p2Colours[0].levels.toString() == selectableCols[i].levels.toString()) {
        if(i == 0) {
          stroke(0);
        } else {
          stroke(255);
        }
      }
      strokeWeight(4);
      ellipse((4.25+0.5*i)*int, 5.25*int, 0.3*int);
      noStroke();
      if(p2Colours[1].levels.toString() == selectableCols[i].levels.toString()) {
        if(i == 0) {
          stroke(0);
        } else {
          stroke(255);
        }
      }
      ellipse((4.25+0.5*i)*int, 5.75*int, 0.3*int);
    }
    
  }
  
}

//Manages mouse inputs in settings
function settingsMousePressed() {
  
  let int = height/9;
  
  let selectableCols = [color(200), color(200,0,0), color(0,200,0), color(0,0,200), color(0), color(200,200,0), color(200,0,200), color(0,200,200)];
  
  //Back Button
  noStroke();
  if(checkRect(int, 7*int, 3*int, int)) {
    settingsPage = 1;
    state = 'menu';
  }
  
  //Page 1 Buttons
  if(settingsPage == 1) {
    
    //Number of fruits buttons
    for(let i=0;i<4;i++) {
      if(checkRect((4+i)*int, int, int, int)) numOfFruits = 1+2*i;
    }
    if(checkRect(8*int, int, int, int)) numOfFruits = 100;
    
    //Grid Size buttons
    for(let i=0;i<4;i++) {
      if(checkRect((4+i)*int, 3*int, int, int)) gridDim = createVector(10+10*i, 10+10*i);
    }
    
    //Number of snakes buttons
    for(let i=0;i<2;i++) {
      if(checkRect((4+2*i)*int, 5*int, 2*int, int)) numOfSnakes = i+1;
    }
    
    //Next button
    if(checkRect(5*int, 7*int, 3*int, int)) {
      settingsPage = 2;
    }
    return;
  }
  
  //Page 2 Buttons
  if(settingsPage == 2) {
    
    //Prev button
    if(checkRect(5*int, 7*int, int, int)) {
      settingsPage = 1;
    }
    
    //Next button
    if(checkRect(7*int, 7*int, int, int)) {
      settingsPage = 3;
    }
    
    //Player 1 Controls button
    if(checkRect(4*int, int, 2*int, int)) p1Controls = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
    if(checkRect(6*int, int, 2*int, int)) p1Controls = ['w', 'a', 's', 'd'];
    
    //Player 1 Speed buttons
    for(let i=0;i<4;i++) {
      if(checkRect((4+i)*int, 3*int, int, int)) p1Speed = pow(2, i-5);
    }
    
    //Player 1 Colour buttons
    for(let i=0;i<8;i++) {
      if(checkCirc((4.25+0.5*i)*int, 5.25*int, 0.3*int)) p1Colours[0] = selectableCols[i];
      if(checkCirc((4.25+0.5*i)*int, 5.75*int, 0.3*int)) p1Colours[1] = selectableCols[i];
    }
      
    return;
  }
  
  //Page 3 Buttons
  if(settingsPage == 3) {
    
    //Prev button
    if(checkRect(5*int, 7*int, int, int)) {
      settingsPage = 2;
    }
    
    //Player 2 Controls button
    if(checkRect(4*int, int, 2*int, int)) p2Controls = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
    if(checkRect(6*int, int, 2*int, int)) p2Controls = ['w', 'a', 's', 'd'];
    
    //Player 2 Speed buttons
    for(let i=0;i<4;i++) {
      if(checkRect((4+i)*int, 3*int, int, int)) p2Speed = pow(2, i-5);
    }
    
    //Player 2 Colour buttons
    for(let i=0;i<8;i++) {
      if(checkCirc((4.25+0.5*i)*int, 5.25*int, 0.3*int)) p2Colours[0] = selectableCols[i];
      if(checkCirc((4.25+0.5*i)*int, 5.75*int, 0.3*int)) p2Colours[1] = selectableCols[i];
    }
      
    return;
  }
}

//Manages keyboard inputs in settings
function settingsKeyPressed() {
  
}

//Creates a box with text that is highlighted when hovered
function highlightableBox(x, y, w, h, message, condition) {
  
  fill(60);
  if(checkRect(x, y, w, h)) fill(100);
  if(condition) fill(150);
  noStroke();
  rect(x, y, w, h);
  fill(255);
  text(message, x + w / 2, y + h / 2);
  
}




class Snake {
    //Run when the snake is initialised
    constructor(keys, speed, cols) {
      this.segments = [];
      this.speed = speed;
      this.segmentQueue = [];
      this.controlScheme = keys;
      this.moveOrder = [];
      for (let i = 0; i < 4; i++) {
        let xv = (i - 2) * (i % 2) * this.speed;
        let yv = (i - 1) * ((i + 1) % 2) * this.speed;
        this.moveOrder[i] = createVector(xv, yv);
      }
      this.generate();
      this.cols = cols;
    }
  
    //Run to reset the snake
    generate() {
      this.segments = [];
      this.segmentQueue = [];
      let available = getAvailableCells();
      let chosen = random(available);
      let xDir = chosen.x < gridDim.x / 2 ? 3 : 1;
      let yDir = chosen.y < gridDim.y / 2 ? 2 : 0;
      let dir = random(1) < 0.5 ? xDir : yDir;
      let vel = this.moveOrder[dir];
      this.segments.push([chosen, vel]);
      this.lastInput = -1;
      this.nextInput = -1;
      this.score = 0;
      this.dead = false;
    }
  
    //Ran every frame
    update() {
      for (let segment of this.segments) {
        segment[0].x = round(segment[0].x + segment[1].x, 5);
        segment[0].y = round(segment[0].y + segment[1].y, 5);
      }
      let head = this.segments[0][0];
      if (head.x % 1 == 0 && head.y % 1 == 0) {
        this.gridUpdate();
      }
      this.show();
    }
  
    //Ran everytime the snake hits a grid cell
    gridUpdate() {
      for (let i = this.segments.length - 1; i > 0; i--) {
        this.segments[i][1] = this.segments[i - 1][1].copy();
      }
      let head = this.segments[0];
      if(this.lastInput > -1) {
        let nextMove = this.moveOrder[this.lastInput].copy();
        if(nextMove.x + head[1].x != 0 || nextMove.y + head[1].y != 0) {
          this.segments[0][1] = nextMove;
        } else {
          if(this.nextInput > -1) {
            nextMove = this.moveOrder[this.nextInput].copy();
            this.segments[0][1] = nextMove;
            this.nextInput = -1;
          }
        }
        this.lastInput = this.nextInput;
        this.nextInput = -1;
      }
      
      this.checkForFruit();
  
      for (let i = this.segmentQueue.length - 1; i >= 0; i--) {
        let segment = this.segmentQueue[i];
        if (segment[0] == 0) {
          this.segments.push([segment[1].copy(), segment[2].copy()]);
          this.segmentQueue.splice(i, 1);
        } else {
          segment[0]--;
        }
      }
      this.checkForDeath();
      if(this.dead) {
        this.generate();
      }
    }
  
    //Run to check if a fruit is collected
    checkForFruit() {
      let head = this.segments[0];
      for (let i = fruits.length - 1; i >= 0; i--) {
        let fruit = fruits[i];
        if (head[0].x == fruit.x && head[0].y == fruit.y) {
          let counter = this.segments.length;
          counter += this.segmentQueue.length;
          let pos = head[0].copy();
          let vel = head[1].copy();
          this.segmentQueue.push([counter, pos, vel]);
          fruits.splice(i, 1);
          addNewFruit();
          this.score++;
          if(this.score > highscore) {
            highscore = this.score;
            localStorage.setItem('snakehighScore', this.score);
          }
        }
      }
    }
  
    //Run whenever an input is pressed
    inputPressed() {
      if (this.controlScheme.includes(key)) {
        let inputIndex = this.controlScheme.indexOf(key);
        if(this.lastInput > -1) {
          if(this.nextInput > -1) {
            this.lastInput = this.nextInput;
          }
          this.nextInput = inputIndex;
        } else {
          this.lastInput = inputIndex;
        }
      }
    }
  
    //Run to draw the snake
    show() {
      for (let i=0;i<this.segments.length;i++) {
        let segment = this.segments[i][0];
        let cellSizeX = gridSize.x / gridDim.x;
        let cellSizeY = gridSize.y / gridDim.y;
        let x = segment.x * cellSizeX;
        let y = segment.y * cellSizeY;
        x += borderSize.x + cellSizeX / 2;
        y += borderSize.y + cellSizeY / 2;
        noStroke();
        if(i%2 == 0) {
          fill(this.cols[0]);
        } else {
          fill(this.cols[1]);
        }
        ellipse(x, y, cellSizeX, cellSizeY);
      }
    }
    
    //Check if the snake has died
    checkForDeath() {
      let head = this.segments[0];
      let vel = head[1].copy().setMag(1);
      let nextPos = p5.Vector.add(head[0].copy(), vel);
      
      let count = 0;
      for(let snake of snakes) {
        for(let i=0;i<snake.segments.length;i++) {
          let segment = snake.segments[i][0].copy();
          let distance = nextPos.dist(segment);
          if(distance < 0.1) {
            this.dead = true;
          }
        }
      }
      
      if(count > 1) {
        
      }
      
      if(nextPos.x < 0 || nextPos.x > gridDim.x - 1) {
        this.dead = true;
      }
      if(nextPos.y < 0 || nextPos.y > gridDim.y - 1) {
        this.dead = true;
      }
      
    }
  }
  