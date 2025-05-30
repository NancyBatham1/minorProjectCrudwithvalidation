import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { createUser } from "../controllers/admin.controller.js";

let adminRouter = Router()

//// post API
adminRouter.post('/create-user', authenticate, authorize("admin"), createUser);

///// get API


export default adminRouter;
