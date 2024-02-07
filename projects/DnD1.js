let userInfo, timer, localScore, localGame, timeLeft;
let anim, cups, cupFrames, cupLength, movesList, stoneOutside;

function setup() {

    var canvas = createCanvas(800,800);
    canvas.parent('sketch-holder');
    windowResized();
    textAlign(CENTER, CENTER);
    timer = 0;
    localScore = 0;
    localGame = 'WaitingScreen';
    timeLeft = 0;
    anim = [0,[]];

}

function windowResized() {
    // Resize the canvas to fit the div
    var holderWidth = document.getElementById('sketch-holder').offsetWidth;
    resizeCanvas(holderWidth * 0.95, holderWidth * 0.95 * 5.2 / 4);
}
  
// Call windowResized() whenever the window is resized
window.addEventListener('resize', windowResized);

// Database player reference
const allPlayersRef = firebase.database().ref(`players`);

// Initial node creation
firebase.auth().onAuthStateChanged((user) => {
    
    userInfo = user;
    playerID = user.uid;
    playerRef = firebase.database().ref(`players/${playerID}`);

    playerRef.set({
        id: playerID,
        score: 0,
        timer: 0,
        game: localGame
    });

    playerRef.on("child_changed", (a) => {
        readScore();
        readTime();
        readGame();
    });

    playerRef.onDisconnect().remove();

})

// Catches error
firebase.auth().signInAnonymously().catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage);
});

// Incriments the score by x
function addScore(x) {
    playerID = userInfo.uid;
    playerRef = firebase.database().ref(`players/${playerID}`);

    playerRef.transaction(function(playerData) {
        if (playerData) {
            playerData.score = (playerData.score || 0) + x;
            localScore += x;
        }
        return playerData;
    });
}

// Resets the player score
function resetScore() {
    playerID = userInfo.uid;
    playerRef = firebase.database().ref(`players/${playerID}`);

    playerRef.transaction(function(playerData) {
        if (playerData) {
            playerData.score = 0;
        }
        return playerData;
    });
}

function readTime() {
    playerID = userInfo.uid;
    playerRef = firebase.database().ref(`players/${playerID}`);

    playerRef.transaction(function(playerData) {
        if (playerData) {
            if(playerData.timer > 0) {
                if(timer == 0) {
                    timer = playerData.timer + millis();
                } else {
                    timer += playerData.timer;
                }
                playerData.timer = 0;
            }
        }
        return playerData;
    });
}

function resetScore() {
    playerID = userInfo.uid;
    playerRef = firebase.database().ref(`players/${playerID}`);

    playerRef.transaction(function(playerData) {
        if (playerData) {
            playerData.score = 0;
            localScore = 0;
        }
        return playerData;
    });
}

function readGame() {
    playerID = userInfo.uid;
    playerRef = firebase.database().ref(`players/${playerID}`);
    let oldGame = localGame;

    playerRef.transaction(function(playerData) {
        if (playerData) {
            localGame = playerData.game;
        }
        return playerData;
    });

    if(oldGame != localGame) {
        if(localGame == "CupGame") {
            createCups();
        }
    }
}

function readScore() {
    playerID = userInfo.uid;
    playerRef = firebase.database().ref(`players/${playerID}`);

    playerRef.transaction(function(playerData) {
        if (playerData) {
            localScore = playerData.score;
        }
        return playerData;
    });
}

function updateTimer() {
    if(timer > 0) {
        timeLeft = timer - millis();
        if(timeLeft <= 0) {
            timeLeft = 0;
            timer = 0;
        }
    }
}

function checkRect(x, y, w, h) {

    let c1 = mouseX >= x;
    let c2 = mouseX <= x + w;
    let c3 = mouseY >= y;
    let c4 = mouseY <= y + h;
    return c1 && c2 && c3 && c4;

}

function draw() {

    background(0);
    updateTimer();

    switch(localGame) {

        case "WaitingScreen":
            drawWaitingScreen();
            break;
        case "CupGame":
            drawCupGame();
            break;

    }


}

function mousePressed() {
    
    switch(localGame) {

        case "WaitingScreen":
            pressWaitingScreen();
            break;
        case "CupGame":
            pressCupGame();
            break;

    }

}

function drawWaitingScreen() {

    background(0);
    textSize(32);
    fill(255);
    text(`${floor(timeLeft / 60000)}:${(floor((timeLeft % 60000)/1000) < 10) ? 0 : ''}${floor((timeLeft % 60000)/1000)}`, width / 2, height / 2);
    text(`Score: ${localScore}`, width / 2, height * 0.75);

}

function pressWaitingScreen() {
    if(checkRect(0,0,width,height)) {
        addScore(1);
    }
}

function drawCupGame() {

    background(0);

    
    let n = cups.length;
    if(stoneOutside[1]<height/2) {
        fill(255);
        ellipse(stoneOutside[0],stoneOutside[1],30);
    }
    if(stoneOutside[2]<0) {
        stoneOutside[1]++;
        stoneOutside[2]++;
        if(stoneOutside[2]>0) {
            stoneOutside[2]=0; 
        }
        if(stoneOutside[2] == 0) {
            generateMovesList(cupLength);
        }
    }
    if(stoneOutside[2]>0) {
        stoneOutside[1]--;
        stoneOutside[2]--;
        if(stoneOutside[2]<0) {
            stoneOutside[2]=0;
            
        }
    }
    fill(200,0,0);
    cups.forEach((v,i) => {
        let inc = width / n;
        rect(v.x*inc+0.25*inc, height/2+v.y*inc-0.3*inc, inc*0.5, inc*0.6);
    });
    if(anim[0] > 0) {
        for(let i=0;i<cups.length;i++) {
            if(anim[1][i][cupFrames-1-anim[0]]) {
                cups[i].x = anim[1][i][cupFrames+1-anim[0]].x;
                cups[i].y = anim[1][i][cupFrames+1-anim[0]].y;
            }
        }
        anim[0]--;
        if(anim[0] == 0) {
            for(let i=0;i<cups.length;i++) {
                anim[1][i] = [];
            }
            if(movesList.length > 0) {
                doMove(movesList[0]);
                movesList.splice(0,1);
            }
        }
    }

}

function createCups() {
    cups = [];
    let n = 5;
    for(let i=0;i<n;i++) {
        cups[i] = createVector(i,0);
        anim[1][i] = [];
    }
    cupFrames = 5;
    cupLength = 20;
    movesList = [];
    stoneOutside = [0.5*width/n,height/4,0];
    
}

function moveCup(pos1, pos2, flavour) {

    let cup = getCup(pos1);
    let result = [];
    for(let i=0;i<cupFrames;i++) {
        let x = map(i,0,cupFrames,pos1,pos2);
        let y = 0;
        switch(flavour) {
            case 'UP':
                y = map((cupFrames/2-i) ** 2,(cupFrames/2)**2,0,0,-1);
                break;
            case 'FLAT':
                y = 0;
                break;
            case 'DOWN':
                y = map((cupFrames/2-i) ** 2,(cupFrames/2)**2,0,0,1);
                break;
            case 'WIGGLE':
                if(i<cupFrames/2) {
                    y = map((cupFrames/4-i) ** 2,(cupFrames/4)**2,0,0,1);
                } else {
                    y = map((3*cupFrames/4-i) ** 2,(cupFrames/4)**2,0,0,-1);
                }
                break;
            case 'INVWIGGLE':
                if(i<cupFrames/2) {
                    y = map((cupFrames/4-i) ** 2,(cupFrames/4)**2,0,0,-1);
                } else {
                    y = map((3*cupFrames/4-i) ** 2,(cupFrames/4)**2,0,0,1);
                }
                break;
            case "WRAPAROUND":
                if(i<cupFrames/2) {
                    y = map(i,0,cupFrames,0,height/(width/cups.length));
                } else {
                    y = map(i,0,cupFrames,-height/(width/cups.length),0);
                }
                break;
            case "WRAPAROUND":
                if(i<cupFrames/2) {
                    y = map(i,0,cupFrames,0,-height/(width/cups.length));
                } else {
                    y = map(i,0,cupFrames,height/(width/cups.length),0);
                }
                break;
        }
        result.push(createVector(x,y));
    }
    result.push(createVector(pos2,0));
    anim[1][cup] = result;
    anim[0] = cupFrames+1;

}

function pressCupGame() {
    if(anim[0] > 0 || movesList.length > 0 || stoneOutside[2] != 0) {
        return;
    }
    if(checkRect(0,0,width,height)) {
        if(stoneOutside[1] < height / 2) {
            stoneOutside[2] = -height/4;
        } else {
            let newPos = cups[0].x;
            stoneOutside[0] = (newPos + 0.5) * (width / cups.length);
            stoneOutside[2] = height / 4;
        }
    }
}

function swap(a, b) {
    if(anim[0] > 0 || a == b) {
        return;
    }
    let flavours = ['UP', 'FLAT', 'DOWN', 'WIGGLE', 'INVWIGGLE', 'WRAPAROUND', 'INVWRAPAROUND'];
    moveCup(a, b, random(flavours));
    moveCup(b, a, random(flavours));
}

function special(type) {
    if(anim[0] > 0) {
        return;
    }
    if(type == 'cw') {
        for(let i=0;i<cups.length-1;i++) {
            moveCup(i,i+1,'FLAT');
        }
        if(random() < 0.5) {
            moveCup(cups.length-1,0,'UP');
        } else {
            if(random() < 0.8) {
                moveCup(cups.length-1,0,'DOWN');
            } else {
                moveCup(cups.length-1,0,'WIGGLE');
            }
        }
    }
    if(type == 'ccw') {
        for(let i=0;i<cups.length-1;i++) {
            moveCup(i+1,i,'FLAT');
        }
        if(random() < 0.5) {
            moveCup(0,cups.length-1,'UP');
        } else {
            if(random() < 0.8) {
                moveCup(0,cups.length-1,'DOWN');
            } else {
                moveCup(0,cups.length-1,'WIGGLE');
            }
        }
    }
}

function getCup(index) {
    
    let result = 0;
    cups.forEach((e,i) => {
        if(e.x  == index) {
            result = i;
        }
    })
    return result;

}

function doMove(move) {
    if(move[0] == 's') {
        special(move[1]);
    } else {
        swap(move[0], move[1]);
    }
}

function generateMovesList(length) {
    movesList = [];
    let specials = ['cw','ccw'];
    for(let i=0;i<length;i++) {
        if(random()<0.3) {
            movesList.push(['s',random(specials)]);
        } else {
            let r1 = floor(random(cups.length));
            let r2 = floor(random(cups.length));
            while(r2 == r1) {
                r2 = floor(random(cups.length));
            }
            movesList.push([r1, r2]);
        }
    }
    anim[0] = 1;
}
