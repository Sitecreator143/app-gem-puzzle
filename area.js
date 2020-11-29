/**
 * Resume game from localStorage
*/
function saveGame() {
    const wasSavedGames = localStorage.getItem('savedGames') !== null
    const wasSavedGamesSize = localStorage.getItem('savedGamesSize') !== null
    if (wasSavedGames  && wasSavedGamesSize) {
        const savedGamePositions = localStorage.getItem('savedGames').split(',')
        areaSize = +localStorage.getItem('savedGamesSize')
        clicksCount = +localStorage.getItem('savedGamesSteps')
        cellsArr = []
        for (let i = 0; i < areaSize; i++) {
            cellsArr.push([])
        }
        for (let i = 0; i < areaSize; i++) {
            for (let j = 0; j < areaSize; j++) {
                cellsArr[i][j] = +savedGamePositions[i * areaSize + j ]
            }
        }
    }
}

/**
 * Move items
*/
function moveCell() {
    /**
     * Process clicks
    */
    canvasArea.addEventListener('click', (click) => {
        if (playSound) {
            const audio = new Audio()
            audio.src = 'sound/a.mp3'
            audio.autoplay = true
        }
    
        const x = (click.pageX - canvasArea.offsetLeft) / (canvasArea.width / areaSize) | 0
        const y = (click.pageY - canvasArea.offsetTop)  / (canvasArea.width / areaSize) | 0
        changeCellPosition(x, y)
        drawCells(ctx, canvasArea.width / areaSize, cellImage)
        checkVictory()
        localStorage.setItem('savedGames', cellsArr)
        localStorage.setItem('savedGamesSize', areaSize)
        localStorage.setItem('savedGamesSteps', clicksCount)
    })  
}

/**
 * Create area
*/
function createGameArea() {
    const windowWidth = document.documentElement.clientWidth
    canvasArea = document.createElement("canvas") 
    if (windowWidth > 800) {
        canvasArea.width = 500
        canvasArea.height = 500
    } else if (windowWidth > 300) {
        canvasArea.width = 300 
        canvasArea.height = 300
    } else if (windowWidth > 200) {
        canvasArea.width = 200 
        canvasArea.height = 200
    } else {
        canvasArea.width = 100 
        canvasArea.height = 100
    }
    ctx = canvasArea.getContext("2d")
    ctx.fillStyle = "#5F9EA0"
    ctx.fillRect(0, 0, canvasArea.width, canvasArea.height)
    document.body.insertBefore(canvasArea, document.body.childNodes[0])
}

/**
 * Create items arr
*/
function createCellsArr() {
    for (let i = 0; i < areaSize; i++) {
        cellsArr.push([])
        for (let j = 1; j <= areaSize; j++) {
            cellsArr[i].push(i * areaSize + j)
        }
    }
    cellsArr[cellsArr.length - 1][cellsArr.length - 1] = 0
}

/**
 * Get empty cell
*/
function getEmptyCell() {
    for (let i = 0; i < areaSize; i++) {
        for (let j = 0; j < areaSize; j++) {
            if (cellsArr[i][j] === 0) {
                return {
                    "x" : j, 
                    "y" : i
                }
            }
        }
    }
}

/**
 * Get random boolean
*/
function getRandomBool() {
    if (Math.floor(Math.random() * 2) === 0) {
        return true
    } else {
        return false
    }
}

/**
 * Change items arr to move later
*/
function changeCellPosition(x, y) {
    let nullX = getEmptyCell().x 
    let nullY = getEmptyCell().y
    const isEmptyClose = ((x - 1 === nullX || x + 1 === nullX) && y === nullY) || ((y - 1 === nullY || y + 1 === nullY) && x === nullX)
    if (isEmptyClose) { 
        cellsArr[nullY][nullX] = cellsArr[y][x] 
        cellsArr[y][x] = 0 
        clicksCount++
    }
}

/**
 * Check victory
*/
function checkVictory() {
    let arrVictoryOne = []
    for (let i = 0; i < areaSize; i++) {
        arrVictoryOne.push([])
        for (let j = 1; j <= areaSize; j++) {
            arrVictoryOne[i].push(i * areaSize + j)
        }
    }
    arrVictoryOne[arrVictoryOne.length - 1][arrVictoryOne.length - 1] = 0

    let isVictory = true
    for (let i = 0; i < areaSize; i++) {
        for (var j = 0; j < areaSize; j++) {
            if (arrVictoryOne[i][j] != cellsArr[i][j]) {
                isVictory = false
            }
        }
    }
    if (isVictory) {
        let winClicksCount = clicksCount

        /**
         * Animation for victory
        */
        const intervalID = setInterval(() => {
            mixCells(10)
            drawCells(ctx, canvasArea.width / areaSize, cellImage)
        }, 20)

        /**
         * End animation
         * Result record
         * Output win picture and win alert
        */
        setTimeout(() => {
            clearInterval(intervalID)

            let saveResultArr = []
            let isResultSaved = localStorage.getItem(areaSize.toString()) === null
            if ( isResultSaved ) {
                saveResultArr.push(winClicksCount.toString())
                saveResultArr.join('')
            } else {
                saveResultArr = localStorage.getItem(areaSize.toString()).split(',')
                for (let i = 0; i <= saveResultArr.length; i) { 
                    if (winClicksCount > +saveResultArr[i] || i === saveResultArr.length) {
                        if (i !== saveResultArr.length) {
                            i++
                        } else {
                            saveResultArr.push(winClicksCount.toString())
                            i += 10
                            if (saveResultArr.length === 11) {
                                saveResultArr.splice(10, 1)
                            }
                            saveResultArr.join('')
                        }
                    } else {
                        saveResultArr.splice(i, 0, winClicksCount.toString())
                        i += 10
                        if (saveResultArr.length === 11) {
                            saveResultArr.splice(10, 1)
                        }
                        saveResultArr.join('')
                    }
                }
            }
            localStorage.setItem(areaSize, saveResultArr)

            cellsArr = []
            createCellsArr()
            drawCells(ctx, canvasArea.width / areaSize, cellImage)
            alert(`Ура! Вы решили головоломку за ${stringTime} и ${winClicksCount} ходов`)
        }, 1000)
    }
}

/**
 * Mix items
 * @param {number} mixStepsCount Count of mix steps
*/
function mixCells(mixStepsCount) {
    let x
    let y

    for (let i = 0; i < mixStepsCount; i++) {
        let nullX = getEmptyCell().x
        let nullY = getEmptyCell().y

        let upRightMove = getRandomBool()
        let upLeftMove = getRandomBool()

        if (!upRightMove && !upLeftMove) { y = nullY; x = nullX - 1;}
        if (upRightMove && !upLeftMove)  { x = nullX; y = nullY + 1;}
        if (!upRightMove && upLeftMove)  { y = nullY; x = nullX + 1;}
        if (upRightMove && upLeftMove)   { x = nullX; y = nullY - 1;}

        if (0 <= x && x <= areaSize - 1 && 0 <= y && y <= areaSize - 1) {
            changeCellPosition(x, y)
        }
    }
    clicksCount = 0
}

/**
 * Output items on the canvas
 * Fill canvas
 * Fill items by color or image
*/
function drawCells(context, size, cellImage) {

    ctx.fillStyle = "#5F9EA0"
    ctx.fillRect(0, 0, canvasArea.width, canvasArea.height)

    if (styleOfPuzzle === 0) { 
        for (let i = 0; i < areaSize; i++) {
            for (let j = 0; j < areaSize; j++) {
                if (cellsArr[i][j] > 0) { 
                    context.fillStyle = "#000"
                    context.fillRect(j * size + 1, i * size + 1, size - 2, size - 2)

                    context.font = "bold " + (size / 2) + "px Sans-serif"
                    context.textAlign = "center"
                    context.textBaseline = "middle"
                    context.fillStyle = "#5F9EA0"
                    context.fillText(cellsArr[i][j], j * size + size / 2, i * size + size / 2 + size / 32)
                }
            }
        }
    } else if (styleOfPuzzle === 1) {
        for (let i = 0; i < areaSize; i++) {
            for (let j = 0; j < areaSize; j++) {
                if (cellsArr[i][j] > 0) { 
                    context.drawImage(cellImage, ((cellsArr[i][j] - 1) % areaSize) * size + 1, Math.floor((cellsArr[i][j] - 1) / areaSize) * size + 1, size - 2, size - 2, j * size + 1, i * size + 1, size - 2, size - 2)
                }
            }
        }
    } else if (styleOfPuzzle === 2) {
        for (let i = 0; i < areaSize; i++) {
            for (let j = 0; j < areaSize; j++) {
                if (cellsArr[i][j] > 0) { 
                    context.drawImage(cellImage, ((cellsArr[i][j] - 1) % areaSize) * size + 1, Math.floor((cellsArr[i][j] - 1) / areaSize) * size + 1, size - 2, size - 2, j * size + 1, i * size + 1, size - 2, size - 2)

                    context.font = "bold " + (size / 2) + "px Sans-serif"
                    context.textAlign = "center"
                    context.textBaseline = "middle"
                    context.fillStyle = "#093536"
                    context.fillText(cellsArr[i][j], j * size + size / 2, i * size + size / 2 + size / 32);
                }
            }
        }
    }
}