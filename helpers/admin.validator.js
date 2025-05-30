import Joi from 'joi';

export const createUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
    role: Joi.string().required().label("Role").valid('manager', 'user')
});
