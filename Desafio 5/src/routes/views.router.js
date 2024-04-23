import express from "express";
import ProductManager from "../controllers/productManager.js"
const router = express.Router();
const manager = new ProductManager ("./src/models/productos.json")

router.get("/", async (req, res) => {
    try {
        const productos = await manager.getProducts();
        res.render("home", {productos:productos})        
    } catch (error) {
        res.status(500).json({error: "Error interno del servidor"})
    }

})

router.get("/realtimeproducts", async (req, res) => {
   res.render("realTimeProducts")
} )


export default router;