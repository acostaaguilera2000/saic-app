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

// Middlewares globales
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de vistas y carpeta pública
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

// Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET || "mi secreto",
    resave: false,
    saveUninitialized: false,
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});


// Rutas públicas
app.get("/", (req, res) => {
    res.render("index", { title: "Bienvenido" });
});
app.use("/auth", authRoutes);

// Rutas privadas
app.get("/dashboard", isAuthenticated, (req, res) => {
    res.render("dashboard", { title: "Panel de control" });
});
app.use("/users", isAuthenticated, userRoutes);

// Manejo de errores
app.use(error.error404);

export default app;
