import express from "express";
import CartManager from "../controllers/cartController.js";
import { handlePolicies } from "../middelwaree/middleware.js";

const router = express.Router();
const cartManager = new CartManager();


router.post("/", cartManager.crearnuevocarrito)  // Crear un nuevo carrito
router.get("/", cartManager.getCarts)  // Traer todos los carritos
router.get("/:cid", cartManager.getCarritoById)  //Listar productos de un carrito especifico por su Id.
router.post("/:cid/product/:pid", handlePolicies(["USER"]),cartManager.addProductCart) //Agregar productos a distintos carritos.
router.delete("/:cid/products/:pid", cartManager.deleteProductToCart)  //Eliminar un producto de un carrito.
router.put("/:cid", cartManager.updateCart)  //Actualizar la cantidad de un producto en un carrito a traves de un arreglo.
router.put("/:cid/product/:pid", cartManager.updateAmountProductByCart) //Actualizar cantidad de un producto.
router.delete("/:cid", cartManager.deleteProductsByCart) //Vaciar carrito.
// router.get("/:cid/purchase", cartManager.endSend) //Finalizar el proceso de compra.


export default router; 