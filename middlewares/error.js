
const error = {
    error404: (req, res) => {
        res.status(404).render("error", {
            title: "Error 404 Not Found",
            message: "El recurso que estas buscando no existe"
        });
    },
     error400: (req, res, error) => {
        res.status(400).render("error", {
            title: "Error 400 Bad Request",
            message: error.message
        });
    },
    error401: (req, res, error) => {
        res.status(401).render("error", {
            title: "Error 401 Authorization required",
            message: error.message
        });
    },
    error403: (req, res, error) => {
        res.status(403).render("error", {
            title: "Error 403 Forbidden",
            message: error.message
        });
    },

    error500: (req, res, error) => {
        res.status(500).render("error", {
            title: "Error 500 Internal server",
            message: error.message
        });
    }

}

export default error;