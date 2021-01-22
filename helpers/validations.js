const Joi = require('joi');

const registerValidation = Joi.object({
    username: Joi.string().lowercase().min(4).required(),
    email: Joi.string().lowercase().required().email(),
    password: Joi.string().min(6).required()
});

const loginValidation = Joi.object({
    email: Joi.string().lowercase().required().email(),
    password: Joi.string().min(6).required()
});

module.exports = { registerValidation, loginValidation }