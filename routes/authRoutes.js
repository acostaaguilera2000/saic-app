import express from "express";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();


router.get("/login", AuthController.renderLoginForm);
router.post("/login", AuthController.processLogin);
router.get("/logout", AuthController.processLogout);

export default router;