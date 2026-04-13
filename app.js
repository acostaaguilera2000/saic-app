import express from "express";
import session from "express-session";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/usersRoutes.js";
import error from "./middlewares/error.js";
import { isAuthenticated } from "./middlewares/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Middlewares de seguridad y utilidades
app.use(cors());

// CONFIGURACIÓN ÚNICA DE HELMET (Sustituye a las dos anteriores)
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "default-src": ["'self'"],
                "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
                "script-src-elem": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
                "script-src-attr": ["'unsafe-inline'"],
                "style-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
                "font-src": ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
                "img-src": ["'self'", "data:", "https://ui-avatars.com"],
                "connect-src": ["'self'", "https://cdn.jsdelivr.net"],
                "upgrade-insecure-requests": [],
            },
        },
    })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Configuración de vistas y carpeta pública
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

// 3. Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET || "mi secreto",
    resave: false,
    saveUninitialized: false,
}));

// Pasar usuario de sesión a locales (para usar en Pug)
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// 4. Rutas públicas
app.get("/", (req, res) => {
    res.render("index", { title: "Bienvenido" });
});
app.use("/auth", authRoutes);

// 5. Rutas privadas
app.get("/dashboard", isAuthenticated, (req, res) => {
    res.render("dashboard", { title: "Panel de control" });
});
app.use("/users", isAuthenticated, userRoutes);

// 6. Manejo de errores 
app.use(error.error404);

export default app;