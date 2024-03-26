import express from "express";
import ProductManager from "../controllers/productManager.js";

const router = express.Router();
const manager = new ProductManager("./src/models/productos.json")


//RUTA PARA TRAER TODOS LOS PRODUCTOS O SOLO LA CANT INDICADA EN LA QUERY LIMIT.
router.get("/products", (req, res) => {
    let limit = parseInt(req.query.limit);
    let todosProductos = manager.getProducts();
    try {
        if (limit) {
            res.json(todosProductos.slice(0, limit))
        } else {
            res.json(todosProductos);
        }
    } catch (error) {
        console.error("Tuvimos un problema al querer obtener el producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//RUTA PARA VER ALGUN PRODUCTO EN PARTICULAR SEGUN SU ID.
router.get("/products/:id", (req, res) => {
    let id = parseInt(req.params.id);
    let todosProductos = manager.getProducts();
    let productoId = todosProductos.find(producto => producto.id === id);
    if (!productoId) return res.send("El producto no existe");
    res.send(productoId);
});


//RUTA PARA AGREGAR PRODUCTOS AL ARRAY.
router.post("/products", (req, res) => {
    const newProduct = req.body
    console.log(newProduct)
    try {
        manager.addProduct(newProduct);
        res.status(201).json({ message: "Producto agregado correctamente" })
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" })
    }
})

export default router;