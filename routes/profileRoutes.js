import express from "express";
import ProfileController from "../controllers/ProfileController.js";
import { validateProfileUpdate } from "../middlewares/validate-modules/validateProfile.js";

const router = express.Router();

router.get("/", ProfileController.renderProfile);
router.post("/update", validateProfileUpdate, ProfileController.processUpdateProfile);

export default router;