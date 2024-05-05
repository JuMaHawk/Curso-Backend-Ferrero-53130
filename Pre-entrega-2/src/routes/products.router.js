import express from "express";
import ProductManager from "../controllers/productManager.js";

const router = express.Router();
const manager = new ProductManager()


//RUTA PARA TRAER TODOS LOS PRODUCTOS O SOLO LA CANT INDICADA EN LA QUERY LIMIT.
// router.get("/products", async (req, res) => {
//     let limit = parseInt(req.query.limit);
//     let categoria = req.query.category;
//     let todosProductos = await manager.getProducts();
//     try {
//         if (limit) {
//             res.json(todosProductos.slice(0, limit))
//         } else {
//             limit = 10;
//             res.json(todosProductos.slice(0, limit))
//         }
//     } catch (error) {
//         console.error("Tuvimos un problema al querer obtener el producto", error);
//         res.status(500).json({ error: "Error interno del servidor" });
//     }
// });

//RUTA PARA TRAER TODOS LOS PRODUCTOS O SOLO LA CANT INDICADA EN LA QUERY LIMIT.
router.get("/products", async (req, res) => {
    let query = req.query.query;
    console.log("query :" + query)

    let limit = parseInt(req.query.limit);
    console.log("limit :" + limit)

    let page = parseInt(req.query.page);
    console.log("page :" + page)
    
    let sort = parseInt(req.query.sort);
    console.log("sort :" + sort)

    try {
        let todosLosProductos = await manager.getProductNew(query, limit, page,sort)
        res.json(todosLosProductos)
    } catch (error) {
        console.error("Tuvimos un problema al querer obtener el producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});




//RUTA PARA VER ALGUN PRODUCTO EN PARTICULAR SEGUN SU ID.
router.get("/products/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let productoId = await manager.getProductById(id);
        if (!productoId) return res.send("El producto no existe");
        res.send(productoId);
    } catch {
        console.log("Error al querer obtener datos");
    }
});


//RUTA PARA AGREGAR PRODUCTOS AL ARRAY.
router.post("/products", async (req, res) => {

    const nuevoProducto = req.body;

    try {
        await manager.addProduct(nuevoProducto);
        res.status(201).json({ message: "Producto agregado correctamente" })

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" })
    }
})

//RUTA PARA ACTUALIZAR UN PRODUCTO POR ID.
router.put("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    const productoActualizado = req.body;
    try {
        await manager.updateProduct(id, productoActualizado);
        res.status(201).json({ message: "Producto actualizado correctamente" })
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" })
    }
})

//RUTA PARA ELIMINAR UN PRODUCTO.
router.delete("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        await manager.deleteProduct(id);
        res.status(201).json({ message: "Producto eliminado correctamente" })
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" })
    }
})


export default router;