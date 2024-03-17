const fs = require("fs");

class ProductManager {
    static ultimoId = 0;
    constructor() {
        this.products = []
        this.path = "./datos.json"
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Por favor complete todos los campos")
            return;
        }

        if (this.products.some(item => item.code === code)) {
            console.log("No se pueden ingresar dos productos con el mismo codigo")
            return;
        }

        const newProduct = {
            id: ++ProductManager.ultimoId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        this.products.push(newProduct)

        // const guardadoDeDatos = async () => {
        //     await fs.promises.writeFile(this.path, JSON.stringify(this.product))
        // }
        // guardadoDeDatos();
    }

    getProducts() {

        return this.products
    }

    getProductById(id) {

        const product = this.products.find(item => item.id === id)

        if (!product) {
            console.log("No se encontro el producto buscado")
        } else {
            console.log("El producto buscado es el siguiente", product)
        }
    }
}



// TESTING


// 1) Se creará una instancia de la clase “ProductManager”

const manager = new ProductManager();


// 2) Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []

console.log(manager.getProducts());

/**  3) Se llamará al método “addProduct” con los campos:
            title: “producto prueba”
            description:”Este es un producto prueba”
            price:200,
            thumbnail:”Sin imagen”
            code:”abc123”,
            stock:25
**/

manager.addProduct("Producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)

// 4) El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE

manager.addProduct("Producto prueba dos", "Este es un segundo producto prueba", 200, "Sin imagen", "abc456", 25)

// 5) Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado

console.log(manager.getProducts())

// 6) Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.

manager.addProduct("Producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)

// 7) Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo

manager.getProductById(1)
manager.getProductById(50)