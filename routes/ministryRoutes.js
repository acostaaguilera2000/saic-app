import express from "express";
import MinistryController from "../controllers/MinistryController.js";
import {
    validateMinistryCreate,
    validateMinistryMemberAction
} from "../middlewares/validate-modules/ministryValidation.js";

const router = express.Router();


router.get("/", MinistryController.getAllMinistries);
router.post("/create", validateMinistryCreate, MinistryController.processCreateMinistry);
router.get("/:id", MinistryController.getMinistryDetails);
router.post("/add-member", validateMinistryMemberAction, MinistryController.processAddMember);
router.post("/remove-member", validateMinistryMemberAction, MinistryController.processRemoveMember);

export default router;