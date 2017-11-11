const HOST = location.origin.replace(/^http/, 'ws')
let socket = io.connect(HOST);
let gameTicker = null;
let currentWord = '';
let loadedWord = '';
let myScore = 0;
let myTime = 180;
let playeName = 'John';
let words = ["banana", "apple", "alternate", "boundary", "command", "gloves"];

console.log(words);

$('#commandInput').keypress(function(e) {
    if(e.which == 13) {
        processCommand($(this).val());
        $(this).val('');
    }
});

Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}

let processCommand = (text) => {
    console.log(text);
    let tokens = text.split(' ');
    if(tokens.length > 0){
        if(tokens[0] == 'git') {
            if(tokens[1] == 'add') {
                createjs.Sound.play("add");
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
    let chunks = randomWord.match(/.{1,2}/g).shuffle();
    loadedWord = {
        correct : randomWord,
        splited : chunks,
        points : chunks.length,
    };

    console.log(loadedWord);
    $('#pool').html(loadedWord.splited.toString());
};

let startGame = () => {
    playerName = $('#nickNameInput').val();
    myScore = 0;
    myTime = 180;

    createjs.Sound.play("start");

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

let loadSound = () => {
    createjs.Sound.registerSound("/assets/sounds/start.ogg", "start");
    createjs.Sound.registerSound("/assets/sounds/add.ogg", "add");
}


socket.on('connect', function(data) {
        
});