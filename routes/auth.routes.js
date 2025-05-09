import { Router } from "express";
import { getUsers, login, signUp } from "../controllers/auth.controller.js";

let router = Router()
router.get('/users', getUsers);
router.post('/signup', signUp);
router.post('/login', login);



export default router;
