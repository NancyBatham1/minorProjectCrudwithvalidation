import { Router } from "express";
import { login, signUp, profile, forgotPassword, resetPassword, verifyEmailOTP, changePassword } from "../controllers/auth.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

let router = Router()

//// post API
router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email-otp', authenticate, authorize("user"), verifyEmailOTP);
router.post('/change-password', authenticate, authorize("user", "admin"), changePassword);

///// get API
router.get('/profile', authenticate, authorize("user", "admin"), profile);

export default router;
