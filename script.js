var elementWrapRouletteNumber = document.querySelector('.wrap_roulette_number');
var elementRouletteNumber = document.querySelector('.roulette_number');
var elementNumbers = document.querySelector('.numbers');
var elementStartButton = document.querySelector('.start_button');
var elementStopButton = document.querySelector('.stop_button');
var timerId = null;

const ENTER_KEY_CODE = 32;
var rouletteNumbers = ROULETTE_NUMBERS;

// 一番初めの番号を表示する
elementRouletteNumber.textContent = rouletteNumbers[0];

var createListNode = function(className) {
    var li = document.createElement('li');
    if (className != null) {
        li.classList.add(className);
    }
    return li;
};

var showRouletteNumbers = function(element, numbers) {
    var i = Math.floor(Math.random() * numbers.length);
    element.textContent = numbers[i];
};

var startRouletteNumbers = function() {
    timerId = setInterval(function() {
        showRouletteNumbers(elementRouletteNumber, rouletteNumbers);
    }, 10);    
};

var changeRouletteButton = function(isStart) {
    if (isStart === true) {
        changeElementClass(elementStartButton, 'display_none', true);
        changeElementClass(elementStopButton, 'display_none', false);
    } else {
        changeElementClass(elementStartButton, 'display_none', false);
        changeElementClass(elementStopButton, 'display_none', true);
    }
}

var changeElementClass = function(element, className, isAdd) {
    if (isAdd === true) {
        if (element.classList.contains(className) === false) {    
            element.classList.add(className);
        }        
    } else {
        if (element.classList.contains(className) === true) {    
            element.classList.remove(className);
        }        
    }
}

var stopRouletteNumbers = function() {
    clearInterval(timerId);
}

var removeNumber = function(numbers, removeNumber) {
    for (var i = 0; i < numbers.length; i++) {
        if (numbers[i] === removeNumber) {
            numbers.splice(i, 1);
            break;
        }
    }
}

var startRoulette = function() {
    startRouletteNumbers();
    changeRouletteButton(true);
}

var stopRoulette = function() {
    stopRouletteNumbers();
    var stopRouletteNumber = elementRouletteNumber.textContent;    
    var li = createListNode('number');
    // li.classList.add('display_none');
    li.textContent = stopRouletteNumber;
    elementNumbers.appendChild(li);
    
    removeNumber(rouletteNumbers, stopRouletteNumber);
    
    changeRouletteButton(false);    
}

document.addEventListener('keydown', function(event) {
    // Enterキー以外は何もしない
    if (event.keyCode !== ENTER_KEY_CODE) {
        return;
    }
    
    // 止まっている状態
    if (elementStartButton.classList.contains('display_none') === false)  {
        startRoulette();        
    // ルーレット中
    } else {
        stopRoulette();
    }
}, false);

elementStartButton.addEventListener('click', function() {
    startRoulette();
}, false);

elementStopButton.addEventListener('click', function() {
    stopRoulette();
}, false);

