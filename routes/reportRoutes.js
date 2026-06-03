import { Router } from "express";
import ReportController from "../controllers/ReportController.js";

const router = Router();

// Renderiza el panel principal de reportes (Dashboard Bento Grid)
router.get("/", ReportController.renderDashboard);

// Procesa y renderiza el reporte específico de la agenda de servicios/cultos
router.get("/services", ReportController.getServicesReport);

export default router;
