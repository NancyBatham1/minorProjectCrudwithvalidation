import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authenticate = async (req, res, next) => {
    let token = req.headers.authorization;
   
    if (!token) return res.status(400).json({ success: false, message: "Token not provided" })
    token = token.split(" ")[1];

    if (!token) return res.status(400).json({ success: false, message: "invalid token" });
    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        //// fetching value from db
        const user = await User.findOne({
            where: {
                id: decoded.id,
                email: decoded.email
            },
            attributes: {
                exclude: ['password']
            }
        });

        if (!user) return res.status(404).json({ success: false, message: "user not found" });
        req.user = user; /// setting db value in global value in req.user, passing user key in this object
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}

export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        next();
    };
};
  