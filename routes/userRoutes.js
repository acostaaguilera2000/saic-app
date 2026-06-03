import express from "express";
import UserController from "../controllers/UserController.js";
import { validateUserCreate, validateUserUpdate } from "../middlewares/validate-modules/validateUser.js";

const router = express.Router();

// Rutas administrativas para la gestión de usuarios

router.get("/", UserController.getAllUsers);
router.get("/create", UserController.renderCreateForm);
router.post("/create", validateUserCreate, UserController.processCreateUser);
router.get("/update/:id", UserController.renderEditForm);
router.post("/update/:id", validateUserUpdate, UserController.processUpdateUser);
router.get("/delete/:id", UserController.deleteUser); // Ideal para enganchar con tu SweetAlert2 frontal

export default router;