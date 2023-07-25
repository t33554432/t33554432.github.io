let state, anim;

function setup() {

    var canvas = createCanvas(800,800);
    canvas.parent('sketch-holder');
    windowResized();
    textAlign(CENTER, CENTER);
    state = 'menu';
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

    let inc = width / 5;
    if(checkRect(inc, 2 * inc, 3 * inc, inc)) {
        state = 'game';
        resetBoard();
    }

}

function gameDraw() {

    background(255);
    let inc = width / 64;
    strokeWeight(inc * 0.5);
    stroke(0);
    fill(220);
    rect(inc, 65 * inc, 14 * inc, 14 * inc, 10);
    noStroke();
    fill(0);
    textSize(inc * 4);
    text('Back', 8 * inc, 72 * inc);

}

function gamePressed() {

    let inc = width / 64;
    if(checkRect(inc, 65 * inc, 14 * inc, 14 * inc,)) {
        state = 'menu';
        resetBoard();
    }

}

function resetBoard() {

    anim = [0, []];

}

function checkRect(x, y, w, h) {

    let c1 = mouseX >= x;
    let c2 = mouseX <= x + w;
    let c3 = mouseY >= y;
    let c4 = mouseY <= y + h;
    return c1 && c2 && c3 && c4;

}