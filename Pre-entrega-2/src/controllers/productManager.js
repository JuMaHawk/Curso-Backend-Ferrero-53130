import ProductsModel from "../models/products.model.js";


export default class ProductManager {


    //CREO EL METODO ADDPRODUCT Y HAGO LAS VALIDACIONES PEDIDAS EN LA CONSIGNA.
    async addProduct({ title, description, code, price, stock, category, thumbnail }) {

        try {

            //VALIDO QUE SE ENVIEN TODOS LOS CAMPOS.    
            if (!title || !description || !code || !price || !stock || !category) {
                console.log("Por favor complete todos los campos")
                return;
            }

            //VALIDO QUE EL CODE DEL NUEVO PRODUCTO NO SE REPITA
            const productoYaExistente = await ProductsModel.findOne({ code: code })
            if (productoYaExistente) {
                console.log("El codigo de este producto ya fue utilizado, por favor ingrese uno nuevo.")
                return;
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


        } catch (error) {
            console.log("Error al intentar guardar los datos")
        }

    }

    async getProducts() {
        try {
            const nuevosDatos = await ProductsModel.find().lean();
            return nuevosDatos
        } catch (error) {
            console.log("Error al leer los datos");
        }
    }


    async getProductNew(query, limit, page, sort) {
        if (!limit) {
            limit = 10;
        }
        if (!page) {
            page = 1;
        }
        if (!query) {
            query = {};
        }
        if(!sort){
            sort = {};
        }
        console.log(sort)
        try {
            const productos = await ProductsModel.paginate({ category: query }, { page: page, limit: limit})
            console.log(productos)

            // const productosOrdenados = productos.docs
            // .aggregate([
            //     {
            //     $sort : {price : sort}
            // }])
            console.log(productosOrdenados)

            return productosOrdenados

        } catch (error) {
            console.log("Error al leer los datos de la categoria");
        }
    }


    async getProductById(id) {
        try {
            const busquedaDeProduct = await ProductsModel.findById(id)
            if (!busquedaDeProduct) {
                console.log("No se encontro el producto buscado")
                return null;
            } else {
                console.log("El producto buscado es el siguiente", busquedaDeProduct)
                return busquedaDeProduct
            }

        } catch (error) {
            console.log("Error al buscar producto por ID", error)
            throw error;
        }
    }

    async updateProduct(id, modificacion) {
        try {
            const productoModificado = await ProductsModel.findByIdAndUpdate(id, modificacion);
            console.log(`El producto fue modificado con exito. \n`, modificacion)

        } catch (error) {
            console.log("Error al modificar el producto", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const productoEliminado = await ProductsModel.findByIdAndDelete(id);
            if (!productoEliminado) {
                console.log(`No se encontro un producto con el id especificado`)
                return null;
            } else {
                console.log(`El siguiente producto fue eliminado con exito! \n`, productoEliminado)
            }

        } catch (error) {
            console.log("Error al intentar eliminar el producto")
        }
    }

}

