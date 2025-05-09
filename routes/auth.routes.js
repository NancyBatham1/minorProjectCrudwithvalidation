import { Router } from "express";
import { getUsers, signUp } from "../controllers/auth.controller.js";

let router = Router()
router.get('/users', getUsers);
router.post('/signup', signUp);


export default router;
