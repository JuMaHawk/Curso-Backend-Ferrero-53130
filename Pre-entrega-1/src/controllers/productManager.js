import { writeFileSync, existsSync, readFileSync } from "fs";
import { clearScreenDown } from "readline";


export default class ProductManager {
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
            writeFileSync(this.path, JSON.stringify(this.products, null, 2))
        }
        guardadoDeDatos();
    }

    getProducts() {
        if (existsSync(this.path)) {

            try {
                let productos = readFileSync(this.path, "utf-8");
                this.products = JSON.parse(productos);
                return this.products
            } catch (error) {
                console.log("[]");
            }
        } else {
            console.log("[]")
        }
    }


    getProductById(id) {

        const product = JSON.parse(readFileSync(this.path, "utf-8"));
        const busquedaDeProduct = product.find(item => item.id === id)
        if (!busquedaDeProduct) {
            console.log("No se encontro el producto buscado")
        } else {
            console.log("El producto buscado es el siguiente", busquedaDeProduct)
        }

    }

    updateProduct(id, propiedad, valor) {
        const product = JSON.parse(readFileSync(this.path, "utf-8"));
        const busquedaDeProduct = product.find(item => item.id === id)
        if (!busquedaDeProduct) {
            console.log("No se encontro el producto especificado.")
        } else {
            busquedaDeProduct[propiedad] = valor
            console.log(`El producto fue modificado con exito. \n`, busquedaDeProduct)
        }
    }

    deleteProduct(id) {
        const product = JSON.parse(readFileSync(this.path, "utf-8"));
        const busquedaDeProduct = product.findIndex(item => item.id === id)
        if (busquedaDeProduct === -1) {
            console.log(`No se encontro un producto con el id especificado`)
        } else {
            product.splice(busquedaDeProduct, 1)
            console.log(`Producto eliminado con exito! \n`, product)
            this.products = product
            writeFileSync(this.path, JSON.stringify(this.products,null, 2))
        }

    }
}


const manager = new ProductManager ("./src/productos.json")

manager.addProduct("Mountain bike", "Bicicleta diseñada para terrenos de montaña con suspensión delantera y trasera.", 550, "Sin imagen", "Sin imagen", "MTB001", 15)
manager.addProduct("Casco de ciclismo", "Casco ligero y aerodinámico para ciclistas que garantiza la máxima seguridad.", 45, "Sin imagen", "HELM002", 30)
manager.addProduct("Guantes de ciclismo", "Guantes acolchados para mayor comodidad y protección durante el pedaleo.", 25, "Sin imagen", "GLOV003", 25)
manager.addProduct("Candado para bicicleta", "Candado resistente y duradero para mantener tu bicicleta segura en todo momento.", 20, "Sin imagen", "LOCK004", 40)
manager.addProduct("Faros LED para bicicleta", "Faros delanteros y traseros de alta potencia para una visibilidad óptima en la oscuridad.", 35, "Sin imagen", "LITE005", 20)
manager.addProduct("Portabultos trasero", "Portabultos de aluminio ajustable para transportar carga en tu bicicleta de forma segura.", 30, "Sin imagen", "RACK006", 10)
manager.addProduct( "Pedales automáticos", "Pedales automáticos para una conexión segura y eficiente entre tus zapatos y la bicicleta.", 60, "Sin imagen", "PEDL007", 15)
manager.addProduct( "Kit de herramientas para bicicleta", "Kit completo de herramientas esenciales para el mantenimiento y reparación de bicicletas.", 50, "Sin imagen", "TOOL008", 20)
manager.addProduct( "Maillot de ciclismo", "Maillot transpirable y ajustado para un rendimiento óptimo en cada salida en bicicleta.", 40, "Sin imagen", "JER009", 25)
manager.addProduct( "Llantas de bicicleta de carretera", "Llantas ligeras y resistentes diseñadas para rodar rápido y con estabilidad en carreteras.", 100, "Sin imagen", "RIM010", 12)
   