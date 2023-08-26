let sortType, anim, arr, arrSize, drawDelay, drawFreq, comparisons, timeTaken, finishedSorting, avgs;
let sortTypes, arrSizes, drawDelays, drawFreqs, randomise;

function setup() {

    var canvas = createCanvas(800,800);
    canvas.parent('sketch-holder');
    windowResized();
    textAlign(CENTER, CENTER);

    sortType = 'Bubble sort';
    arrSize = 100;
    drawDelay = 1;
    drawFreq = 1;
    randomise = true;

    sortTypes = ['Bubble sort', 'Insertion sort', 'Cocktail shaker sort', "Bucket sort", "Counting sort", "Selection sort"];
    arrSizes = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
    drawDelays = [1, 2, 10, 50, 100, 500, 1000, 2000, 10000];
    drawFreqs = [1, 2, 5, 10, 20, 50, 100, 500, 1000, 10000, 100000];

    avgs = [
        [45, 190, 1225, 4950, 19900, 124750, 499500, 1999000, 12497500, 49995000, 199990000], //bubble avgs
        [25, 90,  600,  2500, 8000,  60000,  230000, 950000,  5900000,  2400000,  100000000], //insertion avgs
        [45, 190, 1225, 4950, 19900, 124750, 499500, 1999000, 12497500, 49995000, 199990000], //shaker avgs
        [10,  30,  130,  400,  1400,   7000,  25000,  100000,   620000,  2400000,  10000000], //bucket avgs
        [20,  40,  100,  200,   400,   1000,   2000,    4000,    10000,    20000,     40000], //counting avgs
        [45, 190, 1225, 4950, 19900, 124750, 499500, 1999000, 12497500, 49995000, 199990000]  //selection avgs
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
        case 'Bucket sort':
            bucketSort();
            break;
        case 'Counting sort':
            countingSort();
            break;
        case 'Selection sort':
            selectionSort();
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
    text(`This will take approximately ${floor(avgs[sortTypes.indexOf(sortType)][arrSizes.indexOf(arrSize)] / drawFreq)} frames to draw`, width / 2, 3.5 * width / 10);
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

    if(!randomise) {
        arr = Array.from(Array(arrSize).keys());
        arr = arr.sort(() => (Math.random() > .5) ? 1 : -1);
    } else {
        arr = [];
        for(let i = 0; i < arrSize; i++) {
            arr.push(floor(random() * arrSize));
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

function bubbleSort() {

    let completed = 0;
    let draws = 0;
    let startTime = round(millis());
    let extraTime = 0;

    while(completed < arr.length) {

        let swapHappened = false;

        for(let i = 0; i < arr.length - completed - 1; i++) {
            if(arr[i] > arr[i+1]) {
                swap(i, i+1);
                swapHappened = true;
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

        if(!swapHappened) completed = arr.length;

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

        let swapHappened = false;

        for(let i = completed; i < arr.length - completed - 1; i++) {
            if(arr[i] > arr[i+1]) {
                swap(i, i+1);
                swapHappened = true;
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
                swapHappened = true;
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

        if(!swapHappened) completed = arr.length;

    }

    timeTaken = round(millis() - startTime - extraTime);

    setTimeout(function() {
        finishedSorting = true;
    }, drawDelay * (draws / drawFreq))

    print(`Cocktail ${arr.length} in ${draws} draws`);

}

function bucketSort() {

    let buckets = [];
    let startTime = round(millis());
    let extraTime = 0;
    let draws = 0;

    let n = 10;

    function drawState(cArr, cHigh) {
        let extraTimeStart = millis();
        if(draws % drawFreq == 0) {
            let currentArr = cArr.map(e => (e.length) ? e.join(' ') : e).join(' ');
            let currentComp = comparisons;
            setTimeout(function() {
                drawArray(currentArr, currentComp, cHigh); 
            }, drawDelay * (draws / drawFreq));
        }
        extraTime += millis() - extraTimeStart;
        draws++;
    }

    //Creating N buckets
    for(let i=0; i<n; i++) {
        buckets[i] = [];
    }

    //Splitting array into bins
    arr.forEach((e,i) => {
        buckets[floor(map(e, 0, arr.length, 0, n))].push(e);
        drawState(arr, [i]);
        comparisons++;
    });

    //Sort each bucket
    let bucketWidth = max(buckets.map(e => e.length));
    for(let i=1; i<bucketWidth; i++) {
        for(let j=0; j<buckets.length;j++) {
            for(let k=i;k>0;k--) {
                if(buckets[j][k]) {
                    if(buckets[j][k] < buckets[j][k-1]) {
                        let temp = buckets[j][k];
                        buckets[j][k] = buckets[j][k-1];
                        buckets[j][k-1] = temp;
                    } else {
                        k = 0;
                    }
                    comparisons++;
                }
                drawState(buckets, [j * bucketWidth + k, j * bucketWidth + k - 1]);
            }
        }
    }

    //Redo first bucket for some reason
    for(let i=1; i<buckets[0].length; i++) {
        for(let k=i;k>0;k--) {
            if(buckets[0][k] < buckets[0][k-1]) {
                let temp = buckets[0][k];
                buckets[0][k] = buckets[0][k-1];
                buckets[0][k-1] = temp;
            } else {
                k = 0;
            }
            comparisons++;
            drawState(buckets, [k, k - 1]);
        }
    }

    //Combine buckets into array
    arr = [];
    buckets.forEach(e => e.forEach(f => arr.push(f)));

    timeTaken = round(millis() - startTime - extraTime);

    setTimeout(function() {
        finishedSorting = true;
    }, drawDelay * (draws / drawFreq));

    print(`Bucket ${arr.length} in ${draws} draws`);

}

function countingSort() {

    let startTime = round(millis());
    let extraTime = 0;
    let draws = 0;

    //Set up initial array
    let counts = [];
    for(let i=0;i<arr.length;i++) {
        counts[i] = 0;
    }

    //Get counts
    arr.forEach((e,i) => {
        counts[e]++;
        comparisons++;
        let extraTimeStart = millis();
        if(draws % drawFreq == 0) {
            let currentArr = arr.join(' ');
            let currentComp = comparisons;
            setTimeout(function() {
                drawArray(currentArr, currentComp, [i]); 
            }, drawDelay * (draws / drawFreq));
        }
        extraTime += millis() - extraTimeStart;
        draws++;
    });

    //Create new array
    arr = Array(arr.length).map(e => 0);

    //Fill new array
    let index = 0;
    counts.forEach((e,i) => {
        for(let k=0;k<e;k++) {
            arr[index] = i;
            index++;
        }
        let extraTimeStart = millis();
        if(draws % drawFreq == 0) {
            let currentArr = arr.join(' ');
            let currentComp = comparisons;
            setTimeout(function() {
                drawArray(currentArr, currentComp, [i]); 
            }, drawDelay * (draws / drawFreq));
        }
        extraTime += millis() - extraTimeStart;
        draws++;
    });



    timeTaken = round(millis() - startTime - extraTime);

    setTimeout(function() {
        finishedSorting = true;
    }, drawDelay * (draws / drawFreq));

    print(`Counting ${arr.length} in ${draws} draws`);

}

function selectionSort() {

    let startTime = round(millis());
    let extraTime = 0;
    let draws = 0;

    for(let i = 0; i < arr.length; i++) {
        let smallestIndex = i;
        let smallestValue = arr[i];
        for(let j = i + 1; j < arr.length; j++) {
            if(arr[j] < smallestValue) {
                smallestValue = arr[j];
                smallestIndex = j;
            }
            comparisons++;

            let extraTimeStart = millis();
            if(draws % drawFreq == 0) {
                let currentArr = arr.join(' ');
                let currentComp = comparisons;
                setTimeout(function() {
                    drawArray(currentArr, currentComp, [i]); 
                }, drawDelay * (draws / drawFreq));
            }
            extraTime += millis() - extraTimeStart;
            draws++;
        }
        swap(i, smallestIndex);
    }



    timeTaken = round(millis() - startTime - extraTime);

    setTimeout(function() {
        finishedSorting = true;
    }, drawDelay * (draws / drawFreq));

    print(`Selection ${arr.length} in ${draws} draws`);

}

function swap(x, y) {

    let temp = arr[x];
    arr[x] = arr[y];
    arr[y] = temp;

}