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


    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {

            const skip = (page - 1) * limit;

            let queryOptions = {};
            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                    console.log(sortOptions)
                }
            }

            const productos = await ProductsModel
                .find(queryOptions).lean()
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductsModel.countDocuments(queryOptions);
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: productos,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log("Error al obtener los productos", error);
            throw error;
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

