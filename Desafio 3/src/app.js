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


app.get("/productos/:id", (req, res) => {
    let id = parseInt(req.params.id);
    let todosProductos = manager.getProducts();
    let productoId = todosProductos.find(producto => producto.id === id);
    if (!productoId) return res.send("El producto no existe");
    res.send(productoId);
});

app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`)
})