import ProductsRepository from "../repositories/products.repository.js";
import ProductsModel from "../models/products.model.js";

const productsRepository = new ProductsRepository();

class ProductManager {

    //RUTA PARA TRAER TODOS LOS PRODUCTOS O SOLO LA CANT INDICADA EN LA QUERY LIMIT.
    async getProducts(req, res) {

        const { limit = 10, page = 1, sort, query } = req.query;

        try {
            const productos = await productsRepository.traerProductos({
                limit: parseInt(limit),
                page: parseInt(page),
                sort,
                query,
            });

            const totalProducts = productos.length;
            console.log(totalProducts)
            const totalPages = Math.ceil(totalProducts / limit)
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
            
            res.send( {
                docs: productos,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            });
        } catch (error) {
            console.log("Error al obtener los productos", error);
            throw error;
        }
    }


    //AGREGAR UN NUEVO PRODUCTO.

    async addProduct(req, res) {
        const { title, description, code, price, stock, category } = req.body
        try {

            // VALIDO QUE SE ENVIEN TODOS LOS CAMPOS.    
            if (!title || !description || !code || !price || !stock || !category) {
                console.log("Por favor complete todos los campos")
                return;
            }
            const producto = await productsRepository.addProduct(req.body);
            res.send(producto)

        } catch (error) {
            res.send("Error al intentar guardar los datos")
        }
    }


    //BUSCAR UN PRODUCTO SEGUN SU ID.
    async getProductById(req, res) {
        let productId = req.params.id;
        console.log(productId)

        try {
            const producto = await productsRepository.getProductById(productId)
            if (!producto) {
                console.log("No se encontro el producto buscado")
                return null;
            } else {
                console.log("El producto buscado es el siguiente", producto)
                res.send(producto);
            }
        } catch (error) {
            console.log("Error al buscar producto por ID", error)
            throw error;
        }
    }


    async updateProduct(req, res) {
        const id = req.params.pid;
        const modificacion = req.body;

        try {
            const productoModificado = await productsRepository.updateProduct(id, modificacion);
            // console.log(`El producto fue modificado con exito. \n`, modificacion)
            res.send(productoModificado)

        } catch (error) {
            res.send("Error al modificar el producto", error);
            throw error;
        }
    }

    //ELIMINAR PRODUCTO
    async deleteProduct(req, res) {
        const id = req.params.pid;
        try {
            const productoEliminado = await ProductsModel.findByIdAndDelete(id);
            res.send("El producto fue eliminado con exito")

        } catch (error) {
            console.log("Error al intentar eliminar el producto")
        }
    }
}

export default ProductManager;