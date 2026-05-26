import { Router } from "express";
import LogisticaController from "../controllers/LogisticaController.js";
import validateLogistica from "../middlewares/validateLogistica.js";

const router = Router();

router.get("/manage/:idCulto", LogisticaController.getForm);
router.post("/manage/:idCulto", validateLogistica, LogisticaController.processForm);

export default router;