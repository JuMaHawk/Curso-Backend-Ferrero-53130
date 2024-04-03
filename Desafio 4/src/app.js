import express from "express";
import exphds from "express-handlebars"
const app = express()
const PUERTO = 8080;

app.use(express.static("./src/public"));

app.engine("handlebars", exphds.engine());

app.set("view engine", "handlebars");

app.set("views", "./src/views");

// RUTAS
app.get(("/realtimeproducts"), (req, res) => {
    res.render("realTimeProducts")
})

app.get("/", (req, res) => {
    res.render("home")
})


app.listen(PUERTO, () => {
    console.log(`Escuchando en http://localhost:${PUERTO}`)
})