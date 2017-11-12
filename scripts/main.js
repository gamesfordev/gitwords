
const HOST = location.origin.replace(/^http/, 'ws')
let socket = io.connect(HOST);
let gameTicker = null;
let currentWord = '';
let loadedWord = '';
let myScore = 0;
let myTime = 2;
let playerName = 'John';
let words = ["banana", "apple", "alternate", "boundary", "command", "gloves"];
let commandHistory = [];
let prevCommand = -1;
let userData = null;

$(document).ready(() => {
    $('#nickNameInput').focus();
});

window.onbeforeunload = () => {
    return false;
};

let Konsole = {
    log: (text) => {
        $('#consoleOut').append('<div>' + text + '</div>');
    },
    clear: () => {
        $('#consoleOut').html('');
    },
    tab: () => {
        let texts = $('#commandInput').val().split(' ');
        const character = texts[texts.length - 1][0];
        switch (character) {
            case 'g': texts[texts.length - 1] = 'git';
                break;
            case 'a': texts[texts.length - 1] = 'add';
                break;
            case 'c': texts[texts.length - 1] = 'commit';
                break;
            case 'cl' : texts[texts.length - 1] = 'clear';
        }
        $('#commandInput').val(texts.join(' '));
    }
};

$('#commandInput').keypress(function (e) {
    if (e.which == 13) {
        processCommand($(this).val());
        $(this).val('');
    }
});

$('#commandInput').keydown(function (e) {
    if (e.which == 9 || e.keyCode == 9) {
        e.preventDefault();
        Konsole.tab();
    } else if (commandHistory.length === 0) {
        return;
    }
    if (e.which == 27) {
        $(this).val('');
    }
    if (prevCommand === -1) {
        prevCommand = commandHistory.length - 1;
    }
    if (prevCommand === commandHistory.length) {
        prevCommand = 0;
    }
    if (e.which == 38) {
        $(this).val(commandHistory[prevCommand--]);
    }
    if (e.which == 40) {
        $(this).val(commandHistory[prevCommand++]);
    }
});

Array.prototype.shuffle = function () {
    var i = this.length, j, temp;
    if (i == 0) return this;
    while (--i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
}

let processCommand = (text) => {
    console.log(text);
    commandHistory.push(text);
    prevCommand = -1;
    console.log(commandHistory);
    let tokens = text.split(' ');
    if (tokens.length > 0) {
        if (tokens[0] == 'git') {
            if (tokens[1] == 'add') {
                createjs.Sound.play("add");
                currentWord += loadedWord.splited[tokens[2]];
                $('#ck_' + tokens[2]).css('opacity', 0.6);
                Konsole.log('$ GitWords : current word is ' + currentWord);
            }
            else if (tokens[1] == 'commit') {
                if (loadedWord.correct == currentWord) {
                    console.log('correct!!');
                    myScore += loadedWord.points;
                    $('#score').html(myScore);
                }
                else {
                    console.log('wrong!!');
                }
                currentWord = '';
                showWord();
            }
            else if (tokens[1] == 'reset') {
                currentWord = '';
                myScore -= 1;
                myScore = myScore < 0 ? 0 : myScore;
                $('#score').html(myScore);
                $('#pool .chunkcard').css('opacity', 1);
            }
        } else if (tokens[0] == 'clear' || tokens[0] == 'cls') {
            Konsole.clear();
        }
    }
};

let addToPool = (chunks) => {
    $('#pool').html('');
    for (let i = 0; i < chunks.length; i++) {
        let cardHtml = '<div class="title">' + i + '</div>' +
            '<div class="box">' + chunks[i] + '</div>';
        let card = $("<div>", { id: 'ck_' + i, "class": "chunkcard" });
        let leftPos = (i / chunks.length) * 100 + 5;
        let topPos = 10 + (Math.random() * 1000) % 70;

        $(card).html(cardHtml);
        $(card).css('top', topPos + '%');
        $(card).css('margin-top', '-40px');

        $(card).css('left', leftPos + '%');

        window.setTimeout(() => {
            $('#pool').append(card);
        }, 200 * (i + 1));
    }


};

let showWord = () => {
    let randomWord = words[parseInt(Math.random() * 1000) % words.length];
    let chunks = randomWord.match(/.{1,3}/g);
    chunks.shuffle();
    loadedWord = {
        correct: randomWord,
        splited: chunks,
        points: chunks.length,
    };

    console.log(loadedWord);
    //$('#pool').html(loadedWord.splited.toString());
    console.log(chunks);
    addToPool(chunks);
};

let startGame = () => {
    playerName = $('#nickNameInput').val();
    if (playerName.length >= 3 && playerName.length <= 10) {
        myScore = 0;
        myTime = 180;

        createjs.Sound.play("start");

        $('#startGame').hide();
        $('#gameScreen').show();
        $('#player').html(playerName);
        $('#time').html(myTime);
        $('#score').html(myScore);
        Konsole.clear();
        $('#pool').html('');
        socket.emit('playerConnect', playerName);

        window.setTimeout(() => {
            gameTicker = window.setInterval(() => {
                gameTick();
            }, 1000);

            showWord();
            $('#commandInput').focus();
        },5000);

        window.setTimeout(() => {
            $('#pool').html('<h1>Ready?</h1>');
        },1000);

        window.setTimeout(() => {
            $('#pool').html('<h1>Git ❤️️ and Words 💙</h1>');
        },2000);

        window.setTimeout(() => {
            $('#pool').html('<h1>Start</h1>');
        },3000);
    }
    else {
        alert('Please enter an username with 3-10 chars.');
        $('#nickNameInput').focus();
    }
};


let gameTick = () => {
    myTime--;
    if (myTime == 0) {
        gameOver();
        return;
    }
    $('#time').html(myTime);
};

let gameOver = () => {
    console.log('Game over');
    window.clearInterval(gameTicker);
    $('#gameScreen').hide();
    $('#endScreen').show();
    $('#finalscore').html(myScore);
    if (userData) {
        userData.score = myScore
        var r = userData
    } else {
        r = { playerName: playerName, score: myScore }
    }

    socket.emit('finish', r); //set whatever data you want to save to the db


};

let loadSound = () => {
    createjs.Sound.registerSound("/assets/sounds/start.ogg", "start");
    createjs.Sound.registerSound("/assets/sounds/add.ogg", "add");
}



socket.on('connect', function (data) {

});

socket.on('scoreUpdate', function (res) {
    console.log("score updated")
    console.log(res) //update leaderboard using this data
    let result = ''

    let sorted = res.data.sort((a, b) => {
        return parseInt(b.score) - parseInt(a.score)
    }).slice(0, 10)

    sorted.forEach((v) => {
        result += '<tr><td class="name">' + v.playerName + '</td> <td class="colon">:</td><td class="score">' + v.score + '</td></tr>'
    })

    $('#leaderboard').html(result)

});

socket.on('player', (res) => {

    userData = res.userData

});