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
    playingField.addEventListener('click', (click) => {
        if (playSound) {
            const audio = new Audio()
            audio.src = 'sound/a.mp3'
            audio.autoplay = true
        }
    
        const x = (click.pageX - playingField.offsetLeft) / (playingField.width / areaSize) | 0
        const y = (click.pageY - playingField.offsetTop)  / (playingField.width / areaSize) | 0
        changeCellPosition(x, y)
        drawCells(ctx, playingField.width / areaSize, cellImage)
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
    playingField = document.createElement("canvas")
    if (windowWidth > 800) {
        playingField.width = 500
        playingField.height = 500
    } else if (windowWidth > 300) {
        playingField.width = 300 
        playingField.height = 300
    } else if (windowWidth > 200) {
        playingField.width = 200 
        playingField.height = 200
    } else {
        playingField.width = 100 
        playingField.height = 100
    }
    ctx = playingField.getContext("2d")
    ctx.fillStyle = backgroundColors.seaColor
    ctx.fillRect(0, 0, playingField.width, playingField.height)
    document.body.insertBefore(playingField, document.body.childNodes[0])
}

/**
 * Create items arr
*/
function createCellsArr() {
    const zeroCell = 0
    const firstCell = 1
    for (let i = 0; i < areaSize; i++) {
        cellsArr.push([])
        for (let j = firstCell; j <= areaSize; j++) {
            cellsArr[i].push(i * areaSize + j)
        }
    }
    cellsArr[cellsArr.length - 1][cellsArr.length - 1] = zeroCell
}

/**
 * Get empty cell
*/
function getEmptyCell() {
    for (let i = 0; i < areaSize; i++) {
        for (let j = 0; j < areaSize; j++) {
            const isEmptyCell = cellsArr[i][j] === 0
            if (isEmptyCell) {
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
    return Math.round(Math.random()) === 1
}

/**
 * Change items arr to move later
*/
function changeCellPosition(x, y) {
    const zeroCell = 0
    const emptyCell = getEmptyCell()
    let xEmptyCell = emptyCell.x 
    let yEmptyCell = emptyCell.y
    const isEmptyClosed = ((x - 1 === xEmptyCell || x + 1 === xEmptyCell) && y === yEmptyCell) || ((y - 1 === yEmptyCell || y + 1 === yEmptyCell) && x === xEmptyCell)
    if (isEmptyClosed) { 
        cellsArr[yEmptyCell][xEmptyCell] = cellsArr[y][x] /** Write the chip to the array in place of the empty cell */
        cellsArr[y][x] = zeroCell 
        clicksCount++
    }
}

/**
 * Check victory
*/
function checkVictory() {
    const zeroCell = 0
    let victoryCellArr = []
    let currentCellArr = []
    const firstCell = 1
    const greatestCellNumber = areaSize ** 2 - 1

    for (let i = firstCell; i <= greatestCellNumber; i++) {
        victoryCellArr.push(i)
    }
    victoryCellArr.push(zeroCell)
    const victoryString = victoryCellArr.join(' ')

    for (let i = 0; i <= greatestCellNumber; i++) {
        currentCellArr.push(cellsArr[Math.floor(i / areaSize)][i % areaSize])
    }
    const currentString = currentCellArr.join(' ')

    const isVictory = currentString === victoryString

    if (isVictory) {
        const winClicksCount = clicksCount

        /**
         * Animation for victory
        */
        const intervalID = setInterval(() => {
            const mixStepsCount = 10
            mixCells(mixStepsCount)
            drawCells(ctx, playingField.width / areaSize, cellImage)
        }, 20 /** Speed of animation */)

        /**
         * End animation
         * Result record
         * Output win picture and win alert
        */
        setTimeout(() => {
            clearInterval(intervalID)
        
            let saveResultArr = []
            const isResultSaved = localStorage.getItem(areaSize.toString()) === null
            const resultsMaxCount = 10
            function limitResultsCount() {
                if (saveResultArr.length === resultsMaxCount + 1) {
                    saveResultArr.splice(resultsMaxCount, 1)
                }
            }

            if (isResultSaved) {
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
                            i += resultsMaxCount
                            limitResultsCount()
                        }
                    } else {
                        saveResultArr.splice(i, 0, winClicksCount.toString())
                        i += resultsMaxCount
                        limitResultsCount()
                    }
                }
            }
            localStorage.setItem(areaSize, saveResultArr)

            cellsArr = []
            createCellsArr()
            drawCells(ctx, playingField.width / areaSize, cellImage)
            alert(`Ура! Вы решили головоломку за ${stringTime} и ${winClicksCount} ходов`)
        }, 1000 /** Time of animation*/)
    }
}

/**
 * Mix items
 * @param {number} mixStepsCount Count of mix steps
*/
function mixCells(mixStepsCount) {
    const startClicksCount = 0
    const minCellPositionValue = 0
    let x
    let y

    for (let i = 0; i < mixStepsCount; i++) {
        const emptyCell = getEmptyCell()
        let xEmptyCell = emptyCell.x
        let yEmptyCell = emptyCell.y

        let upRightMove = getRandomBool()
        let upLeftMove = getRandomBool()

        if (!upRightMove && !upLeftMove) { y = yEmptyCell; x = xEmptyCell - 1;}
        if (upRightMove && !upLeftMove)  { x = xEmptyCell; y = yEmptyCell + 1;}
        if (!upRightMove && upLeftMove)  { y = yEmptyCell; x = xEmptyCell + 1;}
        if (upRightMove && upLeftMove)   { x = xEmptyCell; y = yEmptyCell - 1;}

        if (minCellPositionValue <= x && x <= areaSize - 1 && minCellPositionValue <= y && y <= areaSize - 1) {
            changeCellPosition(x, y)
        }
    }
    clicksCount = startClicksCount
}

/**
 * Output items on the canvas
 * Fill canvas
 * Fill items by color or image
*/
function drawCells(context, size, cellImage) {
    const emptyCell = 0
    ctx.fillStyle = backgroundColors.seaColor
    ctx.fillRect(0, 0, playingField.width, playingField.height)

    if (styleOfPuzzle === 0) { 
        for (let i = 0; i < areaSize; i++) {
            for (let j = 0; j < areaSize; j++) {
                if (cellsArr[i][j] !== emptyCell) { 
                    context.fillStyle = backgroundColors.blackColor
                    context.fillRect(j * size + 1, i * size + 1, size - 2, size - 2)

                    context.font = "bold " + (size / 2) + "px Sans-serif"
                    context.textAlign = "center"
                    context.textBaseline = "middle"
                    context.fillStyle = backgroundColors.seaColor
                    context.fillText(cellsArr[i][j], j * size + size / 2, i * size + size / 2 + size / 32)
                }
            }
        }
    } else if (styleOfPuzzle === 1) {
        for (let i = 0; i < areaSize; i++) {
            for (let j = 0; j < areaSize; j++) {
                if (cellsArr[i][j] !== emptyCell) { 
                    context.drawImage(cellImage, ((cellsArr[i][j] - 1) % areaSize) * size + 1, Math.floor((cellsArr[i][j] - 1) / areaSize) * size + 1, size - 2, size - 2, j * size + 1, i * size + 1, size - 2, size - 2)
                }
            }
        }
    } else if (styleOfPuzzle === 2) {
        for (let i = 0; i < areaSize; i++) {
            for (let j = 0; j < areaSize; j++) {
                if (cellsArr[i][j] !== emptyCell) { 
                    context.drawImage(cellImage, ((cellsArr[i][j] - 1) % areaSize) * size + 1, Math.floor((cellsArr[i][j] - 1) / areaSize) * size + 1, size - 2, size - 2, j * size + 1, i * size + 1, size - 2, size - 2)

                    context.font = "bold " + (size / 2) + "px Sans-serif"
                    context.textAlign = "center"
                    context.textBaseline = "middle"
                    context.fillStyle = backgroundColors.seaColor
                    context.fillText(cellsArr[i][j], j * size + size / 2, i * size + size / 2 + size / 32);
                }
            }
        }
    }
}