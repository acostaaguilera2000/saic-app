import app from "./app.js";

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`La aplicación está funcionando en http://localhost:${port}`);
});