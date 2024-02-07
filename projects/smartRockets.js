let spawn, target;
let rockets;
let count;
let maxLength;
let numOfRockets;
let mutationChance;
let updatesPerFrame;
let maxForce;
let maxSpeed;
let obstacles;
let targetRadius;
let generation;
let prevSuccess;
let rocketsCompleted;
let offset;

function setup() {
var canvas = createCanvas(800, 800);
  canvas.parent('sketch-holder');
  windowResized();
  offset = width / 8;
  rockets = [];
  numOfRockets = 500;
  mutationChance = 0.00005;
  updatesPerFrame = 1;
  generation = 1;
  maxLength = 150;
  maxForce = 3;
  maxSpeed = 5;
  prevSuccess = 0;
  rocketsCompleted = 0;
  spawn = createVector(4 * offset, 7 * offset);
  target = createVector(4 * offset, offset);
  targetRadius = offset / 2;
  count = 0;
  noStroke();
  for(let i = 0; i < numOfRockets; i++) {
    rockets[i] = new Rocket();
  }
  obstacles = [];
  obstacles.push([-5, -5, 5, height + 10]);
  obstacles.push([-5, -5, width + 10, 5]);
  obstacles.push([width, -5, 5, height + 10]);
  obstacles.push([-5, height, width + 10, 5]);
  
  
  obstacles.push([0, 5 * offset, 4 * offset, offset / 4]);
  obstacles.push([4 * offset, 4 * offset, 4 * offset, offset / 4]);
  obstacles.push([0, 3 * offset, 4 * offset, offset / 4]);
  
}

function windowResized() {
    // Resize the canvas to fit the div
    var holderWidth = document.getElementById('sketch-holder').offsetWidth;
    resizeCanvas(holderWidth * 0.95, holderWidth * 0.95 * 12 / 11);
}
  
// Call windowResized() whenever the window is resized
window.addEventListener('resize', windowResized);

function draw() {
  background(0);
  
  fill(255);
  ellipse(target.x, target.y, 2 * targetRadius);
  textSize(offset / 4);
  textAlign(CENTER, CENTER);
  text('Generation: ' + generation, offset, offset / 2);
  text('Success:' + prevSuccess + '%', width - offset, offset / 2);
  if(count >= maxLength) {
    count = 0;
    resetRockets();
  }
  obstacles.forEach(ob => {
    rect(ob[0], ob[1], ob[2], ob[3]);
  });
  for(let i = 0; i < updatesPerFrame; i++) {
    count++;
    rockets.forEach(e => {
      e.update();
      if(i % updatesPerFrame == 0 || i == maxLength) {
        e.show();
      }
    });
  }
}

function resetRockets() {
  prevSuccess = 100 * rocketsCompleted / numOfRockets;
  rocketsCompleted = 0;
  let newRockets = [];
  let values = [];
  rockets.forEach(e => {
    e.calculateVal();
    values.push(e.val);
  });
  let total = values.reduce((a, b) => a + b, 0);
  for(let i = 0; i < numOfRockets; i++) {
    let ranA = random(total);
    let ranB = random(total);
    let indexA = -1;
    let indexB = -1;
    let index = 0;
    while(indexA == -1 || indexB == -1) {
      ranA -= values[index];
      ranB -= values[index];
      if(ranA < 0) indexA = index;
      if(ranB < 0) indexB = index;
      index++;
    }
    let newdna = rockets[indexA].combine(rockets[indexB]);
    newRockets.push(new Rocket(newdna));
  }
  generation++;
  rockets = newRockets;
}

function mousePressed() {
  if(updatesPerFrame == 1) updatesPerFrame = 5;
  else if(updatesPerFrame == 5) updatesPerFrame = 10;
  else if(updatesPerFrame == 10) updatesPerFrame = 20;
  else if(updatesPerFrame == 20) updatesPerFrame = 30;
  else if(updatesPerFrame == 30) updatesPerFrame = 50;
  else if(updatesPerFrame == 50) updatesPerFrame = maxLength;
  else if(updatesPerFrame == maxLength) updatesPerFrame = 1;
}



class Rocket{
  
    constructor(dna) {
      this.pos = spawn.copy();
      this.v = createVector(0,-10);
      this.a = createVector(0);
      this.finished = 0;
      this.crashed = false;
      this.dna = [];
      this.val = 0;
      this.prev = [];
      if(dna) { 
        this.dna = dna;
      } else {
        for(let i = 0; i < maxLength; i++) {
          this.dna[i] = createVector(random(-maxForce, maxForce), random(-maxForce, maxForce));
        }
      }
    }
    
    update() {
      if(this.finished == 0 && !this.crashed) {
        this.pos.add(this.v);
        this.prev.push(this.pos.copy());
        this.v.add(this.a);
        this.v.limit(maxSpeed);
        this.a.setMag(0);
        if(count < maxLength) {
          this.applyForce(this.dna[count]);
        }
        obstacles.forEach(ob => {
          if(this.pos.x > ob[0] && this.pos.x < ob[0] + ob[2] && this.pos.y > ob[1] && this.pos.y < ob[1] + ob[3]) {
            this.crashed = true;
          }
        });
        if(dist(this.pos.x, this.pos.y, target.x, target.y) < targetRadius) {
          rocketsCompleted++;
          this.finished = count;
        }
      }
    }
    
    calculateVal() {
      this.val = 1 / (dist(this.pos.x, this.pos.y, target.x, target.y) ** 2);
      if(this.finished > 0) {
        this.val = 100 * maxLength / this.finished;
      } else if(this.crashed) {
        this.val /= 2;
      }
    }
    
    combine(other) {
      let newdna = [];
      for(let i = 0; i < maxLength; i++) {
        newdna[i] = (random() < 0.5) ? this.dna[i].copy() : other.dna[i].copy();
        if(random() < 0.05) {
          newdna[i] = createVector(random(-1, 1), random(-1, 1));
        }
      }
      return newdna;
    }
    
    applyForce(vec) {
      this.a = vec.copy();
    }
    
    show() {
      if(this.finished > 0) {
        stroke(0, 255, 0, 50);
        noFill();
        beginShape();
        this.prev.forEach(e => {
          vertex(e.x, e.y);
        });
        endShape();
      }
      noStroke();
      fill(255, 120);
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.v.heading());
      triangle(-5, -5, -5, 5, 10, 0);
      pop();
    }
    
  }