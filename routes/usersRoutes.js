import express, { Router } from "express";
import UserController from "../controllers/UserController.js";
import { validateUser } from "../middlewares/validateUser.js";
import { validateUpdateUser } from "../middlewares/validateUpdateUser.js";

const router = express.Router();

router.get("/list", UserController.list)
router.get("/create", UserController.getFormCreate)
router.post("/create", validateUser, UserController.create)
router.get("/update/:id", UserController.getFormEdit)
router.post("/update/:id", validateUpdateUser, UserController.update)
router.get("/delete/:id",UserController.GetConfirmDelete)
router.post("/delete/:id",UserController.Delete)
export default router;