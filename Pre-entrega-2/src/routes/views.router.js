import express from "express";
import ProductManager from "../controllers/productManager.js"
const router = express.Router();
const manager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        let query = req.query.query;
        let limit = parseInt(req.query.limit);
        let page = parseInt(req.query.page);
        let sort = (req.query.sort);

        const productos = await manager.getProducts({limit, sort, page, query});
        res.render("home", {productos:productos.docs})        
    } catch (error) {
        res.status(500).json({error: "Error interno del servidor"})
    }
})

router.get("/realtimeproducts", async (req, res) => {
   res.render("realTimeProducts")
} )


export default router;