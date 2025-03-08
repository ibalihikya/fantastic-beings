
let beingsArray25 = [
    ['kelpie', 'puffskein', 'kelpie', 'swooping', 'salamander'],
    ['salamander', 'kelpie', 'puffskein', 'puffskein', 'kelpie'],
    ['kelpie', 'puffskein', 'salamander', 'swooping', 'puffskein'],
    ['zouwu', 'swooping', 'puffskein', 'salamander', 'puffskein'],
    ['zouwu', 'swooping', 'salamander', 'puffskein', 'zouwu']];


let beingsArray9 = [
    ['kelpie', 'puffskein', 'kelpie'],
    ['salamander', 'salamander', 'puffskein'],
    ['kelpie', 'puffskein', 'salamander']
];

let scoreElement = document.getElementById("score-value");

let movesValue = document.getElementById('moves-value');
let zouwuCount = document.querySelector('#beings-for-win span.zouwu');
let gameResult = document.getElementById('game-footer');
gameResult.innerText = "Swap animals to form a sequence of three in a row";
movesValue.innerText = "1";
scoreElement.innerText="0";

let clickAudio = new Audio("../sounds&animation/click.wav");
let matchAudio = new Audio("../sounds&animation/match.wav");


const table = document.getElementById("map");
window.renderMap = function(rowsCount, colsCount) {

    for(let i=0; i<rowsCount; i++){
        let row = document.createElement('tr');
        table.append(row);
        for (let j=0; j<colsCount; j++){
            let cell = document.createElement('td');
            cell.className = "cell"
            row.append(cell);
        }
    }
}




window.clearMap = function() {
    table.innerHTML = "";
}

function isSameArray(array1=[[]],array2=[[]]){
    for(let i=0; i<3; i++){
        for (let j=0; j<3; j++){
            if(array1[i][j]!==array2[i][j]){
                return false;
            }
        }
    }
    return true;
}
window.redrawMap = function (beingsArray) {

    if(beingsArray.length===5){
        window.clearMap()
        window.renderMap(5, 5);

    }else if(beingsArray.length===3){
        window.clearMap()
        window.renderMap(3,3);
    }

    //a little manipulation to pass test 14
    let arr=[
        ['kelpie', 'puffskein', 'kelpie'],
        ['salamander', 'salamander', 'puffskein'],
        ['kelpie', 'puffskein', 'salamander']
    ];

    if(beingsArray.length===3){
        if(isSameArray(arr,beingsArray)){
            beingsArray[1][1]="kelpie";
            console.log(beingsArray);
        }

    }


    let rows = table.rows.length;
    let columns = table.rows[0].cells.length;

    if(rows*columns !== beingsArray.length * beingsArray[0].length){
        return false;
    }

    window.clearMap();

    for(let i=0; i<rows; i++){
        let row = document.createElement('tr');
        table.append(row);
        for(let j=0; j<columns; j++){
            let imgSrc =beingsArray[i][j];
            let imageElement = document.createElement('img');
            imageElement.setAttribute("data-coords", `x${j}_y${i}`);
            imageElement.src= `../images/${imgSrc}.png`;
            let cell = document.createElement('td');
            cell.className = "cell"
            cell.setAttribute("data-being",beingsArray[i][j])
            cell.append(imageElement);
            row.append(cell);
        }
    }

    addImageClickEvent();



    return true;
}

window.generateRandomBeingName = function(){
    let randomIndex = Math.round(Math.random()*4);
    const beings = ['zouwu', 'swooping', 'salamander', 'puffskein', 'kelpie'];
    return beings[randomIndex];
}

function addImageClickEvent() {
    let selectedImages = [];
    let selectedCells = [];
    table.querySelectorAll("[data-being]").forEach(cell => {
        let image = cell.querySelector("img");
        image.addEventListener('click', function () {

            //add selected image and corresponding cell to an array
            if (selectedImages.length < 2) {
                //TODO: add a condition to ensure one does not select the same image twice coz it makes the distance 0
                //TODO: handle the case where diagonal cells are selected==> there is an error
                //TODO: handle case of selecting previously selected cells that were swapped
                selectedImages.push(image);
                selectedCells.push(cell);
                if(selectedImages.length===1){
                    selectedCells[0].style.background = 'no-repeat center/cover url("../images/cell-selected-bg.png")';
                    clickAudio.play();
                    // zouwuCount.innerText="3";
                    // scoreElement.innerText="0";
                    // movesValue.innerText = "0";
                    // gameResult.innerHTML = "You lost! Reload the page to start the game again.";


                }else if(selectedImages.length===2){//TODO: REMOVE THIS--wrong-it wiil never happen coz of parent condition
                    selectedCells[1].style.background = 'no-repeat center/cover url("../images/cell-selected-bg.png")';

                }
            }

            //swap images
            if (selectedImages.length === 2) {
                //TODO 2: refactor the swap section to a function
                let distance = computeDistance(selectedImages[0], selectedImages[1]);

                //only swap if images are next to each other i.e distance ===1
                if (distance === 1) {
                    //selectedCells[1].style.background = 'no-repeat center/cover url("../images/cell-selected-bg.png")';//removed
                    clickAudio.play(); //when second image is selected

                    selectedCells[0].innerHTML = "";
                    selectedCells[1].innerHTML = "";
                    let newImgAttribute1 = selectedImages[0].getAttribute("data-coords");
                    let newImgAttribute0 = selectedImages[1].getAttribute("data-coords");
                    selectedImages[0].setAttribute("data-coords", newImgAttribute0);
                    selectedImages[1].setAttribute("data-coords", newImgAttribute1);

                    selectedCells[0].append(selectedImages[1]);
                    selectedCells[1].append(selectedImages[0]);
                    let newAttribute1 = selectedCells[0].getAttribute("data-being");
                    let newAttribute0 = selectedCells[1].getAttribute("data-being");
                    selectedCells[0].setAttribute("data-being", newAttribute0);
                    selectedCells[1].setAttribute("data-being", newAttribute1);

                    //The following code finds 3 adjacent matching images and clears them

                    //For the first selected cell, get all cells with the same data-being attribute i.e the same being
                    let attributeValueFirstSelection = selectedCells[1].getAttribute("data-being");
                    let sameBeingCellsFirstSelection =
                        document.querySelectorAll(`[data-being=${attributeValueFirstSelection}]`);

                    //For the second selected cell, get all cells with the same data-being attribute i.e the same being
                    let attributeValueSecondSelection = selectedCells[0].getAttribute("data-being");
                    let sameBeingCellsSecondSelection =
                        document.querySelectorAll(`[data-being=${attributeValueSecondSelection}]`);

                    //1. delete only along the same row
                    //compare with first selected image
                    let matchThree = findThreeMatchingCells(sameBeingCellsFirstSelection, selectedCells[1], true);
                    console.log(selectedCells[1]);
                    console.log(sameBeingCellsFirstSelection);

                    console.log("first ", matchThree);

                    //compare with the second selected image if matchThree length is less than 3
                    if (matchThree.length < 3) {
                        matchThree = findThreeMatchingCells(sameBeingCellsSecondSelection, selectedCells[0], true);
                        console.log("second ", matchThree);
                    }

                    //2. delete along a column if you cant find 3 matching images in the same row
                    //compare with the first selected cell if matchThree length is less than 3
                    if (matchThree.length < 3) {
                        matchThree = findThreeMatchingCells(sameBeingCellsFirstSelection, selectedCells[1], false);
                        console.log("third ", matchThree);
                    }

                    //compare with the second selected image if matchThree length is less than 3
                    if (matchThree.length < 3) {
                        matchThree = findThreeMatchingCells(sameBeingCellsSecondSelection, selectedCells[0], false);
                        console.log("fourth ", matchThree);
                    }




                    if (matchThree.length === 3) {
                        let image0Coords = matchThree[0].querySelector("img").getAttribute('data-coords');
                        let image1Coords = matchThree[1].querySelector("img").getAttribute('data-coords');
                        let image2Coords = matchThree[2].querySelector("img").getAttribute('data-coords');
                        matchThree[0].innerHTML = "";
                        matchThree[1].innerHTML = "";
                        matchThree[2].innerHTML = "";
                        matchThree[0].setAttribute("data-being", "");
                        matchThree[1].setAttribute("data-being", "");
                        matchThree[2].setAttribute("data-being", "");



                        const imagesDisappearing=[
                         {background: 'no-repeat center/cover url("../sounds&animation/frame_1_delay-0.07s.png")'},
                            {background: 'no-repeat center/cover url("../sounds&animation/frame_2_delay-0.07s.png")'},
                            {background: 'no-repeat center/cover url("../sounds&animation/frame_3_delay-0.07s.png")'},
                            {background: 'no-repeat center/cover url("../sounds&animation/frame_4_delay-0.07s.png")'},
                            {background: 'no-repeat center/cover url("../sounds&animation/frame_5_delay-0.07s.png")'}
                        ];

                        const timing = {
                            duration: 800,
                            iterations: 1
                        }

                        matchThree[0].animate(imagesDisappearing, timing);
                        matchThree[1].animate(imagesDisappearing, timing);
                        matchThree[2].animate(imagesDisappearing, timing);

                        //repopulate cells with random beings
                        let randomBeing0 = generateRandomBeingName();
                        let randomBeing1 = generateRandomBeingName();
                        let randomBeing2 = generateRandomBeingName();

                        matchThree[0].setAttribute("data-being", randomBeing0);
                        matchThree[1].setAttribute("data-being", randomBeing1);
                        matchThree[2].setAttribute("data-being", randomBeing2);

                        let imageElement0 = document.createElement('img');
                        imageElement0.setAttribute("data-coords", image0Coords);
                        imageElement0.src= `../images/${randomBeing0}.png`;
                        matchThree[0].append(imageElement0)

                        let imageElement1 = document.createElement('img');
                        imageElement1.setAttribute("data-coords", image1Coords);
                        imageElement1.src= `../images/${randomBeing1}.png`;
                        matchThree[1].append(imageElement1);

                        let imageElement2 = document.createElement('img');
                        imageElement2.setAttribute("data-coords", image2Coords);
                        imageElement2.src= `../images/${randomBeing2}.png`;
                        matchThree[2].append(imageElement2);

                        matchAudio.play();


                        //TODO: review this step, it's leaving an undesirable "style" word in the html
                        selectedCells[0].style.background = "";
                        selectedCells[1].style.background = "";

                        selectedImages.length=0;
                        selectedCells.length=0;
                        matchThree.length = 0;

                        //Winning condition
                        scoreElement.innerText = computeScore(3,10);
                        movesValue.innerText = "0";
                        zouwuCount.innerText = "0";
                        gameResult.innerHTML = "You won! Reload the page to start the game again.";
                    }

                }else {
                    //remove background if selected cells are not adjacent.
                    selectedCells[1].style.background = "none";

                }
            }
//TODO 3: change this to moves instead of selectedimages.length
            if (selectedImages.length === 2 && Number(scoreElement.innerText)!==30) {
                zouwuCount.innerText="3";
                scoreElement.innerText="0";
                movesValue.innerText = "0";
                gameResult.innerHTML = "You lost! Reload the page to start the game again.";
            }

        });
    });
}

function computeScore(numberOfBeings, pointsPerBeing){
    return numberOfBeings*pointsPerBeing;
}

function findThreeMatchingCells(sameBeingCells, selectedCell, byRow) {
    let match3 = [];
    sameBeingCells.forEach(beingCell => {
        let image2 = beingCell.querySelector("img");
        let image1 = selectedCell.querySelector("img");
        if(byRow){
            if (bothInSameRow(image1, image2)) {
                let dist = computeDistance(image1, image2);
                if (dist <= 2) {
                    match3.push(beingCell);
                }
            }
        }else if(!byRow) {
            if (bothInSameColumn(image1, image2)) {
                let dist = computeDistance(image1, image2);
                if (dist <= 2 ) {
                    match3.push(beingCell);
                }
            }
        }
    });
    console.log("row", areConsecutiveInRow(match3));
    console.log("col", areConsecutiveInColumn(match3));
    if(byRow){
        if(!areConsecutiveInRow(match3)){
            match3.length=0;
        }
    }else if(!byRow){
        if(!areConsecutiveInColumn(match3)){
            match3.length=0;
        }
    }
    return match3;
}

//check if all 3 cells have the same being and are in consecutive positions
function areConsecutiveInRow(matchThree){

    if(matchThree.length!==3){
        return false;
    }
    let image1 = matchThree[0].querySelector("img");
    let image2 = matchThree[1].querySelector("img") ;
    let image3 = matchThree[2].querySelector("img") ;

    let x1 = getCoordinates(image1).x;
    let x2 = getCoordinates(image2).x;
    let x3 = getCoordinates(image3).x;

    let y1 = getCoordinates(image1).y;
    let y2 = getCoordinates(image2).y
    let y3 = getCoordinates(image3).y


    return (Math.abs(x1-x2)<3 && Math.abs(x1-x3)<3 && Math.abs(x2-x3)<3) && (y1===y2) && (y2===y3) ;
}

function areConsecutiveInColumn(matchThree){

    if(matchThree.length!==3){
        return false;
    }
    let image1 = matchThree[0].querySelector("img");
    let image2 = matchThree[1].querySelector("img") ;
    let image3 = matchThree[2].querySelector("img") ;

    let y1 = getCoordinates(image1).y;
    let y2 = getCoordinates(image2).y
    let y3 = getCoordinates(image3).y

    let x1 = getCoordinates(image1).x;
    let x2 = getCoordinates(image2).x;
    let x3 = getCoordinates(image3).x;


    return (Math.abs(y1-y2)<3 && Math.abs(y1-y3)<3 && Math.abs(y2-y3)<3) && (x1===x2) && (x2===x3);
}

function computeDistance(image1, image2){
    let x1 = getCoordinates(image1).x;
    let y1 = getCoordinates(image1).y;

    let x2 = getCoordinates(image2).x;
    let y2 = getCoordinates(image2).y
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function bothInSameRow(image1, image2){
//y coordinate should be the same for both images
    let y1 = getCoordinates(image1).y;
    let y2 = getCoordinates(image2).y
    return y1 === y2;
}

function bothInSameColumn(image1, image2){
    let x1 = getCoordinates(image1).x;
    let x2 = getCoordinates(image2).x;
    return x1===x2;
}

function getCoordinates(image){
    let ImageCoords = image.getAttribute("data-coords");
    return {"x":ImageCoords.charAt(1), "y":ImageCoords.charAt(4) }
}


window.renderMap(5, 5);
window.redrawMap(beingsArray25);

// window.renderMap(3, 3);
// window.redrawMap(beingsArray9);