import { userFindAll, userCreate, getUser, updateOtp } from "../services/auth.service.js";
import { changePasswordSchema, emailVerificationSignupSchema, forgotPasswordSchema, loginSchema, resetPasswordSchema, signUpSchema } from "../helpers/auth.validator.js";
import { encrypt, compareHash, generateToken, generateOTP } from "../utils/utils.js";
import { EMAIL_ALREADY_VERIFIED, EMAIL_SENT, EMAIL_VERIFIED, FORGOT_PASSWORD_SUBJECT, INTERNAL_SERVER_ERROR, INVALID_CREDENTIALS, INVALID_DATA, INVALID_OTP, LOGIN_SUCCESS, OLD_PASSWORD_NOT_MATCHED, PASSWORD_CHANGE_SUCCESSFUL, PASSWORD_RESET_SUCCESS, REGISTRATION_SUCCESS, USER_CREATED_SUBJECT, USER_NOT_FOUND, VERIFY_EMAIL } from "../utils/constants.js";
import { sendEmailToUser } from "../services/email.service.js";


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
        sendEmailToUser({
            to: createUser.email,
            subject: USER_CREATED_SUBJECT,
            emailValues: { name: createUser.name },
            template: 'welcome.ejs'
        });


        // verify email
        let otp = generateOTP();
        createUser.emailOtp = otp;
        await createUser.save();

        sendEmailToUser({
            to: createUser.email,
            subject: VERIFY_EMAIL,
            emailValues: { name: createUser.name, otp: createUser.emailOtp },
            template: 'verifyEmail.ejs'
        });

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
        if (!user) return res.status(404).json({ success: false, message: USER_NOT_FOUND })

        ///pass compare from db  
        let isPassMatched = compareHash(value.password, user.password);
        if (!isPassMatched) return res.status(400).json({ success: false, message: INVALID_CREDENTIALS })

        /// create jwt token
        let token = generateToken({ id: user.id, email: user.email });

        res.status(200).json({ success: true, message: LOGIN_SUCCESS, token })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: INTERNAL_SERVER_ERROR, error: error.stack })
    }

}

export const profile = (req, res) => {
    console.log("profile()");
    res.status(200).json({ success: true, message: "profile detail fetched", profile: req.user });

}

export const changePassword = async (req, res) => {
    try {
        ///validation
    const { value, error } = changePasswordSchema.validate(req.body);

    if (error) return res.status(401).json({ success: false, message: INVALID_DATA, error: error.details[0].message });

    /// get user
    let user = await getUser({
        where: {
            email: req.user.email
        }
    });

    // check user is in db
    if (!user) return res.status(404).json({ success: false, message: USER_NOT_FOUND })

    // try to check given password with DB password
    let isPassMatched = compareHash(value.oldPassword, user.password);
    if (!isPassMatched) return res.status(400).json({ success: false, message: OLD_PASSWORD_NOT_MATCHED})

    user.password = encrypt(value.newPassword);
    await user.save();

    res.status(200).json({ success: true, message: PASSWORD_CHANGE_SUCCESSFUL });
    
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: INTERNAL_SERVER_ERROR, error: error.stack })
    }

}

export const forgotPassword = async (req, res) => {

    try {

        ///validation
        const { value, error } = forgotPasswordSchema.validate(req.body);
        if (error) return res.status(401).json({ success: false, message: INVALID_DATA, error: error.details[0].message });

        /// get user
        let user = await getUser({
            where: {
                email: value.email
            }
        });

        // check user is in db
        if (!user) return res.status(404).json({ success: false, message: USER_NOT_FOUND })

        let otp = generateOTP();
        await updateOtp({ emailOtp: otp }, {
            where: {
                email: value.email
            }
        });

        sendEmailToUser({
            to: value.email,
            subject: FORGOT_PASSWORD_SUBJECT,
            emailValues: { name: user.name, otp },
            template: 'forgot-password.ejs'
        });
        res.status(200).json({ success: true, message: EMAIL_SENT });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: INTERNAL_SERVER_ERROR, error: error.stack });
    }

}

export const resetPassword = async (req, res) => {

    try {

        ///validation
        const { value, error } = resetPasswordSchema.validate(req.body);
        if (error) return res.status(401).json({ success: false, message: INVALID_DATA, error: error.details[0].message });

        /// get user
        let user = await getUser({
            where: {
                email: value.email
            }
        });

        // check user is in db
        if (!user) return res.status(404).json({ success: false, message: USER_NOT_FOUND });

        // check otp from db
        if (user.emailOtp != value.otp) return res.status(400).json({ success: false, message: INVALID_OTP })

        user.emailOtp = null;
        user.password = encrypt(value.password);
        await user.save();

        res.status(200).json({ success: true, message: PASSWORD_RESET_SUCCESS });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: INTERNAL_SERVER_ERROR, error: error.stack });
    }

}

export const verifyEmailOTP = async (req, res) => {

    try {

        ///validation
        const { value, error } = emailVerificationSignupSchema.validate(req.body);
        if (error) return res.status(401).json({ success: false, message: INVALID_DATA, error: error.details[0].message });

        /// get user
        let user = await getUser({
            where: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role
            }
        });

        // check if user exists
        if (!user) return res.status(404).json({ success: false, message: USER_NOT_FOUND });

        // check if user's email is already verified
        if (user.isEmailVerified) return res.status(400).json({ success: false, message: EMAIL_ALREADY_VERIFIED });

        // check otp from db
        if (user.emailOtp != value.otp) return res.status(400).json({ success: false, message: INVALID_OTP })

        user.emailOtp = null;
        user.isEmailVerified = true;
        await user.save();

        res.status(200).json({ success: true, message: EMAIL_VERIFIED });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: INTERNAL_SERVER_ERROR, error: error.stack });
    }

}