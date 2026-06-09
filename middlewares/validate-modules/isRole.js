/**
 * Middleware para restringir el acceso a rutas según el rol del usuario en la sesión
 * @param {...string} allowedRoles - Lista de roles permitidos (Ej: 'admin', 'tesorero')
 */
export const isRole = (...allowedRoles) => {
    return (req, res, next) => {
        // 1. Validar usando nuevamente por si acaso la sesion
        if (!req.session || !req.session.user) {
            return res.status(401).render('errors/401', { 
                title: 'No Autenticado',
                message: 'Debe iniciar sesión para acceder a este recurso.' 
            });
        }

        // 2. Extraer el rol desde la sesión
        const userRole = req.session.user.rol;

        // 3. Comprobar si el rol tiene permiso
        const hasPermission = allowedRoles.includes(userRole);

        if (hasPermission) {
            return next(); // ¡Eres Admin! Pasas directo al controlador
        }

        // 4. Si no tiene permisos, denegar acceso de forma elegante
        console.warn(`[Seguridad] Usuario @${req.session.user.username} con rol [${userRole}] intentó forzar acceso.`);
        
        req.flash('error_msg', 'No tiene permisos suficientes para acceder a este módulo.');
        return res.redirect('/dashboard');
    };
};