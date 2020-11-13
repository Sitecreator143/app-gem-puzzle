//Параметры от юзера
let areaSize = 2

//Параметры для юзера
let clickCount = 0

//Необходимые для функций переменные
let canvasArea
let arrNumber = []  //Двумерный массив, содержащий порядок фишек оп оси х, У

//Создание поля, фишек
const gameInit = () => {
    createGameArea() //Создали поле
    createNumbersArr() //Создали изначальный массив фишек (0, 1, 2...)
    itemsMix(1000) //Перемешали значения в массиве фишек
    itemsDraw(ctx, canvasArea.width / areaSize) //Рисуем итемы
    eventPush() //Запускаем функцию касаний
}

const eventPush = () => {
    canvasArea.onclick = (e) => { // обрабатываем клики мышью
    let x = (e.pageX - canvasArea.offsetLeft) / (canvasArea.width / areaSize) | 0
    let y = (e.pageY - canvasArea.offsetTop)  / (canvasArea.width / areaSize) | 0
    itemsMove(x, y)
    ctx.fillStyle = "#5F9EA0"
    ctx.fillRect(0, 0, canvasArea.width, canvasArea.height)
    itemsDraw(ctx, canvasArea.width / areaSize)
    victoryCheck()
    }
    canvasArea.ontouchend = function(e) { // обрабатываем касания пальцем
    var x = (e.touches[0].pageX - canvasArea.offsetLeft) / (canvasArea.width / areaSize) | 0
    var y = (e.touches[0].pageY - canvasArea.offsetTop)  /(canvasArea.width / areaSize) | 0
    itemsMove(x, y)
    ctx.fillStyle = "#5F9EA0"
    ctx.fillRect(0, 0, canvasArea.width, canvasArea.height)
    itemsDraw(ctx, canvasArea.width / areaSize)
    victoryCheck()
    }
    
}

//Создание поля
const createGameArea = () => {
    canvasArea = document.createElement("canvas") //Создали канвас 
    canvasArea.width = 350 //Дали ему размеры
    canvasArea.height = 350
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
        alert(`Поздравляю! Вы собрали головоломку за ${clickCount} касаний.`)
        itemsDraw(ctx, canvasArea.width / areaSize)
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
    const itemsViewFunction = (x, y) => {
        context.fillStyle = "#000"
        context.fillRect(x + 1, y + 1, size - 2, size - 2)
    }
    const numberViewFunction = () => {
        context.font = "bold " + (size/3) + "px Sans-serif"
        context.textAlign = "center"
        context.textBaseline = "middle"
        context.fillStyle = "#5F9EA0"
    }
    for (let i = 0; i < areaSize; i++) {
        for (let j = 0; j < areaSize; j++) {
            if (arrNumber[i][j] > 0) {
                    itemsViewFunction(j * size, i * size)
                    numberViewFunction()
                    context.fillText(arrNumber[i][j], j * size + size / 2, i * size + size / 2);
            }
        }
    }
}

