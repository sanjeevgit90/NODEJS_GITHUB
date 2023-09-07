const {promisify} = require('util')
const client = require('../helper/initRedis');
module.exports = { 
    GET_ASYNC: promisify(client.get).bind(client),// GET Redis Cached Data
    SET_ASYNC: promisify(client.set).bind(client) // SET Redis Cached Data
}



