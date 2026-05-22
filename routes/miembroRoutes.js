import express from "express";
import MiembroController from "../controllers/MiembroController.js";
import { validateMiembro, validateMiembroUpdate } from "../middlewares/validateMiembro.js";

const router = express.Router();


router.get("/", MiembroController.list);
router.get("/create", MiembroController.getFormCreate);
router.post("/create", validateMiembro, MiembroController.create);
router.get("/update/:id", MiembroController.getFormEdit);
router.post("/update/:id", validateMiembroUpdate, MiembroController.update);
router.get("/delete/:id", MiembroController.Delete);

export default router;