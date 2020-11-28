/** 
 * User area
*/
/** 
 * Add time and turns count
*/
function showTimeAndClicksCount() {
    const elTimeAndClick = document.createElement('div')
    elTimeAndClick.classList.add("user__information")
    let millisecondsFromStart = -1000
    /**
     * Time output
    */
    function updateTime() {
        millisecondsFromStart += 1000
        const currentTime = new Date(millisecondsFromStart)
        stringTime = currentTime.toLocaleString("ru", { minute: 'numeric', second: 'numeric' })
        elTimeAndClick.innerText = `Количество ходов: ${clicksCount}, время: ${stringTime}`
    }
    elementUserArea.insertBefore(elTimeAndClick, elementUserArea.childNodes[0])
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
    const elementChooseSize = document.createElement('div')
    elementChooseSize.classList.add("user__choose-size-wrap")
    elementUserArea.insertBefore(elementChooseSize, elementUserArea.childNodes[2])

    const elementChooseSizeText = document.createElement('div')
    elementChooseSizeText.innerText = "Новая игра:"
    elementChooseSizeText.classList.add("user__information")
    elementUserArea.insertBefore(elementChooseSizeText, elementUserArea.childNodes[1])

    let sizeArr = []
    const colorArr = ['#00ff09', '#00ff1a', '#fff', '#1eff00', '#48ff00', '#8cff00', '#d9ff00', '#f7ff00', '#ffea00', '#ffc400', '#ffa600', '#ff9100', '#ff5500', '#ff2600', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000']
    for (let gameSize = 2; gameSize <= 30; gameSize++) {
        sizeArr[gameSize] = document.createElement('div')
        sizeArr[gameSize].classList.add("user__choose-size")
        sizeArr[gameSize].style.backgroundColor = `${colorArr[gameSize - 2]}`
        sizeArr[gameSize].innerText = gameSize
        elementChooseSize.insertBefore(sizeArr[gameSize], elementChooseSize.childNodes[gameSize])
        sizeArr[gameSize].addEventListener('click', () => {
            areaSize = sizeArr[gameSize].innerText
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
function changeStyleOfPuzzle() {
    const styleOfPuzzleArr = ['Numbers', 'Picture', 'Both']
    const elementTypeChange = document.createElement('div')
    elementTypeChange.classList.add("user__audio")
    elementTypeChange.innerText = `Тип: ${styleOfPuzzleArr[styleOfPuzzle]}`
    elementUserArea.insertBefore(elementTypeChange, elementUserArea.childNodes[3])
    elementTypeChange.addEventListener('click', () => {
        styleOfPuzzle++
        styleOfPuzzle %= 3
        elementTypeChange.innerText = `Тип: ${styleOfPuzzleArr[styleOfPuzzle]}`
        drawCells(ctx, canvasArea.width / areaSize, cellImage)
    })
}

/**
 * Sound on/off
*/
function turnAudio() {
    const elementAudioOn = document.createElement('div')
    elementAudioOn.classList.add("user__audio")
    elementAudioOn.innerText = 'audio'
    elementAudioOn.style.backgroundColor = 'yellow'
    elementUserArea.insertBefore(elementAudioOn, elementUserArea.childNodes[4])
    elementAudioOn.addEventListener('click', () => {
        if (playSound) {
            elementAudioOn.style.backgroundColor = 'white'
            playSound = false
        } else {
            elementAudioOn.style.backgroundColor = 'yellow'
            playSound = true
        }
    })

}

/**
 * Output best results
*/
function showBestResult() {
    const elementBestResult = document.createElement('div')
    elementBestResult.classList.add("user__best")
    if (localStorage.getItem(areaSize.toString()) === null) {
        elementBestResult.innerText = `На поле ${areaSize} x ${areaSize} не закончено ни одной партии`
    } else {
        let bestResultsArr = localStorage.getItem(areaSize.toString()).split(',')
        for (let i = 0; i <= 10; i++) {
            isNaN(+bestResultsArr[i]) ? bestResultsArr[i] = 'место не занято' : bestResultsArr[i] = bestResultsArr[i]
        }
        elementBestResult.innerText = `На поле ${areaSize} x ${areaSize} у Вас рекорды: \n1 место, ходов: ${bestResultsArr[0]} \n2 место, ходов: ${bestResultsArr[1]} \n 3 место, ходов: ${bestResultsArr[2]} \n 4 место, ходов: ${bestResultsArr[3]} \n 5 место, ходов: ${bestResultsArr[4]} \n 6 место, ходов: ${bestResultsArr[5]} \n 7 место, ходов: ${bestResultsArr[6]} \n 8 место, ходов: ${bestResultsArr[7]} \n 9 место, ходов: ${bestResultsArr[8]} \n 10 место, ходов: ${bestResultsArr[9]} \n`
    }
    elementUserArea.insertBefore(elementBestResult, elementUserArea.childNodes[5])
}