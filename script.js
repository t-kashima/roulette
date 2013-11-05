var elementWrapRouletteNumber = document.querySelector('.wrap_roulette_number');
var elementRouletteNumber = document.querySelector('.roulette_number');
var elementNumbers = document.querySelector('.numbers');
var elementStartButton = document.querySelector('.start_button');
var elementStopButton = document.querySelector('.stop_button');
var timerId = null;

// エンターキーの文字コード
const ENTER_KEY_CODE = 32;
// ルーレットの候補を取得する
var rouletteNumbers = ROULETTE_NUMBERS;

// 一番初めの番号を表示する
elementRouletteNumber.textContent = rouletteNumbers[0];

// ルーレットでまわす数字がなくなった時のメッセージ
const ERROR_CAN_NOT_ROULETTE = 'ルーレットでまわす数字がなくなりました';

// ルーレットの文字を表示する
var showRouletteNumbers = function(element, numbers) {
    var i = Math.floor(Math.random() * numbers.length);
    element.textContent = numbers[i];
};

// ルーレットを動かす
var startRouletteNumbers = function() {
    timerId = setInterval(function() {
        showRouletteNumbers(elementRouletteNumber, rouletteNumbers);
    }, 10);    
};

// ルーレットをまわすことができるか
var canRouletteNumbers = function(numbers) {
    if (numbers.length > 0) {
        return true;
    }
    return false;
};

// ルーレットのボタンを切り替える
var changeRouletteButton = function(isStart) {
    if (isStart === true) {
        changeElementClass(elementStartButton, 'display_none', true);
        changeElementClass(elementStopButton, 'display_none', false);
    } else {
        changeElementClass(elementStartButton, 'display_none', false);
        changeElementClass(elementStopButton, 'display_none', true);
    }
}

// 指定したクラスをつけたり外したりする
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

// ルーレットをとめる
var stopRouletteNumbers = function() {
    clearInterval(timerId);
}

// 文字のリストから指定文字を削除
var removeNumber = function(numbers, removeNumber) {
    for (var i = 0; i < numbers.length; i++) {
        if (numbers[i] === removeNumber) {
            numbers.splice(i, 1);
            break;
        }
    }
}

var startRoulette = function() {
    if (canRouletteNumbers(rouletteNumbers) === true) {
        // ルーレットを動かす
        startRouletteNumbers();
        // ボタンの切り替え
        changeRouletteButton(true);
    } else {
        alert(ERROR_CAN_NOT_ROULETTE);
    }
}

// 新規のNodeを作成する
var createNode = function(elementName, className) {
    var e = document.createElement(elementName);
    if (className != null) {
        e.classList.add(className);
    }
    return e;
};

var stopRoulette = function() {
    // ルーレットをとめる
    stopRouletteNumbers();
    // 止まった中央の文字を取得する
    var number = elementRouletteNumber.textContent;    
    
    // 中央の文字と同じ文字をリストに追加する
    var li = createNode('li', 'number');
    li.textContent = number;
    elementNumbers.appendChild(li);

    // 動かす文字のために中央の文字を複製
    var rect = elementRouletteNumber.getBoundingClientRect();
    var div = createNode('div', 'move_number');
    div.textContent = number;
    div.style.position = 'absolute';
    div.style.top =  rect.top + 'px';
    div.style.left = rect.left + 'px';
    div.style.fontSize = '320px';
    elementWrapRouletteNumber.appendChild(div);

    // 中央の文字をリストの位置ヘ動かす
    rect = li.getBoundingClientRect();
    animateNumber(div, rect.top - 20, rect.left + 15);

    // ルーレットの候補から今回出た文字を削除
    removeNumber(rouletteNumbers, number);
    
    // ボタンの表示を切り替え
    changeRouletteButton(false);    
}

// 文字を移動させるためのアニメーション
var animateNumber = function(element, toTop, toLeft) {
    // 文字の現在の位置を取得する
    var top = parseInt(element.style.top, 10);
    var left = parseInt(element.style.left, 10);

    // 1fps当たりの移動量を決定する
    var incTop = (toTop - top) / 18;
    var incLeft = (toLeft - left) / 28;
    var incFontSize = -10;

    var i = 0;

    // 文字を移動させる
    var animateId = setInterval(function() {
        var top = parseInt(element.style.top, 10);
        var left = parseInt(element.style.left, 10);
        var fontSize = parseInt(element.style.fontSize, 10);
        top += incTop;
        left += incLeft;
        fontSize += incFontSize;

        element.style.top = top + 'px';
        element.style.left = left + 'px';
        element.style.fontSize = fontSize + 'px';

        i++;

        if (i >= 30) {
            element.remove();
            clearInterval(animateId);
            return;
        }
    }, 10);
}

// キーボードを押した時
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

// スタートボタンが押された時
elementStartButton.addEventListener('click', function() {
    startRoulette();
}, false);

// キャンセルボタンが押された時
elementStopButton.addEventListener('click', function() {
    stopRoulette();
}, false);

