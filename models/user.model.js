const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    firstName: {
        type:String,
        required:true,
        max:100
    },
    lastName: {
        type:String,
        required:true,
        max:100
    },
    mobileNo: {
        type:String,
        required:true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    role: {
        type:Array,
        required:true
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: false
    }

})

UserSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error)
    }
})

UserSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}


const User = mongoose.model('user', UserSchema)
module.exports = User