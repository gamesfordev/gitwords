const HOST = location.origin.replace(/^http/, 'ws')
let socket = io.connect(HOST);
let gameTicker = null;
let currentWord = '';
let loadedWord = '';
let myScore = 0;
let myTime = 60;
let playeName = 'John';
let words = [
    {
        "splited" : ["mple", "exa"],
        "correct" : "example",
        "points" : 2,
    },
    {
        "splited" : ["ca", "tion", "edu"],
        "correct" : "education",
        "points" : 3,
    },
    {
        "splited" : ["na", "ban", "a"],
        "correct" : "banana",
        "points" : 1,
    },
    {
        "splited" : ["le", "ap", "p"],
        "correct" : "apple",
        "points" : 1,
    },
];

console.log(words);

$('#commandInput').keypress(function(e) {
    if(e.which == 13) {
        processCommand($(this).val());
        $(this).val('');
    }
});


let processCommand = (text) => {
    console.log(text);
    let tokens = text.split(' ');
    if(tokens.length > 0){
        if(tokens[0] == 'git') {
            if(tokens[1] == 'add') {
                currentWord += loadedWord.splited[tokens[2]];
            }
            else if(tokens[1] == 'commit') {
                if(loadedWord.correct == currentWord) {
                    console.log('correct!!');
                    myScore += loadedWord.points;
                    $('#score').html(myScore);
                }
                else{
                    console.log('wrong!!');
                }
                currentWord = '';
                showWord();
            }
        }
    }
};

let showWord = () => {
    let randomWord = words[parseInt(Math.random() * 1000) % words.length];
    loadedWord = randomWord;
    console.log(randomWord);
    $('#pool').html(randomWord.splited.toString());
};

let startGame = () => {
    playerName = $('#nickNameInput').val();
    myScore = 0;
    myTime = 60;
    $('#startGame').hide();
    $('#gameScreen').show();
    $('#player').html(playerName);
    $('#time').html(myTime);
    $('#score').html(myScore);
    socket.emit('playerConnect', playerName);

    gameTicker = window.setInterval(() => {
        gameTick();
    }, 1000);

    showWord();
};

let gameTick = () => {
    if(myTime == 0) {
        gameOver();
        return;
    }
    myTime--;
    console.log('Time ' + myTime);
    $('#time').html(myTime);
};

let gameOver = () => {
    console.log('Game over');
    window.clearInterval(gameTicker);
};

socket.on('connect', function(data) {
        
});