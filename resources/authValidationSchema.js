const Joi = require('joi');

const userSchema = Joi.object({
    _id:Joi.string(),
    firstName:Joi.string().min(2).required(),
    lastName:Joi.string().min(2).required(),
    mobileNo:Joi.string().min(10).max(10).required(),
    email:Joi.string().email().lowercase().required(),
    gender:Joi.string().min(2).required(),
    role:Joi.array().required(),
    password:Joi.string().min(2).required(),
    dob:Joi.string().min(2),

})

const loginSchema = Joi.object({
    email:Joi.string().email().lowercase().required(),
    password:Joi.string().min(2).required()
})

module.exports = {
    userSchema, loginSchema
}