const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
    menuName: {
        type:String,
        require:true,
        max:200
    },
    menuUrl: {
        type:String,
        require:true,
        max:100
    },
    parentMenuName: {
        type:String,
        require:false,
        max:200
    },
    menuIcon: {
        type:String,
        require:false,
        max:100
    },
    menuOrder: {
        type:Number,
        require:false,
        max:10
    }

})

const Menu = mongoose.model('menu', menuSchema)
module.exports = Menu;