import express, { urlencoded } from "express";
import exphds from "express-handlebars"
import { Server } from "socket.io";
import productosRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js"
import ProductManager from "./controllers/productManager.js";
import mongoose from "mongoose"

const app = express()
const PUERTO = 8080;

const manager = new ProductManager("./src/models/productos.json")

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));


//CONFIGURACION DE HANDLEBARS.
app.engine("handlebars", exphds.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


// RUTAS
app.use("/api", productosRouter);

app.use("/api", cartsRouter);

app.use("/", viewsRouter);

app.get(("/realtimeproducts"), (req, res) => {
    res.render("realTimeProducts")
})

app.get("/", (req, res) => {
    res.render("home")
})




//INICIANDO SERVIDOR.
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en http://localhost:${PUERTO}`)
})

//INICIANDO SERVER CON WEBSOCKET.
const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("un cliente conectado");
    
    socket.emit("productos", await manager.getProducts())
    
    socket.on("eliminarProducto", async (id) => {
        await manager.deleteProduct(id);
        socket.emit("productos", await manager.getProducts())
    })

    socket.on("agregarProducto", async (producto) => {
        await manager.addProduct(producto)
        socket.emit("productos", await manager.getProducts())
    }
)

})

mongoose.connect("mongodb+srv://jmferrero:JuMaHawk@cluster0.jk1wtsh.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
.then(() =>  console.log("Conectados a la base de datos!"))
.catch((error) => console.log("Tenemos un error", error))