const express = require('express');  
const app = express();  
const server = require('http').createServer(app);  
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;
const mongo=require('./services/mongoservice').mongo

app.use(express.static(__dirname));

app.get('/', function(req, res,next) { 
    /*mongo(function(err,db){
        // db.collection("testdb").insertOne({"test3":"1234"}, function(err, result) {
           
        //     console.log(result);
        //     console.error(err);
        //     db.close();
        
        //   });

        let  cursor =db.collection("testdb").find()
        cursor.each(function(err, doc) {
            if (doc != null) {
               console.dir(doc);
            } else {
               
            }
         });

    })*/ 
    res.sendFile(__dirname + '/ui/index.html');
});

app.get('/scripts/main.js', function(req, res,next) {  
    res.sendFile(__dirname + '/scripts/main.js');
});

app.get('/css/style.css', function(req, res,next) {  
    res.sendFile(__dirname + '/css/style.css');
});

server.listen(port, () => {
	console.log('app is listening to ' + port);
});  


io.on('connection', function(client) {  
    client.on('playerConnect', (playerName) => {
    	console.log(playerName + ' Connected!');
    });

    client.on('finish', (data) => {
        mongo((err,db)=>{
            
            db.collection("score").save(data,{w:1},(err, result) => {
                if(!err){
                    const cursor=db.collection("score").find();
                    let data=[]
                    
                    console.log(cursor)

                    cursor.each((err, doc) => {

                        if(err){
                            console.error("error")
                        }

                        if (doc != null) {
                           data.push(doc);
                        } else {
                            io.emit('scoreUpdate',{data:data})
                        }
                     });

                    

                }
                db.close();
            
                });
            })
    
    });
});