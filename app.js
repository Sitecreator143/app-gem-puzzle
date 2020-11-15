//Параметры от юзера
let areaSize = 4

//Параметры для юзера
let clickCount = 0

//Необходимые для функций переменные
let canvasArea
let arrNumber = []  //Двумерный массив, содержащий порядок фишек оп оси х, У

//Играть ли музыку? 
let willPlaySound = true

//Создание поля, фишек
const gameInit = () => {
    createGameArea() //Создали поле
    addUserArea() //Создаем поле для пользователя
    
    createNumbersArr() //Создали изначальный массив фишек (0, 1, 2...)
    itemsMix(5000) //Перемешали значения в массиве фишек
    savedGame() //Извлекает сохраненную игру
    itemsDraw(ctx, canvasArea.width / areaSize) //Рисуем итемы
    eventPush() //Запускаем функцию касаний
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//Функция создает пользовательскую зону для настроек
const addUserArea = () => {
    //Создание самой зоны
    let divUserArea = document.createElement('div')
    divUserArea.className = "user__wrap"
    document.body.insertBefore(divUserArea, document.body.childNodes[1])

    //Время и количество кликов
    const timeAndClick = () => {
        let divTimeAndClick = document.createElement('div')
        divTimeAndClick.className = "time-click-information"
        let x = new Date
        let startTime = Date.now()
        let stopTime = Date.now()
        function updateTime() {
            stopTime = Date.now()
            totalTime = stopTime - startTime
            totalTimeSec = Math.floor(totalTime / 1000) % 60
            totalTimeMin = Math.floor(totalTime / 60000) % 60
            totalTimeHours = Math.floor(totalTime / 3600000) % 60
            divTimeAndClick.innerText = `Количество ходов ${clickCount}, время ${totalTimeHours}:${totalTimeMin}:${totalTimeSec}`
            divUserArea.insertBefore(divTimeAndClick, divUserArea.childNodes[0])
        }
        updateTime() //Вызовем перед интервалом что бы не дергалось при пересоздании
        setInterval(updateTime, 100)
    }
    timeAndClick()

    //Выбор размера поля
    const chooseSize = () => {
        let divChooseSize = document.createElement('div')
        divChooseSize.className = "choose__size-wrap"
        divUserArea.insertBefore(divChooseSize, divUserArea.childNodes[2])

        let divChooseSizeText = document.createElement('div')
        divChooseSizeText.innerText = "Новая игра:"
        divChooseSizeText.className = "time-click-information"
        divUserArea.insertBefore(divChooseSizeText, divUserArea.childNodes[1])

        let sizeArr = []
        let colorArr = ['#00ff09', '#00ff1a', '#fff', '#1eff00', '#48ff00', '#8cff00', '#d9ff00', '#f7ff00', '#ffea00', '#ffc400', '#ffa600', '#ff9100', '#ff5500', '#ff2600', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000', '#ff0000']
        for (let i = 2; i <= 21; i++) {
            sizeArr[i] = document.createElement('div')
            sizeArr[i].className = "choose__size"
            sizeArr[i].style.backgroundColor = `${colorArr[i - 2]}`
            sizeArr[i].innerText = i
            divChooseSize.insertBefore(sizeArr[i], divChooseSize.childNodes[i])
            sizeArr[i].addEventListener('click', () => {
                areaSize = sizeArr[i].innerText
                areaSize = +areaSize
                document.body.innerHTML = ''
                clickCount = 0
                arrNumber = []
                localStorage.removeItem('savedGames')
                localStorage.removeItem('savedGamesSize')
                localStorage.removeItem('savedGamesSteps')
                gameInit()
            })
        }
    }
    chooseSize()

    const audioOn = () => {
        let divAudioOn = document.createElement('div')
        divAudioOn.className = "div__audio"
        divAudioOn.innerText = 'audio'
        divAudioOn.style.backgroundColor = 'yellow'
        divUserArea.insertBefore(divAudioOn, divUserArea.childNodes[3])
        divAudioOn.addEventListener('click', () => {
            if (willPlaySound) {
                divAudioOn.style.backgroundColor = 'white'
                willPlaySound = false
            } else {
                divAudioOn.style.backgroundColor = 'yellow'
                willPlaySound = true
            }
        })

    }
    audioOn()

    const bestResult = () => {
        let divBestResult = document.createElement('div')
        divBestResult.className = "div__best"
        if (localStorage.getItem(areaSize.toString()) === null) {
            divBestResult.innerText = `На поле ${areaSize} x ${areaSize} не закончено ни одной партии`
        } else {
            let bestResultsArr = localStorage.getItem(areaSize.toString()).split(',')
            for (let i = 0; i <= 10; i++) {
                isNaN(+bestResultsArr[i]) ? bestResultsArr[i] = 'место не занято' : bestResultsArr[i] = bestResultsArr[i]
            }
            divBestResult.innerText = `На поле ${areaSize} x ${areaSize} у Вас рекорды: \n1 место, ходов: ${bestResultsArr[0]} \n2 место, ходов: ${bestResultsArr[1]} \n 3 место, ходов: ${bestResultsArr[2]} \n 4 место, ходов: ${bestResultsArr[3]} \n 5 место, ходов: ${bestResultsArr[4]} \n 6 место, ходов: ${bestResultsArr[5]} \n 7 место, ходов: ${bestResultsArr[6]} \n 8 место, ходов: ${bestResultsArr[7]} \n 9 место, ходов: ${bestResultsArr[8]} \n 10 место, ходов: ${bestResultsArr[9]} \n`
        }
        divUserArea.insertBefore(divBestResult, divUserArea.childNodes[4])
    }
    bestResult()

}

//Начать игру с того места, где сделали последний ход
const savedGame = () => {
    if ((localStorage.getItem('savedGames') !== null) && (localStorage.getItem('savedGamesSize') !== null)) {
        let localArr = localStorage.getItem('savedGames').split(',')
        areaSize = +localStorage.getItem('savedGamesSize')
        clickCount = +localStorage.getItem('savedGamesSteps')
        arrNumber = []
        
        for (let i = 0; i < areaSize; i++) {
            arrNumber.push([])
        }
        for (let i = 0; i < areaSize; i++) {
            for (let j = 0; j < areaSize; j++) {
                arrNumber[i][j] = +localArr[i * areaSize + j ]
            }
        }
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////
const eventPush = () => {
    canvasArea.onclick = (e) => { // обрабатываем клики мышью

    if (willPlaySound) {
        var audio = new Audio(); // Создаём новый элемент Audio
        audio.src = 'sound/a.mp3'; // Указываем путь к звуку "клика"
        audio.autoplay = true; // Автоматически запускаем
    }

    let x = (e.pageX - canvasArea.offsetLeft) / (canvasArea.width / areaSize) | 0
    let y = (e.pageY - canvasArea.offsetTop)  / (canvasArea.width / areaSize) | 0
    itemsMove(x, y)
    itemsDraw(ctx, canvasArea.width / areaSize)
    victoryCheck()
    localStorage.setItem('savedGames', arrNumber)
    localStorage.setItem('savedGamesSize', areaSize)
    localStorage.setItem('savedGamesSteps', clickCount)
    }
    canvasArea.ontouchend = function(e) { // обрабатываем касания пальцем
    var x = (e.touches[0].pageX - canvasArea.offsetLeft) / (canvasArea.width / areaSize) | 0
    var y = (e.touches[0].pageY - canvasArea.offsetTop)  /(canvasArea.width / areaSize) | 0
    itemsMove(x, y)
    itemsDraw(ctx, canvasArea.width / areaSize)
    victoryCheck()
    localStorage.setItem('savedGames', arrNumber)
    localStorage.setItem('savedGamesSize', areaSize)
    localStorage.setItem('savedGamesSteps', clickCount)
    }
    
}

//Создание поля
const createGameArea = () => {
    canvasArea = document.createElement("canvas") //Создали канвас 
    if (document.documentElement.clientWidth > 800) { //Выбираем размеры канваса
        canvasArea.width = 500 //Дали ему размеры
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
    ctx = canvasArea.getContext("2d") //Берем контекст холста для рисования
    ctx.fillStyle = "#5F9EA0" //Задаем цвет фигур
    ctx.fillRect(0, 0, canvasArea.width, canvasArea.height) //Закрашиваем путем создания прямоугольника
    document.body.insertBefore(canvasArea, document.body.childNodes[0]) //Вставили канвас в боди
}

//Двумерный массив для чисел от 1 до количества ячеек
const createNumbersArr = () => {
    for (let i = 0; i < areaSize; i++) {
        arrNumber.push([])
        for (let j = 1; j <= areaSize; j++) {
            arrNumber[i].push(i * areaSize + j)
        }
    }
    arrNumber[arrNumber.length - 1][arrNumber.length - 1] = 0 //Делает последнее значение двумерного масива равным нулю
}

//Функция находит координату пустой клетки
const getEmptyCell = () => {
    for (let i = 0; i < areaSize; i++) {
        for (let j = 0; j < areaSize; j++) {
            if (arrNumber[i][j] === 0) {
                return {
                    "x" : j, 
                    "y" : i
                }
            }
        }
    }
}

//Находит произвольное логическое значение
const getRandomBool = () => {
    if (Math.floor(Math.random() * 2) === 0) {
        return true
    } else {
        return false
    }
}

//Перемещает итем в пустую клетку
const itemsMove = (x, y) => {
    let nullX = getEmptyCell().x //Получает х пустой клетки и записывает в переменную
    let nullY = getEmptyCell().y
    if (((x - 1 === nullX || x + 1 === nullX) && y === nullY) || ((y - 1 === nullY || y + 1 === nullY) && x === nullX)) { //Если пустая клетка рядом
        arrNumber[nullY][nullX] = arrNumber[y][x] //Записываем в массив фишку на место пустой клетки
        arrNumber[y][x] = 0 //Записываем в массив пустую клетку на место фишки
        clickCount++
    }
}

//Функция определяет, победа ли у нас
const victoryCheck = () => {
    //Создаем два массива с вариантами победы (14 15 и 15 14) (Теперь решили создавать один, т.к. алгоритм перемешивания хорош)
    let arrVictoryOne = []
    for (let i = 0; i < areaSize; i++) {
        arrVictoryOne.push([])
        for (let j = 1; j <= areaSize; j++) {
            arrVictoryOne[i].push(i * areaSize + j)
        }
    }
    arrVictoryOne[arrVictoryOne.length - 1][arrVictoryOne.length - 1] = 0
    //Если текущее состояние соответствует победным масссивам
    let isVictory = true
    for (let i = 0; i < areaSize; i++) {
        for (var j = 0; j < areaSize; j++) {
            if (arrVictoryOne[i][j] != arrNumber[i][j]) {
                isVictory = false
            }
        }
    }
    if (isVictory === true) {
            let winClickCount = clickCount
            let winTotalTimeSec = totalTimeSec
            let winTotalTimeMin = totalTimeMin
            let winTotalTimeHours = totalTimeHours
            let intervalID = setInterval(() => {
                itemsMix(10)
                itemsDraw(ctx, canvasArea.width / areaSize)
            }, 200)
            setTimeout(() => {
                clearInterval(intervalID)

                //Запись десяти лучших результатов
                let saveResultArr = []
                if (localStorage.getItem(areaSize.toString()) === null) {
                    saveResultArr.push(winClickCount.toString())
                    saveResultArr.join('')
                } else {
                    saveResultArr = localStorage.getItem(areaSize.toString()).split(',')
                    for (let i = 0; i <= saveResultArr.length; i) { 
                        if (winClickCount > +saveResultArr[i] || i === saveResultArr.length) {
                            if (i !== saveResultArr.length) {
                                i++
                            } else {
                                saveResultArr.push(winClickCount.toString())
                                i += 10
                                if (saveResultArr.length === 11) {
                                    saveResultArr.splice(10, 1)
                                }
                                saveResultArr.join('')
                            }
                        } else {
                            saveResultArr.splice(i, 0, winClickCount.toString())
                            i += 10
                            if (saveResultArr.length === 11) {
                                saveResultArr.splice(10, 1)
                            }
                            saveResultArr.join('')
                        }
                    }
                }
                localStorage.setItem(areaSize, saveResultArr)

                document.body.innerHTML = ''
                clickCount = 0
                arrNumber = []
                localStorage.removeItem('savedGames')
                localStorage.removeItem('savedGamesSize')
                localStorage.removeItem('savedGamesSteps')
                gameInit()
                alert(`Ура! Вы решили головоломку за ${winTotalTimeHours}:${winTotalTimeMin}:${winTotalTimeSec} и ${winClickCount} ходов`)
            }, 2000)
    }
}

//Перемешиваем итемы
const itemsMix = (mixStepsCount) => {
    let x
    let y
    //Выполняем перемешивание с заданным количеством шагов
    for (let i = 0; i < mixStepsCount; i++) {
        let nullX = getEmptyCell().x
        let nullY = getEmptyCell().y

        let upRightMove = getRandomBool()
        let upLeftMove = getRandomBool()
        //Которую из четырех фишек, премыкающих к пустой клетке нужно передвинуть
        if (!upRightMove && !upLeftMove) { y = nullY; x = nullX - 1;}
        if (upRightMove && !upLeftMove)  { x = nullX; y = nullY + 1;}
        if (!upRightMove && upLeftMove)  { y = nullY; x = nullX + 1;}
        if (upRightMove && upLeftMove)   { x = nullX; y = nullY - 1;}
        //Если эта фишка существует (мы не взяли ту, которая выходит за границы поля), то двигаем ее на место пустой клетки
        if (0 <= x && x <= areaSize - 1 && 0 <= y && y <= areaSize - 1) {
            itemsMove(x, y)
        }
    }
    clickCount = 0
}

//Рисуем итемы на канвасе/////////////////////////////////////////////////////////////////////////////
const itemsDraw = (context, size) => {
    //Заново заливаем канвас
    ctx.fillStyle = "#5F9EA0"
    ctx.fillRect(0, 0, canvasArea.width, canvasArea.height)

    for (let i = 0; i < areaSize; i++) {
        for (let j = 0; j < areaSize; j++) {
            if (arrNumber[i][j] > 0) {
                    //Стили итемов рисуем
                    context.fillStyle = "#000"
                    context.fillRect(j * size + 1, i * size + 1, size - 2, size - 2)
                    
                    //Текст на канвас раскидываем
                    context.font = "bold " + (size / 2) + "px Sans-serif"
                    context.textAlign = "center"
                    context.textBaseline = "middle"
                    context.fillStyle = "#5F9EA0"
                    context.fillText(arrNumber[i][j], j * size + size / 2, i * size + size / 2 + size / 32);
            }
        }
    }
}

/* const resize = () => {
    document.addEventListener("DOMContentLoaded", function(event)
    {
        window.onresize = function() {
            resize_info();
        };
    });
    
    function resize_info()
    {
        document.body.innerHTML = ''
            createGameArea() //Создали поле
    addUserArea() //Создаем поле для пользователя
    createNumbersArr() //Создали изначальный массив фишек (0, 1, 2...)
    itemsMix(5000) //Перемешали значения в массиве фишек
    savedGame() //Извлекает сохраненную игру
    itemsDraw(ctx, canvasArea.width / areaSize) //Рисуем итемы
    eventPush() //Запускаем функцию касаний
    }
}
resize() */
