import express from "express";
import CartManager from "../controllers/cartManager.js";

const router = express.Router(); 
const cartManager = new CartManager();


// CARGAR UN CARRITO.
router.get("/", async (req, res) => {
    const listaDeCarritos = await cartManager.cargarCarritos();
    res.json(listaDeCarritos)
})


//CREAR UN NUEVO CARRITO.
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito)
    } catch (error) {
        console.error("Error al crear el nuevo carrito", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
});


//LISTAR PRODUCTOS DE UN CARRITO DETERMINADO
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid

    try {
        const carrito = await cartManager.getCarritoById(cartId);
        if(!carrito){
            console.log("No existe un carrito con el ID especificado")
            return res.status(404).json({error: "Carrito no encontrado"})
        }
        return res.json(carrito.products)
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({error: "Error interno del servidor" });
    }
})


// AGREGAR PRODUCTOS A DISTINTOS CARRITOS.
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1; 

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error al agregar el producto al carrito", error)
        res.status(500).json({error: "Error interno del servidor"});
    }

});

//ELIMINAR UN PRODUCTO DE UN CARRITO.
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        let cartId = req.params.cid
        let productId = req.params.pid
        
        const updatedCart = await cartManager.eliminarProductoDelCarrito(cartId, productId);

        res.json({
            status: "success",
            message: "Producto eliminado del carrito",
            updatedCart
        });

    } catch (error) {
        console.error("Error al agregar el producto al carrito", error)
        res.status(500).json({
            status: "Error",
            error: "Error interno del servidor"});
    }
});


//ACTUALIZAR PRODUCTO DEL CARRITO.
router.put("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;
    try {
        const updatedCart = await cartManager.actualizarCarrito(cartId, updatedProducts);
        res.json(updatedCart);
    } catch (error) {
        console.error("Error al actualizar el carrito", error);
        res.status(500).json({
            status : "error",
            error: "Error interno del servidor",
        });
    }
});


//ACTUALIZAR LAS CANTIDADES DE PRODUCTOS.
router.put("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const updatedCart = await cartManager.actualizarCantidadDeProducto(cartId, productId, newQuantity)



        res.json({
            status: "success",
            message: "Cantidad del producto actualizada correctamente",
            updatedCart
        });
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto en el carrito", error);
        res.status(500).json({
            status: "error",
            error: "Error interno del servidor"
        });
    }
});


//VACIAR EL CARRITO.
router.delete("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;

        const updatedCart = await cartManager.vaciarCarritos(cartId);

        res.json({
            status: "success",
            message: "Todos los productos del carrito fueron eliminados",
            updatedCart
        });
    } catch (error) {
        console.error("Error al vaciar el carrito", error);
        res.status(500).json({
            status: "Error",
            error: "Error interno del servidor"
        });
    }    
});

export default router; 