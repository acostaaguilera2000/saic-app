import express from 'express';
import FinanceController from '../controllers/financeController.js';
import { validateDonationInput } from '../middlewares/validate-modules/financeValidation.js';

const router = express.Router();

router.get('/', FinanceController.index);
router.post('/donations/cancel/:id', FinanceController.cancelDonation);

// Rutas para llmar el formulario - create y procesarlo 
router.get('/create', FinanceController.createView);
router.post('/donations/create', validateDonationInput, FinanceController.createDonation);

export default router;