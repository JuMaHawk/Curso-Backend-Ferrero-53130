import CartsRepository from "../repositories/carts.repository.js";

const cartsRepository = new CartsRepository()

class CartManager {

    //CREAR UN CARRITO
    async crearnuevocarrito(req, res) {
        try {
            const newCart = await cartsRepository.createNewCart();
            res.json( newCart);
        } catch (error) {
            console.log("Error al crear el nuevo carrito.", error)
            throw error;
        }
    }


    //CARGAR TODOS LOS CARRITOS.
    async getCarts(req, res) {
        try {
            const carts = await cartsRepository.getCarts();
            res.send(carts)
        } catch (error) {
            console.log("Error al crear los carritos: ", error);
        }
    }


    //LISTAR PRODUCTOS DE UN CARRITO ESPECIFICO POR SU ID.
    async getCarritoById(req, res) {
        let cartId = req.params.cid
        console.log(cartId)
        try {
            const carrito = await cartsRepository.getCarritoById(cartId)

            if (!carrito) {
                console.log("No existe carrito con ese id");
                return null;
            }

            res.send(carrito)
        } catch (error) {
            console.log("Error al obtener el carrito con el ID especificado: ", error);
        }
    }


    //AGREGARLE UN PRODUCTO A UN CARRITO ESPECIFICO.
    async addProductCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            const carrito = await cartsRepository.updateProductCart(cartId, productId, quantity);

            res.send(carrito)

        } catch (error) {
            console.log("Error al querer agregar el producto", error)
            throw error;
        }
    }



    //ELIMINAR UN PRODUCTO DENTRO DE UN CARRITO
    async deleteProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const updatedCart = await cartsRepository.deleteProductToCart(cartId, productId);
            return updatedCart;
        } catch (error) {
            console.error('Error al eliminar el producto del carrito en el gestor', error);
            throw error;
        }
    }

    //ACTUALIZAR PRODUCTOS DE UN CARRITO A TRAVES DE UN ARREGLO.
    async updateCart(req, res) {
        const cartId = req.params.cid
        const updatedProducts = req.body;
        try {
            const cart = await cartsRepository.updatedQuantityToProduct(cartId, updatedProducts);


        } catch (error) {
            console.error('Error al actualizar el carrito en el gestor', error);
            throw error;
        }
    }




    //ACTUALIZAR LAS CANTIDADES DE PRODUCTOS.
    async updateAmountProductByCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const newQuantity = req.body.quantity;
            
            const updatedCart = await cartsRepository.updateAmountProductByCart(cartId, productId, newQuantity)
            res.send(updatedCart)

        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito", error);
            res.status(500).json({
                status: "error",
                error: "Error interno del servidor"
            })
        }
    }


    //VACIAR CARRITO.
    async deleteProductsByCart(req, res) {
try{
        const cartId = req.params.cid;

        const updatedCart = await cartsRepository.deleteProductsByCart(cartId);

        res.send(updatedCart)
    } catch(error) {
        console.error("Error al vaciar el carrito", error);
        res.status(500).json({
            status: "Error",
            error: "Error interno del servidor"
        });
    }
}
}

export default CartManager;



