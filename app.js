let areaSize = 4
let clicksCount = 0

let canvasArea
let cellsArr = []

let playSound = true
let typeOfPuzzle = 0

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
    divUserArea = document.createElement('div')
    divUserArea.classList.add("user__wrap")
    document.body.insertBefore(divUserArea, document.body.childNodes[1])
    showTimeAndClicksCount()
    chooseSize()
    changeType()
    turnAudio()
    showBestResult()
    //createUserArea()
    cellImage.onload = drawCells(ctx, canvasArea.width / areaSize, cellImage)
    moveCell()
}

/** 
 * User area
*/
/** 
 * Add time and turns count
*/
function showTimeAndClicksCount() {
    const divTimeAndClick = document.createElement('div')
    divTimeAndClick.classList.add("time-click-information")
    let currentDate = new Date
    let startTime = Date.now()
    let stopTime = Date.now()
    /**
     * Time output
    */
    function updateTime() {
        stopTime = Date.now()
        totalTime = stopTime - startTime
        totalTimeSec = Math.floor(totalTime / 1000) % 60
        totalTimeMin = Math.floor(totalTime / 60000) % 60
        totalTimeHours = Math.floor(totalTime / 3600000) % 60
        if (totalTimeSec < 10 && totalTimeMin < 10) {
            divTimeAndClick.innerText = `Количество ходов ${clicksCount}, время ${totalTimeHours}:0${totalTimeMin}:0${totalTimeSec}`
        } else if (totalTimeSec < 10) {
            divTimeAndClick.innerText = `Количество ходов ${clicksCount}, время ${totalTimeHours}:${totalTimeMin}:0${totalTimeSec}`
        } else if (totalTimeMin < 10) {
            divTimeAndClick.innerText = `Количество ходов ${clicksCount}, время ${totalTimeHours}:0${totalTimeMin}:${totalTimeSec}`
        } else {
            divTimeAndClick.innerText = `Количество ходов ${clicksCount}, время ${totalTimeHours}:${totalTimeMin}:${totalTimeSec}`
        }
    }
    divUserArea.insertBefore(divTimeAndClick, divUserArea.childNodes[0])
        /** 
         * Prevent text bounce
        */
    updateTime() 
    setInterval(updateTime, 1000)
}
    

/** 
 * Interface of choosing size for game area
*/
function chooseSize() {
    const divChooseSize = document.createElement('div')
    divChooseSize.classList.add("choose__size-wrap")
    divUserArea.insertBefore(divChooseSize, divUserArea.childNodes[2])

    const divChooseSizeText = document.createElement('div')
    divChooseSizeText.innerText = "Новая игра:"
    divChooseSizeText.classList.add("time-click-information")
    divUserArea.insertBefore(divChooseSizeText, divUserArea.childNodes[1])

    let sizeArr = []
    const colorArr = ['#00ff09', '#00ff1a', '#fff', '#1eff00', '#48ff00', '#8cff00', '#d9ff00', '#f7ff00', '#ffea00', '#ffc400', '#ffa600', '#ff9100', '#ff5500', '#ff2600', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000']
    for (let i = 2; i <= 21; i++) {
        sizeArr[i] = document.createElement('div')
        sizeArr[i].classList.add("choose__size")
        sizeArr[i].style.backgroundColor = `${colorArr[i - 2]}`
        sizeArr[i].innerText = i
        divChooseSize.insertBefore(sizeArr[i], divChooseSize.childNodes[i])
        sizeArr[i].addEventListener('click', () => {
            areaSize = sizeArr[i].innerText
            areaSize = +areaSize
            document.body.innerHTML = ''
            clicksCount = 0
            cellsArr = []
            playSound = true
            localStorage.removeItem('savedGames')
            localStorage.removeItem('savedGamesSize')
            localStorage.removeItem('savedGamesSteps')
            initializeGame()
        })
    }
}

/**
 * Interface of choosing type for game area
*/
function changeType() {
    const divTypeChange = document.createElement('div')
    divTypeChange.classList.add("div__audio")
    divTypeChange.innerText = `Тип: ${typeOfPuzzle + 1}`
    divUserArea.insertBefore(divTypeChange, divUserArea.childNodes[3])
    divTypeChange.addEventListener('click', () => {
        typeOfPuzzle += 1
        typeOfPuzzle %= 3
        divTypeChange.innerText = `Тип: ${typeOfPuzzle + 1}`
        drawCells(ctx, canvasArea.width / areaSize, cellImage)
    })
}

/**
 * Sound on/off
*/
function turnAudio() {
    const divAudioOn = document.createElement('div')
    divAudioOn.classList.add("div__audio")
    divAudioOn.innerText = 'audio'
    divAudioOn.style.backgroundColor = 'yellow'
    divUserArea.insertBefore(divAudioOn, divUserArea.childNodes[4])
    divAudioOn.addEventListener('click', () => {
        if (playSound) {
            divAudioOn.style.backgroundColor = 'white'
            playSound = false
        } else {
            divAudioOn.style.backgroundColor = 'yellow'
            playSound = true
        }
    })

}

/**
 * Output best results
*/
function showBestResult() {
    const divBestResult = document.createElement('div')
    divBestResult.classList.add("div__best")
    if (localStorage.getItem(areaSize.toString()) === null) {
        divBestResult.innerText = `На поле ${areaSize} x ${areaSize} не закончено ни одной партии`
    } else {
        let bestResultsArr = localStorage.getItem(areaSize.toString()).split(',')
        for (let i = 0; i <= 10; i++) {
            isNaN(+bestResultsArr[i]) ? bestResultsArr[i] = 'место не занято' : bestResultsArr[i] = bestResultsArr[i]
        }
        divBestResult.innerText = `На поле ${areaSize} x ${areaSize} у Вас рекорды: \n1 место, ходов: ${bestResultsArr[0]} \n2 место, ходов: ${bestResultsArr[1]} \n 3 место, ходов: ${bestResultsArr[2]} \n 4 место, ходов: ${bestResultsArr[3]} \n 5 место, ходов: ${bestResultsArr[4]} \n 6 место, ходов: ${bestResultsArr[5]} \n 7 место, ходов: ${bestResultsArr[6]} \n 8 место, ходов: ${bestResultsArr[7]} \n 9 место, ходов: ${bestResultsArr[8]} \n 10 место, ходов: ${bestResultsArr[9]} \n`
    }
    divUserArea.insertBefore(divBestResult, divUserArea.childNodes[5])
}

/**
 * Game Area
*/
/**
 * Resume game from localStorage
*/
function saveGame() {
    if ((localStorage.getItem('savedGames') !== null) && (localStorage.getItem('savedGamesSize') !== null)) {
        let localArr = localStorage.getItem('savedGames').split(',')
        areaSize = +localStorage.getItem('savedGamesSize')
        clicksCount = +localStorage.getItem('savedGamesSteps')
        cellsArr = []
        for (let i = 0; i < areaSize; i++) {
            cellsArr.push([])
        }
        for (let i = 0; i < areaSize; i++) {
            for (let j = 0; j < areaSize; j++) {
                cellsArr[i][j] = +localArr[i * areaSize + j ]
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
    canvasArea.onclick = (e) => {

    if (playSound) {
        var audio = new Audio()
        audio.src = 'sound/a.mp3'
        audio.autoplay = true
    }

    let x = (e.pageX - canvasArea.offsetLeft) / (canvasArea.width / areaSize) | 0
    let y = (e.pageY - canvasArea.offsetTop)  / (canvasArea.width / areaSize) | 0
    itemsMove(x, y)
    drawCells(ctx, canvasArea.width / areaSize, cellImage)
    victoryCheck()
    localStorage.setItem('savedGames', cellsArr)
    localStorage.setItem('savedGamesSize', areaSize)
    localStorage.setItem('savedGamesSteps', clicksCount)
    }

    /**
     * Process touches
    */
    canvasArea.ontouchend = function(e) {
    var x = (e.touches[0].pageX - canvasArea.offsetLeft) / (canvasArea.width / areaSize) | 0
    var y = (e.touches[0].pageY - canvasArea.offsetTop)  /(canvasArea.width / areaSize) | 0
    itemsMove(x, y)
    drawCells(ctx, canvasArea.width / areaSize, cellImage)
    victoryCheck()
    localStorage.setItem('savedGames', cellsArr)
    localStorage.setItem('savedGamesSize', areaSize)
    localStorage.setItem('savedGamesSteps', clicksCount)
    }
    
}

/**
 * Create area
*/
function createGameArea() {
    canvasArea = document.createElement("canvas") 
    if (document.documentElement.clientWidth > 800) {
        canvasArea.width = 500
        canvasArea.height = 500
    } else if (document.documentElement.clientWidth > 300) {
        canvasArea.width = 300 
        canvasArea.height = 300
    } else if (document.documentElement.clientWidth > 200) {
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
function itemsMove(x, y) {
    let nullX = getEmptyCell().x 
    let nullY = getEmptyCell().y
    if (((x - 1 === nullX || x + 1 === nullX) && y === nullY) || ((y - 1 === nullY || y + 1 === nullY) && x === nullX)) { 
        cellsArr[nullY][nullX] = cellsArr[y][x] 
        cellsArr[y][x] = 0 
        clicksCount++
    }
}

/**
 * Check victory
*/
function victoryCheck() {
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
    if (isVictory === true) {
        let winClicksCount = clicksCount
        let winTotalTimeSec = totalTimeSec
        let winTotalTimeMin = totalTimeMin
        let winTotalTimeHours = totalTimeHours

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
            if (localStorage.getItem(areaSize.toString()) === null) {
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
            alert(`Ура! Вы решили головоломку за ${winTotalTimeHours}:${winTotalTimeMin}:${winTotalTimeSec} и ${winClicksCount} ходов`)
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
            itemsMove(x, y)
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

    if (typeOfPuzzle === 0) { 
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
    } else if (typeOfPuzzle === 1) {
        for (let i = 0; i < areaSize; i++) {
            for (let j = 0; j < areaSize; j++) {
                if (cellsArr[i][j] > 0) { 
                    context.drawImage(cellImage, ((cellsArr[i][j] - 1) % areaSize) * size + 1, Math.floor((cellsArr[i][j] - 1) / areaSize) * size + 1, size - 2, size - 2, j * size + 1, i * size + 1, size - 2, size - 2)
                }
            }
        }
    } else if (typeOfPuzzle === 2) {
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
