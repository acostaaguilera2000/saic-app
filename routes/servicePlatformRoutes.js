import { Router } from "express";
import ServicePlatformController from "../controllers/ServicePlatformController.js";
import { validateServicePlatform } from "../middlewares/validate-modules/servicePlatformValidator.js";

const router = Router();

router.get("/", ServicePlatformController.getAllServices);
router.get("/create", ServicePlatformController.renderCreateForm);
router.post("/create", validateServicePlatform, ServicePlatformController.processCreateService);
router.get("/update/:id", ServicePlatformController.renderEditForm);
router.post("/update/:id", validateServicePlatform, ServicePlatformController.processUpdateService);
router.get("/delete/:id", ServicePlatformController.deleteService);

export default router;