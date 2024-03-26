import express from "express";
const app = express();
const PORT = 8080;
import router from "./routes/products.router.js"


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.send("funciona!")
})

//Rutas
app.use("/api", router);



app.listen (PORT, () => {
    console.log(`Escuchando en puerto http://localhost/${PORT}`)
})