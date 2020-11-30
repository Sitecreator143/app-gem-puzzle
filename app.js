let areaSize = 4
let clicksCount = 0

let playingField
let cellsArr = []

let playSound = true
styleOfPuzzle = 0

const picturesCount = 8
const cellImage = new Image()
cellImage.src = `img/${Math.floor(Math.random() * (picturesCount) + 1)}.jpg`

const backgroundColors = {
    active: 'yellow',
    inactive: 'white',
    seaColor: '#5F9EA0',
    blackColor: '#000'
}

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
    cellImage.onload = drawCells(ctx, playingField.width / areaSize, cellImage)
    moveCell()
}


