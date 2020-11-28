let areaSize = 4
let clicksCount = 0

let canvasArea
let cellsArr = []

let playSound = true
styleOfPuzzle = 0

let cellImage = new Image()
cellImage.src = `img/${Math.floor(Math.random() * (8 - 1 + 1) + 1)}.jpg`



/** 
 * Game initialization when body is onload
*/
function initializeGame() {
    createGameArea()
    createCellsArr()
    mixCells(50000)
    saveGame()
    elementUserArea = document.createElement('div')
    elementUserArea.classList.add("user__wrap")
    document.body.insertBefore(elementUserArea, document.body.childNodes[1])
    showTimeAndClicksCount()
    chooseSize()
    changeStyleOfPuzzle()
    turnAudio()
    showBestResult()
    //createUserArea()
    cellImage.onload = drawCells(ctx, canvasArea.width / areaSize, cellImage)
    moveCell()
}


