import { Router } from "express";
import { getUsers, login, signUp, profile, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

let router = Router()
router.get('/users', getUsers);
router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', authenticate,authorize("user", "admin"), profile);



export default router;
