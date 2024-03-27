import { promises as fs } from "fs";
import { clearScreenDown } from "readline";


export default class ProductManager {
    static ultimoId = 10;
    constructor(path) {
        this.path = path
        this.products = []
    }


    //CREO EL METODO ADDPRODUCT Y HAGO LAS VALIDACIONES PEDIDAS EN LA CONSIGNA.
    async addProduct({ title, description, code, price, stock, category, thumbnail }) {

        try {
            const nuevosDatos = await this.leerDatos();

            //VALIDO QUE SE ENVIEN TODOS LOS CAMPOS.    
            if (!title || !description || !code || !price || !stock || !category) {
                console.log("Por favor complete todos los campos")
                return;
            }

            //VALIDO QUE EL CODE DEL NUEVO PRODUCTO NO SE REPITA CON OTRO EXISTENTE.
            if (nuevosDatos.some(item => item.code === code)) {
                console.log("No se pueden ingresar dos productos con el mismo codigo")
                return;
            }

            //INSTANCIO UN NUEVO PRODUCTO
            const newProduct = {
                id: ++ProductManager.ultimoId,
                title,
                description,
                code,
                price,
                status: true,
                stock,
                category,
                thumbnail: thumbnail || []
            };

            //AGREGO EL PRODUCTO INSTANCIADO AL ARRAY DE PRODUCTOS
            nuevosDatos.push(newProduct)
            await this.guardarDatos(nuevosDatos)


        } catch (error) {
            console.log("Error al intentar guardar los datos")
        }

    }

    async getProducts() {
        try {
            const nuevosDatos = await this.leerDatos();
            return nuevosDatos

        } catch (error) {
            console.log("Error al leer los datos");
        }
    }


    async getProductById(id) {

        const product = JSON.parse(await readFileSync(this.path, "utf-8"));
        const busquedaDeProduct = product.find(item => item.id === id)
        if (!busquedaDeProduct) {
            console.log("No se encontro el producto buscado")
        } else {
            console.log("El producto buscado es el siguiente", busquedaDeProduct)
        }

    }

    async updateProduct(id, propiedad, valor) {

        const product = JSON.parse(await fs.readFile(this.path, "utf-8"));
        const busquedaDeProduct = product.find(item => item.id === id)

        if (!busquedaDeProduct) {
            console.log("No se encontro el producto especificado.")

        } else {
            busquedaDeProduct[propiedad] = valor
            console.log(`El producto fue modificado con exito. \n`, busquedaDeProduct)
        }
    }

    async deleteProduct(id) {
        try {
            const product = await this.leerDatos();
            const indice = product.findIndex(item => item.id === id)
            if (indice !== -1) {
                product.splice(indice, 1)
                await this.guardarDatos(product)
                // await fs.writeFile(this.path, JSON.stringify(product, null, 2))
                console.log(`Producto eliminado con exito! \n`, product)

            } else {
                console.log(`No se encontro un producto con el id especificado`)
            }

        } catch (error) {
            console.log("Error al intentar eliminar el producto")
        }
    }

    async guardarDatos(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2))
        } catch (error) {
            console.log("Error al guardar el archivo")
            throw error;
        }
    }


    async leerDatos() {
        try {
            const nuevosDatos = JSON.parse(await fs.readFile(this.path, "utf-8"));
            return nuevosDatos;
        } catch (error) {
            console.log("Error al leer el archivo")
            throw error;
        }
    }


}


const manager = new ProductManager("./src/models/productos.json")

// manager.addProduct("Mountain bike", "Bicicleta diseñada para terrenos de montaña con suspensión delantera y trasera.", 550, "Sin imagen", "Sin imagen", "MTB001", 15)
// manager.addProduct("Casco de ciclismo", "Casco ligero y aerodinámico para ciclistas que garantiza la máxima seguridad.", 45, "Sin imagen", "HELM002", 30)
// manager.addProduct("Guantes de ciclismo", "Guantes acolchados para mayor comodidad y protección durante el pedaleo.", 25, "Sin imagen", "GLOV003", 25)
// manager.addProduct("Candado para bicicleta", "Candado resistente y duradero para mantener tu bicicleta segura en todo momento.", 20, "Sin imagen", "LOCK004", 40)
// manager.addProduct("Faros LED para bicicleta", "Faros delanteros y traseros de alta potencia para una visibilidad óptima en la oscuridad.", 35, "Sin imagen", "LITE005", 20)
// manager.addProduct("Portabultos trasero", "Portabultos de aluminio ajustable para transportar carga en tu bicicleta de forma segura.", 30, "Sin imagen", "RACK006", 10)
// manager.addProduct("Pedales automáticos", "Pedales automáticos para una conexión segura y eficiente entre tus zapatos y la bicicleta.", 60, "Sin imagen", "PEDL007", 15)
// manager.addProduct("Kit de herramientas para bicicleta", "Kit completo de herramientas esenciales para el mantenimiento y reparación de bicicletas.", 50, "Sin imagen", "TOOL008", 20)
// manager.addProduct("Maillot de ciclismo", "Maillot transpirable y ajustado para un rendimiento óptimo en cada salida en bicicleta.", 40, "Sin imagen", "JER009", 25)
// manager.addProduct("Llantas de bicicleta de carretera", "Llantas ligeras y resistentes diseñadas para rodar rápido y con estabilidad en carreteras.", 100, "Sin imagen", "RIM010", 12)

console.log(manager.deleteProduct(3))