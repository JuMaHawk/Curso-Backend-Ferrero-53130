import CartModel from "../models/carts.model.js";

export default class CartManager {

    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({products : []});
            await nuevoCarrito.save();
            return nuevoCarrito;           
        } catch (error) {
            console.log("Error al crear el carrito nuevo", error)
            throw error;   
        }
    }

    async cargarCarritos() {
        try {
            const data = await CartModel.find();
            if (data.length > 0) {
                return data;
            }else{
                console.log("Aun no se ah creado ningun carrito")
            }
        } catch (error) {
            console.log("Error al crear los carritos: ", error);
        }
    }

    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId);

            if (!carrito) {
                console.log("No hay carrito con ese id");
                return;
            }
        } catch (error) {
            console.log("Error al obtener un carrito por id: ", error);
        }
    }

    async agregarProductoAlCarrito(carritoId, productoId, quantity = 1) {
        try {
            const carrito = await CartModel.findById(carritoId);
            const existeProducto = carrito.products.find(p => p.products.toString() === productoId);
    
            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ products: productoId, quantity });
            }
            
            carrito.markModified("products")

            await carrito.save();
            return carrito;
            
        } catch (error) {
            console.log("Error al querer agregar el producto", error)
            throw error;
        }
    }
}

