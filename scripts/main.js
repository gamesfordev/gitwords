let socket = io.connect('http://localhost:8080');
let words = [
    {
        "splited" : ["mple", "exa"],
        "correct" : "example",
    },
    {
        "splited" : ["ca", "tion", "edu"],
        "correct" : "education",
    },
];

console.log(words);


let startGame = () => {
    $('#startGame').hide();
    $('#gameScreen').show();
    socket.emit('playerConnect', '');
};

socket.on('connect', function(data) {
        
});