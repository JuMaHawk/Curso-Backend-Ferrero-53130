import ProductsModel from "../models/products.model.js";

class ProductsRepository {

    //BUSCAR EL/LOS PRODUCTOS SEGUN QUERY PARAMS.
    async traerProductos({ limit = 10, page = 1, sort, query } = {}) {
        try {

            let queryOptions = {};
            if (query) {
                queryOptions = { category: query };
            };

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                };
            }
            const skip = (page - 1) * limit

            const productos = await ProductsModel
                .find(queryOptions).lean()
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);
            return productos;
        } catch (error) {
            throw new Error("Error al intentar obtener los productos.");
        }

    }

    //BUSCAR UN PRODUCTO POR SU ID.
    async getProductById(productId) {
        try {
            const producto = await ProductsModel.findById(productId)
            console.log(producto)
            if (!producto) return res.send("El producto no existe");
            console.log(producto);
            return producto;

        } catch (error) {
            throw new Error("Error al intentar obtener el producto.");
        }
    }


    //AGREGAR PRODUCTO A LA LISTA.
    async addProduct({ title, description, code, price, stock, category, thumbnail }) {
        console.log(title)

        const existeProducto = await ProductsModel.findOne({ code: code })
        if (existeProducto) {
            console.log("El codigo de este producto ya fue utilizado, por favor ingrese uno nuevo.")
            // return;
        }

        //CREO UN NUEVO PRODUCTO
        const newProduct = new ProductsModel({
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnail: thumbnail || []
        });

        await newProduct.save();
        return newProduct

    }


    async updateProduct(id, actualizacion) {
        console.log(id)
        console.log(actualizacion)
        try {
            const productoActualizado = await ProductsModel.findByIdAndUpdate(id, actualizacion);
            console.log("Producto actualizado correctamente")
            return productoActualizado;
        } catch (error) {
            console.log("Error interno del servidor")
        }
    }

    async deleteProduct(id) {
        const borrarProducto = await ProductsModel.findByIdAndDelete(id)
        if (!borrarProducto) {
            console.log(`No se encontro un producto con el id especificado`)
            return null;
        } else {
            console.log(`El siguiente producto fue eliminado con exito! \n`, borrarProducto)
            return borrarProducto;
        }
    }
}

export default ProductsRepository