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

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'any.required': 'Email is required',
        'string.email': 'Email must be email type',
        'string.empty': 'Email should not be empty'
    })
});

export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
    otp: Joi.string().required().label("OTP")
});