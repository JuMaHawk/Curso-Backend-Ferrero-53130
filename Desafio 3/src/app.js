import express from "express"
import ProductManager from "./productManager.js"

const PUERTO = 8080;
const app = express();

app.use(express.urlencoded({ extended: true }));

//Instancio la clase importada de "productManager.js"
const manager = new ProductManager("./src/productos.json")



app.get("/productos", (req, res) => {
    let limit = parseInt(req.query.limit);
    let todosProductos = manager.getProducts();
    if (!limit) return res.send(todosProductos);
    let prodConLimite = todosProductos.slice(0, limit);
    res.send(prodConLimite);
});


app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`)
})