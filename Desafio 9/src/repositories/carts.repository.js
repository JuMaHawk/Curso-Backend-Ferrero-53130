import CartModel from "../models/carts.model.js";

class CartsRepository {

    //CREAR UN NUEVO CARRITO
    async createNewCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            throw new Error("Error al crear el carrito.");
        }
    }


    //LISTAR TODOS LOS CARRITOS.
    async getCarts() {
        try {
            const carts = await CartModel.find();
            if (carts.length > 0) {
                return carts;
            } else {
                console.log("Aun no se ah creado ningun carrito")
            }
        } catch (error) {
            throw new Error("Error al intentar buscar los carritos.");
        }
    }

    //LISTAR PRODUCTOS DE UN CARRITO ESPECIFICO.
    async getCarritoById(cartId) {
        try {
            const cart = await CartModel.findById(cartId).populate("products.products");
            return cart

        } catch (error) {
            console.log("Error al obtener el carrito con el ID especificado: ", error);
        }
    }

    //AGREGAR UN PRODUCTO A UN CARRITO ESPECIFICO.
    async updateProductCart(cartId, productId, quantity) {
        const carrito = await this.getCarritoById(cartId);
        const existeProducto = carrito.products.find(p => p.products.toString() === productId);
        try {


            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ products: productId, quantity });
            }

            carrito.markModified("products")

            await carrito.save();

            return carrito;

        } catch (error) {

            console.log("Error al intentar agregar el producto al carrito: ", error);
        }
    }

    //ELIMINAR UN PRODUCTO DEL CARRITO
    async deleteProductToCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error("Carrito no encontrado")
            }

            cart.products = cart.products.filter(item => item.products._id.toString() !== productId)

            await cart.save();
            return cart;

        } catch (error) {
            console.log("Error al intentar eliminar el producto del carrito: ", error);
        }
    }


    //ACTUALIZAR PRODUCTOS DE UN CARRITO A TRAVES DE UN ARREGLO.
    async updatedQuantityToProduct(cartId, updatedProducts) {
        try {
            const cart = this.getCarritoById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            cart.products = updatedProducts;
            cart.markModified("products")
            await cart.save();
            return cart;

        } catch (error) {

        }
    }

    //ACTUALIZAR LA CANTIDAD DE UN PRODUCTO DEL CARRITO.
    async updateAmountProductByCart(cartId, productId, newQuantity) {
        try {
            const cart = await this.getCarritoById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            console.log(cart)
            const productIndex = cart.products.findIndex(item => item._id.toString() === productId);
            console.log(newQuantity)
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;

                cart.markModified("products");
                console.log(cart)
                await cart.save();
                return cart;

            }
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito", error);
            throw error;
        }

    }


    //VACIAR CARRITO.
    async deleteProductsByCart(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true })

            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            return cart;

        } catch (error) {
            console.error("Error al vaciar el carrito en el gestor", error);
            throw error;
        }

    }

}


export default CartsRepository;