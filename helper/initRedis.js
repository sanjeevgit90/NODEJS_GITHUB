const redis = require('ioredis');  


const client = redis.createClient({
    port: 6379,
    host: "127.0.0.1"
})

client.on('connect', ()=>{
    client.select(1);// Select DB
    console.log("Client connected to redis")
})

client.on('ready', ()=>{
    console.log("Client connected to redis ready to use")
})

client.on('error', (err)=> {
    console.log(err.message)
})



client.on('end', ()=>{
    console.log("Client disconnected from redis")
})

process.on('SIGINT', ()=> {
     client.quit();
})



module.exports = client;