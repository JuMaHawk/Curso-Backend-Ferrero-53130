import express, { urlencoded } from "express";
import exphds from "express-handlebars"
import { Server } from "socket.io";
import productosRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js"
import ProductManager from "./controllers/productManager.js";
import MessagesModel from "./models/messages.model.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import "./database.js";
import usersRouter from "./routes/user.router.js";

const app = express()
const PUERTO = 8080;
const manager = new ProductManager()
const claveSecreta = "coderhouse"

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser(claveSecreta));
app.use(session({
    secret: "coderhouse",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://jmferrero:JuMaHawk@cluster0.jk1wtsh.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0",
        ttl: 100
    })
}));


//CONFIGURACION DE HANDLEBARS.
app.engine("handlebars", exphds.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


// RUTAS
app.use("/", viewsRouter);
app.use("/api/products", productosRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter); 

app.get(("/realtimeproducts"), (req, res) => {
    res.render("realTimeProducts")
});

app.get("/", (req, res) => {
    res.render("home")
});

app.get("/chat", (req, res) => {
    res.render("chat")
});


//COOKIES.
app.get("/setCookie", (req, res) => {
    res.cookie("coderCookie", "Mi primera cookie", { maxAge: 30000 }).send("Mi primera cookie bien creada")
})

app.get("/leerCookie", (req, res) => {
    res.send(req.cookies)
})

app.get("/borrarCookie", (req, res) => {
    res.clearCookie("coderCookie").send("Cookie borrada exitosamente")
})

app.get("/cookieFirmada", (req, res) => {
    res.cookie("cookieFirmada", "Esto es un mensaje secreto", { signed: true }).send("Cookie firmada enviada")
});

app.get("/recupcookiefirmada", (req, res) => {
    const valorCookie = req.signedCookies.cookieFirmada;

    if (valorCookie) {
        res.send("Cookie recuperada con exito " + valorCookie)
    } else {
        res.send("Vamos a morir")
    }
})

//SESSION.
//creo una session
app.get("/session", (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send("Visitaste el sitio " + req.session.counter + " veces");
    } else {
        req.session.counter = 1;
        res.send("Bienvenido por primera vez")
    }
})

//Elimino una session
app.get("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (!error) {
            res.send("Session cerrada");
        } else {
            res.send("Error al cerrar la session")
        }
    })
})

//Login con session.
app.get("/login", (req, res) => {
    let usuario = req.query.usuario;
    req.session.usuario = usuario;
    res.send("Guardamos el usuario por medio del query")
});

app.get("/usuario", (req, res) => {
    if(req.session.usuario) {
        return res.send(`El usuario registrado es el siguiente ${req.session.usuario}`)
    } else {
        res.send("No tenemos un usuario registrado")
    }
})




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

