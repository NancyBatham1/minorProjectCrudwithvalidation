import { userFindAll, userCreate, getUser } from "../services/auth.service.js";
import { loginSchema, signUpSchema } from "../helpers/auth.validator.js";
import { encrypt, compareHash, generateToken } from "../utils/utils.js";
import { INTERNAL_SERVER_ERROR, INVALID_CREDENTIALS, INVALID_DATA, REGISTRATION_SUCCESS, USER_NOT_FOUND } from "../utils/constants.js";

export const getUsers = async (req, res) => {
    try {
        const users = await userFindAll();
        res.json(users)
    } catch (error) {
        res.json({ error: error })
    }

}


export const signUp = async (req, res) => {
    try {
        ///validation
        const { value, error } = signUpSchema.validate(req.body);
        if (error) { return res.json({ msg: 'invalid data', error: error.details[0].message }) }

        ///pass encryption
        value.password = encrypt(value.password);

        /// create user
        let createUser = await userCreate(value);

        /// create jwt token
        let token = generateToken({ id: createUser.id, email: createUser.email });

        res.status(201).json({ success: true, message: REGISTRATION_SUCCESS, token })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: INTERNAL_SERVER_ERROR, error: error.stack })
    }

}

export const login = async (req, res) => {
    try {
        ///validation
        const { value, error } = loginSchema.validate(req.body);
        if (error) return res.status(401).json({ success: false, message: INVALID_DATA, error: error.details[0].message })

        /// get user
        let user = await getUser({
            where: {
                email: value.email
            }
        });

        // check user is in db
        if (!user) return res.status(404).json({ success: false, message: USER_NOT_FOUND})

        ///pass compare from db  
        let isPassMatched = compareHash(value.password, user.password);
        if (!isPassMatched) return res.status(400).json({ success: false, message: INVALID_CREDENTIALS})

        /// create jwt token
        let token = generateToken({ id: user.id, email: user.email });

        res.status(200).json({ success: true, message: LOGIN_SUCCESS, token })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: INTERNAL_SERVER_ERROR, error: error.stack })
    }

}