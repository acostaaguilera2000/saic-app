import { Router } from "express";
import ServicePlatformController from "../controllers/ServicePlatformController.js";
import { validateServicePlatform } from "../middlewares/validate-modules/servicePlatformValidator.js";
import { isRole } from "../middlewares/validate-modules/isRole.js";

const router = Router();



router.get("/hub", isRole('admin', 'lider', 'miembro'), ServicePlatformController.getHub);


// Los tres roles pueden consultar la programación general o el cronograma stand-alone
router.get("/", isRole('admin', 'lider', 'miembro'), ServicePlatformController.getAllServices);
router.get("/schedule", isRole('admin', 'lider', 'miembro'), ServicePlatformController.getAllSchedule);


// --- Crear Nuevo Culto/Servicio ---
router.get("/create", isRole('admin', 'lider'), ServicePlatformController.renderCreateForm);
router.post("/create", isRole('admin', 'lider'), validateServicePlatform, ServicePlatformController.processCreateService);

// --- Actualizar / Editar Culto ---
router.get("/update/:id", isRole('admin', 'lider'), ServicePlatformController.renderEditForm);
router.post("/update/:id", isRole('admin', 'lider'), validateServicePlatform, ServicePlatformController.processUpdateService);

// --- Eliminar Culto ---
router.get("/delete/:id", isRole('admin', 'lider'), ServicePlatformController.deleteService);

export default router;