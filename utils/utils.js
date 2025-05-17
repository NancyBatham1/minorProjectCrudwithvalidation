import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const encrypt = (string) => {
    return bcryptjs.hashSync(string, 10);
}

export const compareHash = (pass, hashDbPass)=>{
   return bcryptjs.compareSync(pass, hashDbPass);
}

export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn : process.env.JWT_TOKEN_EXPIRED_IN });
}

export const generateOTP = (digits = 6) => {
    if (digits <= 0) {
        throw new Error("Digits must be a positive number");
    }
    let otp = '';
    for (let i = 0; i < digits; i++) {
        otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
}