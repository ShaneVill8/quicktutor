var Joi = require('joi');

var schemas = {};

schemas.newuser = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9!#$?*_.]{3,30}/).required(),
    firstname: Joi.string().regex(/[a-zA-Z]+/).required(),
    lastname: Joi.string().regex(/[a-zA-Z]+/).required()
});

schemas.login = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9!#$?*_.]{3,30}/).required()
});

module.exports = schemas;
