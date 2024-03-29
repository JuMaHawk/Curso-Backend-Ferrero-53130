import express from "express";
const app = express();
const PORT = 8080;
import productosRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.send("funciona!")
})

//Rutas
app.use("/api", productosRouter);
app.use("/api", cartsRouter);



app.listen (PORT, () => {
    console.log(`Escuchando en puerto http://localhost/${PORT}`)
})