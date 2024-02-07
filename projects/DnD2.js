let userIDs, names, cols, timers, games, localGames, localScores;

function setup() {

    var canvas = createCanvas(800,800);
    canvas.parent('sketch-holder');
    windowResized();
    textAlign(CENTER, CENTER);
    userIDs = [];
    names = [];
    timers = [];
    cols = ['#FFADAD', '#ffd6a5', '#fdffb6', '#caffbf', 
            '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'];
    games = ['WaitingScreen', 'CupGame'];
    localGames = [];
    localScores = [];
}

function windowResized() {
    // Resize the canvas to fit the div
    var holderHeight = document.getElementById('sketch-holder').offsetHeight;
    resizeCanvas(holderHeight * 0.95, holderHeight * 0.95);
}
  
// Call windowResized() whenever the window is resized
window.addEventListener('resize', windowResized);

// Database player reference
const allPlayersRef = firebase.database().ref(`players`);

// Initial node creation
firebase.auth().onAuthStateChanged((user) => {

    allPlayersRef.on("child_added", (snapshot) => {
        if(snapshot.key != user.uid) {
            userIDs.push(snapshot.key);
            names.push(`Player ${names.length + 1}`);
            timers.push(0);
            updateScore(snapshot.key);
            localGames.push(getGame(userIDs.length-1));
            let playerRef = firebase.database().ref(`players/${snapshot.key}`);
            playerRef.on("child_changed", (a) => {
                updateScore(snapshot.key);
            });

        }
    });

    allPlayersRef.on("child_removed", (snapshot) => {
        let removed = userIDs.indexOf(snapshot.key);
        userIDs.splice(removed, 1);
        names.splice(removed, 1);
        timers.splice(removed, 1);
        localGames.splice(removed, 1);
        playerRef.off("child_changed", (a) => {
            updateScore(snapshot.key);
        });
    });

})

// Catches error
firebase.auth().signInAnonymously().catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage);
});

function setTimer(player, time) {
    playerID = userIDs[player];
    playerRef = firebase.database().ref(`players/${playerID}`);

    playerRef.transaction(function(playerData) {
        if (playerData) {
            playerData.timer = time;
            if(timers[player] < 10) {
                timers[player] += millis();
            }   
            timers[player] += time;
        }
        return playerData;
    });
}

function resetScore(player) {
    playerID = userIDs[player];
    playerRef = firebase.database().ref(`players/${playerID}`);

    playerRef.transaction(function(playerData) {
        if (playerData) {
            playerData.score = 0;
        }
        return playerData;
    });
}

function updateScore(id) {
    let index = userIDs.indexOf(id);
    playerRef = firebase.database().ref(`players/${id}`);

    playerRef.transaction(function(playerData) {
        if (playerData) {
            localScores[index] = playerData.score;
        }
        return playerData;
    });
}

function setScore(player, score) {
    playerID = userIDs[player];
    playerRef = firebase.database().ref(`players/${playerID}`);

    playerRef.transaction(function(playerData) {
        if (playerData) {
            playerData.score = score;
            localScores[player] = score;
        }
        return playerData;
    });
}

function setGame(player, game) {
    playerID = userIDs[player];
    playerRef = firebase.database().ref(`players/${playerID}`);

    playerRef.transaction(function(playerData) {
        if (playerData) {
            playerData.game = game;
            localGames[player] = game;
        }
        return playerData;
    });
}

function getGame(player, game) {
    playerID = userIDs[player];
    playerRef = firebase.database().ref(`players/${playerID}`);
    let result = "";

    playerRef.transaction(function(playerData) {
        if (playerData) {
            result = playerData.game;
        }
        return playerData;
    });
    return result;
}

function draw() {
    background(255);
    if(millis() > 500) {
        let n = userIDs.length;
        textSize(40 * (1 / sqrt(n)));
        let cellWidth = width / n;
        let inc = height / 13;
        for(let i=0;i<n;i++) {
            textFont('Consolas');
            let x = i * cellWidth;
            let cx = x + 0.5 * cellWidth;
            noStroke();
            fill(cols[i]);
            rect(x,0,cellWidth,height);
            fill(0);
            text(names[i], cx, inc);
            text(localScores[i], cx, 2 * inc);
            text("Add 5 secs", cx, 3 * inc);
            text("Add 30 secs", cx, 4 * inc);
            let timeLeft = 0;
            if(timers[i] - millis() >= 0) {
                timeLeft = timers[i] - millis();
            } else {
                timers[i] = 0;
            }
            text(`${floor(timeLeft / 60000)}:${(floor((timeLeft % 60000)/1000) < 10) ? 0 : ''}${floor((timeLeft % 60000)/1000)}`, cx, 5 * inc);
            text(`Game: ${localGames[i]}`, cx, 6 * inc);
            text("Reset score", cx, 7 * inc);
        }
        fill(255);
        rect(0, 8*inc, width, 15*inc);
        fill(0);
        textSize(32);
        text("Add 5 secs", width / 2, 9 * inc);
        text("Add 30 secs", width / 2, 10 * inc);
        text("Reset scores", width / 2, 11 * inc);
        text(`Game: ${localGames[0]}`, width / 2, 12 * inc);

    }
}

function checkRect(x, y, w, h) {

    let c1 = mouseX >= x;
    let c2 = mouseX <= x + w;
    let c3 = mouseY >= y;
    let c4 = mouseY <= y + h;
    return c1 && c2 && c3 && c4;

}

function mousePressed() {
    if(millis() > 1000) {
        let n = userIDs.length;
        let cellWidth = width / n;
        let inc = height / 13;
        for(let i=0;i<n;i++) {
            let x = i * cellWidth;
            if(checkRect(x, 2.5*inc, cellWidth, inc)) {
                setTimer(i, 5000);
            }
            if(checkRect(x, 3.5*inc, cellWidth, inc)) {
                setTimer(i, 30000);
            }
            if(checkRect(x, 5.5*inc, cellWidth, inc)) {
                setGame(i, games[(games.indexOf(localGames[i]) + 1) % games.length]);
            }
            if(checkRect(x, 6.5*inc, cellWidth, inc)) {
                setScore(i, 0);
            }
        }
        if(checkRect(0, 8.5*inc, width, inc)) {
            for(let i=0;i<userIDs.length;i++) {
                setTimer(i, 5000);
            }
        }
        if(checkRect(0, 9.5*inc, width, inc)) {
            for(let i=0;i<userIDs.length;i++) {
                setTimer(i, 30000);
            }
        }
        if(checkRect(0, 10.5*inc, width, inc)) {
            for(let i=0;i<userIDs.length;i++) {
                setScore(i, 0);
            }
        }
        if(checkRect(0, 11.5*inc, width, inc)) {
            for(let i=userIDs.length-1;i>-1;i--) {
                setGame(i, games[(games.indexOf(localGames[0]) + 1) % games.length]);
            }
        }
    }
}

function keyPressed() {
    if(millis() > 1000) {
        let n = userIDs.length;
        let cellWidth = width / n;
        let inc = height / 13;
        for(let i=0;i<n;i++) {
            let x = i * cellWidth;
            if(checkRect(x, 0.5*inc, cellWidth, inc)) {
                let name = names[i];
                if(key == "Backspace") {
                    name = name.slice(0,-1);
                } else {
                    if(key.length == 1) {
                        name += key;
                    }
                }
                names[i] = name;
            }
        }
    }
}