import { Router } from "express";
import LogisticsController from "../controllers/LogisticsController.js";
import validateLogistics from "../middlewares/validate-modules/validateLogistics.js";

const router = Router();

router.get("/manage/:idCulto", LogisticsController.renderManageForm);
router.post("/manage/:idCulto", validateLogistics, LogisticsController.processManageForm);

export default router;