const fs = require("fs");
const { clearScreenDown } = require("readline");


class ProductManager {
    static ultimoId = 0;
    constructor(path) {
        this.path = path
        this.products = []
    }


    //CREO EL METODO ADDPRODUCT Y HAGO LAS VALIDACIONES PEDIDAS EN LA CONSIGNA.
    addProduct(title, description, price, thumbnail, code, stock) {

        //VALIDO QUE SE ENVIEN TODOS LOS CAMPOS.    
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Por favor complete todos los campos")
            return;
        }

        //VALIDO QUE EL CODE DEL NUEVO PRODUCTO NO SE REPITA CON OTRO EXISTENTE.
        if (this.products.some(item => item.code === code)) {
            console.log("No se pueden ingresar dos productos con el mismo codigo")
            return;
        }

        //INSTANCIO UN NUEVO PRODUCTO
        const newProduct = {
            id: ++ProductManager.ultimoId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        //AGREGO EL PRODUCTO INSTANCIADO AL ARRAY DE PRODUCTOS
        this.products.push(newProduct)

        //GUARDO LOS PRODUCTOS DEL ARRAY EN UN JSON
        const guardadoDeDatos = () => {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2))
        }
        guardadoDeDatos();
    }

    getProducts() {

        if (fs.existsSync(this.path)) {

            try {
                let productos = fs.readFileSync(this.path, "utf-8");
                this.products = JSON.parse(productos);
                console.log(this.products)
            } catch (error) {
                console.log("[]");
            }
        } else {
            console.log([])
        }
    }


    getProductById(id) {

        const product = JSON.parse(fs.readFileSync(this.path, "utf-8"));
        const busquedaDeProduct = product.find(item => item.id === id)
        if (!busquedaDeProduct) {
            console.log("No se encontro el producto buscado")
        } else {
            console.log("El producto buscado es el siguiente", busquedaDeProduct)
        }

    }

    updateProduct(id, propiedad, valor) {
        const product = JSON.parse(fs.readFileSync(this.path, "utf-8"));
        const busquedaDeProduct = product.find(item => item.id === id)
        if (!busquedaDeProduct) {
            console.log("No se encontro el producto especificado.")
        } else {
            busquedaDeProduct[propiedad] = valor
            console.log(`El producto fue modificado con exito. \n`, busquedaDeProduct)
        }
    }

    deleteProduct(id) {
        const product = JSON.parse(fs.readFileSync(this.path, "utf-8"));
        const busquedaDeProduct = product.findIndex(item => item.id === id)
        if (busquedaDeProduct === -1) {
            console.log(`No se encontro un producto con el id especificado`)
        } else {
            product.splice(busquedaDeProduct, 1)
            console.log(`Producto eliminado con exito! \n`, product)
            this.products = product
            fs.writeFileSync(this.path, JSON.stringify(this.products,null, 2))
        }

    }
}



// TESTING


// 1) Se creará una instancia de la clase “ProductManager”
console.log("Paso 1")
const manager = new ProductManager("./datosGuardados.json");



// 2) Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
console.log("Paso 2")
manager.getProducts();


/**  3) Se llamará al método “addProduct” con los campos:
            title: “producto prueba”
            description:”Este es un producto prueba”
            price:200,
            thumbnail:”Sin imagen”
            code:”abc123”,
            stock:25
**/
console.log("Paso 3")
manager.addProduct("Producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)


// 4) El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
console.log("Paso 4")
manager.addProduct("Producto prueba dos", "Este es un segundo producto prueba", 200, "Sin imagen", "abc456", 25)


// 5.1) Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
console.log("Paso 5.1")
manager.getProducts();


// 5.2) Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.
console.log("Paso 5.2")
manager.addProduct("Producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)


// 6.1) Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
console.log("Paso 6.1")
manager.getProductById(1)

// 6.2) Se llamará al método “getProductById” en este caso con un id inexistente para corroborar que devuelve un error.
console.log("Paso 6.2")
manager.getProductById(50)


// 7) Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.

console.log("Paso 7");
manager.updateProduct(1, "price", 999);

// 9.1) Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
console.log("Paso 9.1");
manager.deleteProduct(2);

// 9.2) Se llamará al método “deleteProduct”, se evaluará que arroje un error en caso de no existir el producto con el id especificado.
console.log("Paso 9.2");
manager.deleteProduct(8);