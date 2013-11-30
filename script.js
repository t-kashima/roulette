var elementNumbers = document.querySelector('.numbers');
var elementStartButton = document.querySelector('.start_button');
var elementStopButton = document.querySelector('.stop_button');
var timerId = null;

// ルーレットの時のSE
const SE_DRUMROLL = 'se/drumroll.mp3';

// 数字が決定した時のSE
const SE_DECISION_DRUMROLL = 'se/decision_drumroll.mp3';

// エンターキーの文字コード
const ENTER_KEY_CODE = 32;

// いくつ数字を表示するか
const ROULETTE_COUNT = 20;

// ルーレットの候補を取得する
var originalNumbers = ROULETTE_NUMBERS;

// SEの読み込み
var seDrum = new Audio();
seDrum.src = SE_DRUMROLL;
var seDecision = new Audio();
seDecision.src = SE_DECISION_DRUMROLL;

// 一番初めの番号を表示する
const INIT_NUMBER = '???';

// ルーレットでまわす数字がなくなった時のメッセージ
const ERROR_CAN_NOT_ROULETTE = 'ルーレットでまわす数字がなくなりました';

Array.prototype.shuffle = function() {
    var a = this.slice();
    for (var i = a.length - 1; i >= 0; i--) {
        var r = Math.floor(i * Math.random());
        var tmp = a[i];
        a[i] = a[r];
        a[r] = tmp;
    };
    return a;
};

// ルーレット後の数字
var rouletteNumbers = originalNumbers;
rouletteNumbers = rouletteNumbers.shuffle();

// 新規のNodeを作成する
var createNode = function(elementName, className) {
    var e = document.createElement(elementName);
    if (className != null) {
        e.classList.add(className);
    }
    return e;
};

//  初期の数字を設定する
var elementNumberLists = new Array();
for (var i = 0; i < ROULETTE_COUNT; i++) {
    var li = createNode('li', 'number');
    li.textContent = INIT_NUMBER;
    elementNumbers.appendChild(li);
    elementNumberLists.push(li);
}


// ルーレットの文字を表示する
var showRouletteNumbers = function(element, numbers) {
    var i = Math.floor(Math.random() * numbers.length);
    element.textContent = numbers[i];
};

// ルーレットを動かす
var startRouletteNumbers = function() {
    // 既に数字が決定している時はまたリセットする
    for (var i = 0; i < elementNumberLists.length; i++) {
        var li = elementNumberLists[i];
        changeElementClass(li, 'dicision', false);
    }

    // ドラムロールを鳴らす
    seDrum.play();
    timerId = setInterval(function() {
        for (var i = 0; i < elementNumberLists.length; i++) {
            var element = elementNumberLists[i];
            showRouletteNumbers(element, rouletteNumbers);
        }
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
    // ドラムロールをとめる
    seDrum.pause();
    seDrum.currentTime = 0;

    // 数字の決定音を鳴らす
    seDecision.currentTime = 0;
    seDecision.play();

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

var stopRoulette = function() {
    // ルーレットをとめる
    stopRouletteNumbers();

    // ルーレットで決まる指定数分だけ取得する
    var dicisionNumbers = rouletteNumbers.splice(0, ROULETTE_COUNT);

    // ルーレットの数字をソートする
    dicisionNumbers.sort();    

    console.log('---- result ----');
    console.log(dicisionNumbers);

    for (var i = 0; i < ROULETTE_COUNT; i++) {
        var li = elementNumberLists[i];
        // 表示する数字がなければ空白を入れる
        if (typeof(dicisionNumbers[0]) === 'undefined') {
            li.textContent = '';
        } else {
            var dicisionNumber = dicisionNumbers.shift();
            li.textContent = dicisionNumber;
            // removeNumber(rouletteNumbers, rouletteNumbers[0]);        
            changeElementClass(li, 'dicision', true);
        }
    }
    changeRouletteButton(false);    
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

