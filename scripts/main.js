const HOST = location.origin.replace(/^http/, 'ws')
let socket = io.connect(HOST);
let gameTicker = null;
let currentWord = '';
let loadedWord = '';
let myScore = 0;
let myTime = 120;
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
};

let startGame = () => {
    $('#startGame').hide();
    $('#gameScreen').show();
    let playerName = $('#nickNameInput').val();
    socket.emit('playerConnect', playerName);
    wordsTimer = window.setInterval(() => {
        myTime--;
        console.log('Time ' + myTime);
    }, 1000);
    showWord();
};

let gameOver = () => {
    console.log('Game over');
    window.clearInterval(gameTicker);
};

socket.on('connect', function(data) {
        
});