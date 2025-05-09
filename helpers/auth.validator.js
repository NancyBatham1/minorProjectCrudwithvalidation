import Joi from 'joi';

export const signUpSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required().messages({
        'any.required': 'Email is required',
        'string.email': 'Email must be email type',
        'string.empty': 'Email should not be empty'
    }),
    password: Joi.string().required()
});

export const loginSchema = Joi.object({
   email: Joi.string().email().required().messages({
        'any.required': 'Email is required',
        'string.email': 'Email must be email type',
        'string.empty': 'Email should not be empty'
    }),
    password: Joi.string().required()
});