import express from "express"
import ProductManager from "./productManager.js"

const PUERTO = 8080;
const app = express();

app.use(express.urlencoded({ extended: true }));

//Instancio la clase importada de "productManager.js"
const manager = new ProductManager("./src/productos.json")




const todosProductos=[
    {
      "id": 1,
      "title": "Mountain bike",
      "description": "Bicicleta diseñada para terrenos de montaña con suspensión delantera y trasera.",
      "price": 550,
      "thumbnail": "Sin imagen",
      "code": "Sin imagen",
      "stock": "MTB001"
    },
    {
      "id": 2,
      "title": "Casco de ciclismo",
      "description": "Casco ligero y aerodinámico para ciclistas que garantiza la máxima seguridad.",
      "price": 45,
      "thumbnail": "Sin imagen",
      "code": "HELM002",
      "stock": 30
    },
    {
      "id": 3,
      "title": "Guantes de ciclismo",
      "description": "Guantes acolchados para mayor comodidad y protección durante el pedaleo.",
      "price": 25,
      "thumbnail": "Sin imagen",
      "code": "GLOV003",
      "stock": 25
    },
    {
      "id": 4,
      "title": "Candado para bicicleta",
      "description": "Candado resistente y duradero para mantener tu bicicleta segura en todo momento.",
      "price": 20,
      "thumbnail": "Sin imagen",
      "code": "LOCK004",
      "stock": 40
    },
    {
      "id": 5,
      "title": "Faros LED para bicicleta",
      "description": "Faros delanteros y traseros de alta potencia para una visibilidad óptima en la oscuridad.",
      "price": 35,
      "thumbnail": "Sin imagen",
      "code": "LITE005",
      "stock": 20
    },
    {
      "id": 6,
      "title": "Portabultos trasero",
      "description": "Portabultos de aluminio ajustable para transportar carga en tu bicicleta de forma segura.",
      "price": 30,
      "thumbnail": "Sin imagen",
      "code": "RACK006",
      "stock": 10
    },
    {
      "id": 7,
      "title": "Pedales automáticos",
      "description": "Pedales automáticos para una conexión segura y eficiente entre tus zapatos y la bicicleta.",
      "price": 60,
      "thumbnail": "Sin imagen",
      "code": "PEDL007",
      "stock": 15
    },
    {
      "id": 8,
      "title": "Kit de herramientas para bicicleta",
      "description": "Kit completo de herramientas esenciales para el mantenimiento y reparación de bicicletas.",
      "price": 50,
      "thumbnail": "Sin imagen",
      "code": "TOOL008",
      "stock": 20
    },
    {
      "id": 9,
      "title": "Maillot de ciclismo",
      "description": "Maillot transpirable y ajustado para un rendimiento óptimo en cada salida en bicicleta.",
      "price": 40,
      "thumbnail": "Sin imagen",
      "code": "JER009",
      "stock": 25
    },
    {
      "id": 10,
      "title": "Llantas de bicicleta de carretera",
      "description": "Llantas ligeras y resistentes diseñadas para rodar rápido y con estabilidad en carreteras.",
      "price": 100,
      "thumbnail": "Sin imagen",
      "code": "RIM010",
      "stock": 12
    }
  ]



app.get("/productos", (req, res) => {
    let limit = parseInt(req.query.limit);
    // let todosProductos = manager.getProducts(); // Llamada sincrónica
    if (!limit) return res.send(todosProductos);
    let prodConLimite = todosProductos.slice(0, limit);
    res.send(prodConLimite);
});

// app.get("/productos",(req, res) => {
//     let limit = parseInt(req.query.limit)
//     res.send(limit)
//     })











// app.get("/productos/:id", (req, res) => {
//     let id = req.params.id;
//     let producto = misProductos.find(item => item.id == id)

//     if (producto) {
//         res.send(producto)
//     } else {
//         res.send("No se encontro el producto buscado")
//     }
// })

// app.get("/cliente", (req, res) => {
//     let nombre = req.query.nombre
//     let apellido = req.query.apellido
//     let {nombre, apellido} = req.query;
//     res.send(`Bienvenido ${nombre} ${apellido}`)
// })


//Inicio el servidor.
app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`)
})