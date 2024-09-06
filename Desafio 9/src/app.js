import express, { urlencoded } from "express";
import exphds from "express-handlebars"
import { Server } from "socket.io";
import MessagesModel from "./models/messages.model.js";
import cookieParser from "cookie-parser";
import ProductManager from "./controllers/productController.js";
import viewsRouter from "./routes/views.router.js"
import cartsRouter from "./routes/carts.router.js"
import usersRouter from "./routes/users.router.js";
import productsRouter from "./routes/products.router.js"
import "./database.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import compression from "express-compression"

const app = express()
const PUERTO = process.env.PORT;
const manager = new ProductManager()
const claveSecreta = "coderhouse"

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(compression())
app.use(cookieParser(claveSecreta));
// app.use(session({
//     secret: "coderhouse",
//     resave: true,
//     saveUninitialized: true,
//     store: MongoStore.create({
//         mongoUrl: "mongodb+srv://jmferrero:JuMaHawk@cluster0.jk1wtsh.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0",
//         ttl: 1000
//     })
// }));
app.use(passport.initialize());
// app.use(passport.session());   APARENTEMENTE PARA ELIMINAR.
initializePassport();

//CONFIGURACION DE HANDLEBARS.
app.engine("handlebars", exphds.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


// RUTAS
app.use("/", viewsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter); 
app.use("/api/products", productsRouter);
// app.use("/api/sessions", sessionsRouter);




//INICIANDO SERVIDOR CON EXPRESS.
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
    })


    //CONEXIONES CON EL CHAT

    io.on("connection", (socket) => {
        console.log("Nuevo usuario conectado al chat");

        socket.on("message", async data => {

            await MessagesModel.create(data);
            const messages = await MessagesModel.find();
            io.emit("mensajesUsuarios", messages)
        })
    })


    


})

