import express from "express";
import MemberController from "../controllers/MemberController.js";
import { validate, validateMemberUpdate } from "../middlewares/validate-modules/validateMember.js";

const router = express.Router();

// Rutas del módulo de Miembros mapeadas al controlador estandarizado
router.get("/", MemberController.getAllMembers);

router.get("/create", MemberController.renderCreateForm);
router.post("/create", validate, MemberController.processCreateMember);

router.get("/update/:id", MemberController.renderEditForm);
router.post("/update/:id", validateMemberUpdate, MemberController.processUpdateMember);

router.get("/status/:id", MemberController.toggleMemberStatus); 

export default router;