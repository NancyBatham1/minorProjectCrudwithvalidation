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
