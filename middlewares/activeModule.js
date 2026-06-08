
const activeModuleMiddleware = (req, res, next) => {
    const path = req.path; // Ejemplo: '/report/services' o '/dashboard'
    const modules = {
        '/dashboard': 'dashboard',
        '/report': 'report',
        '/users': 'users',
        '/service': 'service',
        '/members': 'members',
        '/profile': 'profile',
        '/ministries': 'ministries',
        '/finance': 'finance',
    };

    // Buscamos si la URL actual empieza con alguna de nuestras claves configuradas
    const activeKey = Object.keys(modules).find(route => path.startsWith(route));

    // Si coincide, asignamos el módulo correspondiente; 
    res.locals.currentModule = activeKey ? modules[activeKey] : 'dashboard';

    next();
};

export default activeModuleMiddleware;