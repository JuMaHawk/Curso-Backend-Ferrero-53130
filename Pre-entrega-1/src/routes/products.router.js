import express from "express";
import ProductManager from "../controllers/productManager.js";

const router = express.Router();
const manager = new ProductManager("./src/models/productos.json")

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
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});


router.get("/products/:id", (req, res) => {
    let id = parseInt(req.params.id);
    let todosProductos = manager.getProducts();
    let productoId = todosProductos.find(producto => producto.id === id);
    if (!productoId) return res.send("El producto no existe");
    res.send(productoId);
});

export default router;