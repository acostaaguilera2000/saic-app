import express from "express";
import flash from "connect-flash";
import session from "express-session";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Importación de rutas y middlewares

import dashboardRoutes from "./routes/dashboardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import servicePlatformRoutes from "./routes/servicePlatformRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import logisticsRoutes from "./routes/logisticsRoutes.js";
import ministryRoutes from "./routes/ministryRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import finaceRoutes from "./routes/finaceRoutes.js";

import { isAuthenticated } from "./middlewares/validate-modules/auth.js";
import { isRole } from "./middlewares/validate-modules/isRole.js";
import activeModule from "./middlewares/activeModule.js";
import error from "./middlewares/error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Middlewares de seguridad y utilidades
app.use(cors());

// CONFIGURACIÓN DE HELMET (Ajustada para CDNs comunes)
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "default-src": ["'self'"],
                "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
                "script-src-elem": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
                "script-src-attr": ["'unsafe-inline'"],
                "style-src": [
                    "'self'",
                    "'unsafe-inline'",
                    "https://cdn.jsdelivr.net",
                    "https://fonts.googleapis.com",
                    "https://cdnjs.cloudflare.com"
                ],
                "font-src": [
                    "'self'",
                    "https://fonts.gstatic.com",
                    "https://cdn.jsdelivr.net",
                    "https://cdnjs.cloudflare.com"
                ],
                // DataTables usa a veces backgrounds con imágenes codificadas en data: para las flechas
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

app.use(express.static("public", {
    maxAge: "7d",
    etag: true
}));

// 3. Configuración de sesión y Flash 
app.use(session({
    secret: process.env.SESSION_SECRET || "mi secreto",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Cambiar a true si usas HTTPS
}));

// INICIALIZAR FLASH 
app.use(flash());

// Middleware global 
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    // express-validator y se pasa 'errores', esto ayuda a que no explote si no existen
    res.locals.errores = req.flash('errores') || [];
    next();
});

app.use(activeModule);

// 4. Rutas públicas
app.get("/", (req, res) => {
    res.render("index", { title: "Bienvenido" });
});
app.use("/auth", authRoutes);

// 5. Rutas privadas con roles especificos

app.use("/dashboard", isAuthenticated, dashboardRoutes);
app.use("/profile", isAuthenticated, profileRoutes);
app.use("/users", isAuthenticated, isRole('admin'), userRoutes);
app.use("/members", isAuthenticated, isRole('admin', 'tesorero', 'lider'), memberRoutes);
app.use("/service", isAuthenticated, isRole('admin', 'lider'), servicePlatformRoutes);
app.use("/logistic", isAuthenticated, isRole('admin', 'lider', 'miembro'), logisticsRoutes);
app.use("/ministries", isAuthenticated, isRole('admin', 'lider'), ministryRoutes);
app.use("/finance", isAuthenticated, isRole('admin', 'tesorero'), finaceRoutes);
app.use("/report", isAuthenticated, isRole('admin', 'tesorero', 'lider'), reportRoutes);

// 6. Manejo de errores 
app.use(error.error404);

export default app;