import express, { Router } from "express";
import AuthController from "../controllers/AuthController.js";
const router = express.Router();

router.get("/login", AuthController.getFormLogin);
router.post("/login", AuthController.login)
router.get("/logOut",AuthController.logOut)


export default router;