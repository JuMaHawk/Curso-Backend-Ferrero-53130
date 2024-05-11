import CartModel from "../models/carts.model.js";

export default class CartManager {


    //CREAR UN CARRITO
    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.log("Error al crear el nuevo carrito.", error)
            throw error;
        }
    }


    //BUSCAR UN CARRITO POR ID.
    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId).populate("products.products");

            if (!carrito) {
                console.log("No existe carrito con ese id");
                return null;
            }

            return carrito
        } catch (error) {
            console.log("Error al obtener el carrito con el ID especificado: ", error);
        }
    }


    //AGREGARLE UN PRODUCTO A UN CARRITO ESPECIFICO.
    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            const carrito = await CartModel.findById(cartId);
        
            const existeProducto = carrito.products.find(p => p.products.toString() === productId);

            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ products: productId, quantity });
            }

            carrito.markModified("products")

            await carrito.save();
            return carrito;

        } catch (error) {
            console.log("Error al querer agregar el producto", error)
            throw error;
        }
    }


    //ELIMINAR UN PRODUCTO DENTRO DE UN CARRITO
    async eliminarProductoDelCarrito(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error("Carrito no encontrado")
            }

            cart.products = cart.products.filter(item => item.products._id.toString() !== productId)

            await cart.save();
            return cart;

        } catch (error) {
            console.error('Error al eliminar el producto del carrito en el gestor', error);
            throw error;
        }
    }


    //ACTUALIZAR PRODUCTOS DE UN CARRITO A TRAVES DE UN ARREGLO.
    async actualizarCarrito(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            cart.products = updatedProducts;
            cart.markModified("products")
            await cart.save();
            return cart;

        } catch (error) {
            console.error('Error al actualizar el carrito en el gestor', error);
            throw error;
        }
    }

// ACTUALIZAR CANTIDAD DE PRODUCTOS.
    async actualizarCantidadDeProducto(cartId, productId, newQuantity){
        try {
            const cart = await CartModel.findById(cartId)

            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            
            const productIndex = cart.products.findIndex(item => item._id.toString() === productId);

            if(productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;

                cart.markModified("products");

                await cart.save();
                return cart;
            }else {
                throw new Error("Producto no encontrado en el carrito");
            }
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito", error);
        throw error;
        }
    }


    //VACIAR CARRITO.
    async vaciarCarritos(cartId){
    try {
        const cart = await CartModel.findByIdAndUpdate(cartId, {products: [] }, {new: true})

        if(!cart) {
            throw new Error("Carrito no encontrado");
        }

        return cart;
        
    } catch (error) {
        console.error("Error al vaciar el carrito en el gestor", error);
        throw error; 
    }
}


    //CARGAR TODOS LOS CARRITOS.
    async cargarCarritos() {
        try {
            const data = await CartModel.find();
            if (data.length > 0) {
                return data;
            } else {
                console.log("Aun no se ah creado ningun carrito")
            }
        } catch (error) {
            console.log("Error al crear los carritos: ", error);
        }
    }


}
