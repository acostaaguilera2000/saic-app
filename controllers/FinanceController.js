import FinanceService from '../services/financeService.js';

/**
 * Controlador encargado de acoplar el protocolo HTTP con las reglas del servicio financiero
 * @class FinanceController
 */
class FinanceController {

    static async index(req, res) {
        try {
            const contextData = await FinanceService.getDashboardContext();
            res.render('finance-views/index', {
                donaciones: contextData.donaciones
            });
        } catch (error) {
            console.error("Fallo crítico en FinanceController.index:", error);
            res.render('finance-views/index', {
                donaciones: [],
                errores: [error.message]
            });
        }
    }


    static async createView(req, res) {
        try {
            const contextData = await FinanceService.getDashboardContext();

            res.render('finance-views/create-donacion', {
                miembros: contextData.miembros,
                errores: req.validationErrors || [],
                valores: req.body || {}
            });
        } catch (error) {
            console.error("Fallo crítico en FinanceController.createView:", error);
            req.flash('error_msg', "No se pudo cargar el listado de miembros activos.");
            res.redirect('/finance');
        }
    }


    static async createDonation(req, res) {
        if (req.validationErrors && req.validationErrors.length > 0) {
            return FinanceController.createView(req, res);
        }

        try {
            await FinanceService.processTransaction(req.body);
            req.flash('success_msg', "Ingreso financiero registrado exitosamente.");
            res.redirect('/finance/create');
        } catch (error) {
            console.error("Fallo crítico en FinanceController.createDonation:", error);
            req.flash('error_msg', error.message || "Fallo al procesar la transacción.");
            res.redirect('/finance');
        }
    }

    static async cancelDonation(req, res) {
        try {
            await FinanceService.cancelTransaction(req.params.id);
            req.flash('success_msg', "La transacción financiera ha sido anulada correctamente.");
            res.redirect('/finance');
        } catch (error) {
            console.error("Fallo crítico en FinanceController.cancelDonation:", error);
            req.flash('error_msg', error.message || "No se pudo anular la transacción.");
            res.redirect('/finance');
        }
    }
}

export default FinanceController;