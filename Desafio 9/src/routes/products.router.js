import express from "express";
import ProductManager from "../controllers/productController.js";

const router = express.Router();
const productsManager = new ProductManager()


router.get("/", productsManager.getProducts) // RUTA PARA TRAER TODOS LOS PRODUCTOS O SOLO LA CANT INDICADA EN LA QUERY LIMIT.
router.get("/:id", productsManager.getProductById)//RUTA PARA VER ALGUN PRODUCTO EN PARTICULAR SEGUN SU ID.
router.post("/", productsManager.addProduct) //AGREGAR UN NUEVO PRODUCTO.
router.put("/:pid", productsManager.updateProduct) // Actualizar producto.
router.delete("/:pid", productsManager.deleteProduct) //ELIMINAR PRODUCTO.

export default router;