
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://nullpointer:X1HZH5Ih87VYMEZh@knockout-shard-00-00-loycl.mongodb.net:27017,knockout-shard-00-01-loycl.mongodb.net:27017,knockout-shard-00-02-loycl.mongodb.net:27017/test?ssl=true&replicaSet=knockout-shard-0&authSource=admin";


module.exports.mongo=function(callback){
    MongoClient.connect(uri,callback);
}