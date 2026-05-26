import { Router } from "express";
import CultoController from "../controllers/CultoController.js";
import validateCulto from "../middlewares/validateCulto.js";

const router = Router();

router.get("/", CultoController.list);
router.get("/create", CultoController.getFormCreate);
router.post("/create", validateCulto, CultoController.create);
router.get("/update/:id", CultoController.getFormEdit);
router.post("/update/:id", validateCulto, CultoController.update);
router.get("/delete/:id", CultoController.Delete);
router.get("/reporte", CultoController.getReporte);

export default router;