const HOST = location.origin.replace(/^http/, 'ws')
let socket = io.connect(HOST);
let gameTicker = null;
let currentWord = '';
let loadedWord = '';
let myScore = 0;
let myTime = 180;
let playerName = 'John';
let words = ["banana", "apple", "alternate", "boundary", "command", "gloves"];
let commandHistory = []
let prevCommand = -1;
let userid=null;

console.log(words);

$('#commandInput').keypress(function (e) {
    if (e.which == 13) {
        processCommand($(this).val());
        $(this).val('');
    }
});

$('#commandInput').keydown(function (e) {
    if (commandHistory.length === 0) {
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
    console.log(prevCommand);
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
        }
    }
};

let addToPool = (chunks) => {
    $('#pool').html('');
    for (let i=0; i<chunks.length; i++){
        let cardHtml = '<div class="title">' + i + '</div>' + 
        '<div class="box">' + chunks[i] + '</div>';
        let card = $("<div>", {id: 'ck_' + i, "class": "chunkcard"});
        let leftPos = ((i+1)/chunks.length) * 100;
        let topPos = (Math.random() * 1000) % 100;

        $(card).html(cardHtml);
        $(card).css('top',topPos + '%');
        $(card).css('margin-top', '-40px');
        
        $(card).css('left', leftPos + '%');
        
        window.setTimeout(() => {
            $('#pool').append(card);
        }, 200 * (i+1));
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
    if (myTime == 0) {
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
    $('#gameScreen').hide();
    $('#endScreen').show();
    $('#finalscore').html(myScore);
    socket.emit('finish', {playerName:playerName,score:myScore}); //set whatever data you want to save to the db

    if(userid){
        var r= {_id:userid,playerName:playerName,score:myScore}
    }else{
        r= {playerName:playerName,score:myScore}
    }

    socket.emit('finish',r); //set whatever data you want to save to the db


};

let loadSound = () => {
    createjs.Sound.registerSound("/assets/sounds/start.ogg", "start");
    createjs.Sound.registerSound("/assets/sounds/add.ogg", "add");
}



socket.on('connect', function(data) {
        
});

socket.on('scoreUpdate', function(res) {
    console.log("score updated")
    console.log(res) //update leaderboard using this data
    let result=''

    let sorted =res.data.sort((a,b)=>{
        return parseInt(b.score)-parseInt(a.score)
    }).slice(0,10)
    sorted.forEach((v)=>{
        result += v.playerName+' : '+v.score +'<br>'
    })

    $('#leaderboard').html(result)

});

socket.on('player', (res) => {
    userid=res.uid
});