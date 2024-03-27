import express from "express";
import ProductManager from "../controllers/productManager.js";

const router = express.Router();
const manager = new ProductManager("./src/models/productos.json")


//RUTA PARA TRAER TODOS LOS PRODUCTOS O SOLO LA CANT INDICADA EN LA QUERY LIMIT.
router.get("/products", async (req, res) => {
    let limit = parseInt(req.query.limit);
    let todosProductos = await manager.getProducts();
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
router.get("/products/:id", async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let todosProductos = await manager.getProducts();
        let productoId = todosProductos.find(producto => producto.id === id);
        if (!productoId) return res.send("El producto no existe");
        res.send(productoId);
    } catch {
        console.log("Error al querer obtener datos");
    }
});


//RUTA PARA AGREGAR PRODUCTOS AL ARRAY. (NO FUNCIONA...no hace bien lo del id)
router.post("/products", async (req, res) => {
    const nuevoProducto = req.body;
    // console.log(nuevoProducto)

    try {
        await manager.addProduct(nuevoProducto);
        res.status(201).json({ message: "Producto agregado correctamente" })
    
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" })
    }
})


router.put("/products/:pid", (req, res) => {
    const id = req.query.pid;
    const productoActualizado = req.body;
    try {
        manager.updateProduct(parseInt(id), productoActualizado);
    } catch {

    }
})


export default router;