let sortType, anim, arr, arrSize, drawDelay, drawFreq, comparisons, timeTaken, finishedSorting, avgs;
let sortTypes, arrSizes, drawDelays, drawFreqs;

function setup() {

    var canvas = createCanvas(800,800);
    canvas.parent('sketch-holder');
    windowResized();
    textAlign(CENTER, CENTER);

    sortType = 'Bubble sort';
    arrSize = 100;
    drawDelay = 1;
    drawFreq = 1;

    sortTypes = ['Bubble sort', 'Insertion sort', 'Cocktail shaker sort'];
    arrSizes = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
    drawDelays = [1, 2, 10, 50, 100, 500, 1000, 2000, 10000];
    drawFreqs = [1, 2, 5, 10, 20, 50, 100, 500, 1000, 10000, 100000];

    avgs = [
        [45, 190, 1225, 4950, 19900, 124750, 499500, 1999000, 12497500, 49995000, 199990000], //bubble avgs
        [25, 90,  600,  2500, 8000,  60000,  230000, 950000,  5900000,  2400000,  100000000], //insertion avgs
        [45, 190, 1225, 4950, 19900, 124750, 499500, 1999000, 12497500, 49995000, 199990000] //shaker avgs
    ];

    finishedSorting = true;
    arr = [];
}

function startSort() {

    comparisons = 0;
    timeTaken = 0;
    finishedSorting = false;
    randomiseArray();
    drawArray(arr.join(' '), 0, []);

    switch(sortType) {
        case 'Bubble sort':
            bubbleSort();
            break;
        case 'Insertion sort':
            insertionSort();
            break;
        case 'Cocktail shaker sort':
            shakerSort();
            break;
    }

}

function windowResized() {
    // Resize the canvas to fit the div
    var holderWidth = document.getElementById('sketch-holder').offsetWidth;
    resizeCanvas(holderWidth * 0.95, holderWidth * 0.95 * 1.5);
}
  
// Call windowResized() whenever the window is resized
window.addEventListener('resize', windowResized);

function draw() {
    if(finishedSorting) {
        drawArray(arr.join(' '), (comparisons) ? comparisons : 0, []);
    }
}

function drawArray(currentArr, currentComp, highlights) {

    background(0);

    currentArr = currentArr.split(' ');

    noStroke();
    let cellWidth = width / currentArr.length;
    for(let x = 0; x < currentArr.length; x++) {
        if(highlights.includes(x)) {
            fill(255,0,0);
        } else {
            fill(255);
        }
        if(finishedSorting) {
            fill(0,255,0);
        }
        rect(x * cellWidth, height - currentArr[x] * cellWidth, cellWidth + 1, currentArr[x] * cellWidth);
    }
    textSize(16);
    fill(255);
    text(`Comparisons: ${currentComp}`, width / 5, width / 10);
    text(`Time taken: ${(timeTaken) ? (timeTaken / 1000) : 0}s`, 4 * width / 5, width / 10);
    text(`Sort type: ${sortType}`, width / 2, 1.5 * width / 10);
    text(`Array Size: ${arrSize} elements`, width / 2, 2 * width / 10);
    text(`Draw delay: ${drawDelay / 1000}s`, width / 2, 2.5 * width / 10);
    text(`Draw frequency: ${drawFreq} comparisons per frame`, width / 2, 3 * width / 10);
    text(`This will take approximately ${floor(drawDelay * avgs[sortTypes.indexOf(sortType)][arrSizes.indexOf(arrSize)] / drawFreq) / 1000} seconds to draw`, width / 2, 3.5 * width / 10);
    text(`Start`, width / 2, 4 * width / 10);
    for(let i=0;i<4;i++) {
        beginShape();
        vertex(0.8 * width, 0.14 * width + i * 0.05 * width);
        vertex(0.8 * width, 0.16 * width + i * 0.05 * width);
        vertex(0.81 * width, 0.15 * width + i * 0.05 * width);
        endShape();
        beginShape();
        vertex(0.2 * width, 0.14 * width + i * 0.05 * width);
        vertex(0.2 * width, 0.16 * width + i * 0.05 * width);
        vertex(0.19 * width, 0.15 * width + i * 0.05 * width);
        endShape();
    }

}

function mousePressed() {

    if(checkRect(0.18 * width, 0.13 * width, 0.03 * width, 0.04 * width)) {
        sortType = sortTypes[(sortTypes.indexOf(sortType) - 1 + sortTypes.length) % sortTypes.length];
    }
    if(checkRect(0.18 * width, 0.18 * width, 0.03 * width, 0.04 * width)) {
        arrSize = arrSizes[(arrSizes.indexOf(arrSize) - 1 + arrSizes.length) % arrSizes.length];
    }
    if(checkRect(0.18 * width, 0.23 * width, 0.03 * width, 0.04 * width)) {
        drawDelay = drawDelays[(drawDelays.indexOf(drawDelay) - 1 + drawDelays.length) % drawDelays.length];
    }
    if(checkRect(0.18 * width, 0.28 * width, 0.03 * width, 0.04 * width)) {
        drawFreq = drawFreqs[(drawFreqs.indexOf(drawFreq) - 1 + drawFreqs.length) % drawFreqs.length];
    }

    if(checkRect(0.79 * width, 0.13 * width, 0.03 * width, 0.04 * width)) {
        sortType = sortTypes[(sortTypes.indexOf(sortType) + 1) % sortTypes.length];
    }
    if(checkRect(0.79 * width, 0.18 * width, 0.03 * width, 0.04 * width)) {
        arrSize = arrSizes[(arrSizes.indexOf(arrSize) + 1) % arrSizes.length];
    }
    if(checkRect(0.79 * width, 0.23 * width, 0.03 * width, 0.04 * width)) {
        drawDelay = drawDelays[(drawDelays.indexOf(drawDelay) + 1) % drawDelays.length];
    }
    if(checkRect(0.79 * width, 0.28 * width, 0.03 * width, 0.04 * width)) {
        drawFreq = drawFreqs[(drawFreqs.indexOf(drawFreq) + 1) % drawFreqs.length];
    }

    if(checkRect(2 * width / 5, 3.8 * width / 10, width / 5, 0.4 * width / 10) && finishedSorting) {
        startSort();
    }

}

function randomiseArray() {

    arr = Array.from(Array(arrSize).keys());
    arr = arr.sort(() => (Math.random() > .5) ? 1 : -1);

}

function checkRect(x, y, w, h) {

    let c1 = mouseX >= x;
    let c2 = mouseX <= x + w;
    let c3 = mouseY >= y;
    let c4 = mouseY <= y + h;
    return c1 && c2 && c3 && c4;

}

function bubbleSort() {

    let completed = 0;
    let draws = 0;
    let startTime = round(millis());
    let extraTime = 0;

    while(completed < arr.length) {

        for(let i = 0; i < arr.length - completed - 1; i++) {
            if(arr[i] > arr[i+1]) {
                swap(i, i+1);
            }
            comparisons++;
            let extraTimeStart = millis();
            if(draws % drawFreq == 0) {
                let currentArr = arr.join(' ');
                let currentComp = comparisons;
                setTimeout(function() {
                    drawArray(currentArr, currentComp, [i, i + 1]); 
                }, drawDelay * (draws / drawFreq));
            }
            extraTime += millis() - extraTimeStart;
            draws++;
        }

        completed++;

    }

    timeTaken = round(millis() - startTime - extraTime);

    setTimeout(function() {
        finishedSorting = true;
    }, drawDelay * (draws / drawFreq));

    print(`Bubble ${arr.length} in ${draws} draws`);

}

function insertionSort() {

    let draws = 0;
    let startTime = round(millis());
    let extraTime = 0;

    for(let i = 0; i < arr.length; i++) {
        for(let j = i; j > 0; j--) {
            if(arr[j] < arr[j - 1]) {
                swap(j, j - 1);
            } else {
                j = 0;
            }
            comparisons++;
            let extraTimeStart = millis();
            if(draws % drawFreq == 0) {
                let currentArr = arr.join(' ');
                let currentComp = comparisons;
                setTimeout(function() {
                    drawArray(currentArr, currentComp, [j]); 
                }, drawDelay * (draws / drawFreq));
            }
            extraTime += millis() - extraTimeStart;
            draws++;
        }
    }
    
    timeTaken = round(millis() - startTime - extraTime);

    setTimeout(function() {
        finishedSorting = true;
    }, drawDelay * (draws / drawFreq))

    print(`Insertion ${arr.length} in ${draws} draws`);

}

function shakerSort() {

    let completed = 0;
    let draws = 0;
    let startTime = round(millis());
    let extraTime = 0;

    while(completed < arr.length / 2) {

        for(let i = completed; i < arr.length - completed - 1; i++) {
            if(arr[i] > arr[i+1]) {
                swap(i, i+1);
            }
            comparisons++;
            let extraTimeStart = millis();
            if(draws % drawFreq == 0) {
                let currentArr = arr.join(' ');
                let currentComp = comparisons;
                setTimeout(function() {
                    drawArray(currentArr, currentComp, [i, i + 1]); 
                }, drawDelay * (draws / drawFreq));
            }
            extraTime += millis() - extraTimeStart;
            draws++;
        }

        for(let i = arr.length - completed - 1; i > completed; i--) {
            if(arr[i] < arr[i-1]) {
                swap(i, i-1);
            }
            comparisons++;
            let extraTimeStart = millis();
            if(draws % drawFreq == 0) {
                let currentArr = arr.join(' ');
                let currentComp = comparisons;
                setTimeout(function() {
                    drawArray(currentArr, currentComp, [i, i - 1]); 
                }, drawDelay * (draws / drawFreq));
            }
            extraTime += millis() - extraTimeStart;
            draws++;
        }

        completed++;

    }

    timeTaken = round(millis() - startTime - extraTime);

    setTimeout(function() {
        finishedSorting = true;
    }, drawDelay * (draws / drawFreq))

    print(`Cocktail ${arr.length} in ${draws} draws`);

}

function swap(x, y) {

    let temp = arr[x];
    arr[x] = arr[y];
    arr[y] = temp;

}