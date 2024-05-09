import express from "express";
import CartManager from "../controllers/cartManager.js";

const router = express.Router(); 
const cartManager = new CartManager();

//1) Creamos un nuevo carrito:

router.get("/", async (req, res) => {
    const listaDeCarritos = await cartManager.cargarCarritos();
    res.json(listaDeCarritos)
})

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito)
    } catch (error) {
        res.json({error: "Error interno del servidor"});
    }
})

//2) Listamos productos que pertenecen a un carrito determinado

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid

    try {
        const carrito = await cartManager.getCarritoById(cartId);
        res.json(carrito);
    } catch (error) {
        res.json("Error interno del servidor");
    }
})

//3) Agregar productos a distintos carritos: 

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1; 

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId,productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error al agregar el producto al carrito", error)
        res.status(500).json({error: "Error interno del servidor"});
    }

})

export default router; 