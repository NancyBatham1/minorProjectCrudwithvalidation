import { createUserSchema } from "../helpers/admin.validator.js";
import { userCreate } from "../services/auth.service.js";
import { sendEmailToUser } from "../services/email.service.js";
import { INTERNAL_SERVER_ERROR, INVALID_DATA, REGISTRATION_SUCCESS } from "../utils/constants.js";
import { encrypt } from "../utils/utils.js";


export const createUser = async (req, res) => {
    try {
        ///validation
        const { value, error } = createUserSchema.validate(req.body);
        if (error) { return res.json({ msg: INVALID_DATA, error: error.details[0].message }) }

        ///pass encryption
        value.password = encrypt(value.password);

        /// create user
        let createUser = await userCreate({ ...value, emailOtp: null, isEmailVerified: true });

        sendEmailToUser({
            to: createUser.email,
            subject: REGISTRATION_SUCCESS,
            emailValues: { name: createUser.name, password: req.body.password, role: value.role },
            template: 'signup-by-admin.ejs'
        });

        res.status(201).json({ success: true, message: REGISTRATION_SUCCESS })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: INTERNAL_SERVER_ERROR, error: error.stack })
    }

}