const Joi = require('joi');

const authSchema = Joi.object({
    firstName:Joi.string().min(2).required(),
    lastName:Joi.string().min(2).required(),
    mobileNo:Joi.string().min(10).max(10).required(),
    email:Joi.string().email().lowercase().required(),
    gender:Joi.string().min(2).required(),
    role:Joi.string().min(2).required(),
    password:Joi.string().min(2).required()
})

const loginSchema = Joi.object({
    email:Joi.string().email().lowercase().required(),
    password:Joi.string().min(2).required()
})

module.exports = {
    authSchema, loginSchema
}