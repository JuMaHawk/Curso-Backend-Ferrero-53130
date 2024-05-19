import express from "express";
import ProductManager from "../controllers/productManager.js"
import UsuarioModel from "../models/usuario.model.js";
const router = express.Router();
const manager = new ProductManager();

router.get("/", async (req, res) => {
    if(!req.session.login) {
        res.redirect("/login")
    }   
    try {
        let query = req.query.query;
        let limit = parseInt(req.query.limit);
        let page = parseInt(req.query.page);
        let sort = (req.query.sort);

        const productos = await manager.getProducts({limit, sort, page, query});
        res.render("home", {productos:productos.docs, user: req.session.user})        
    } catch (error) {
        res.status(500).json({error: "Error interno del servidor"})
    }
})


router.get("/realtimeproducts", async (req, res) => {
   res.render("realTimeProducts")
} )


router.get("/login", (req, res) => {
    res.render("login");
});


router.get("/register", (req, res) => {
    res.render("register");
});


router.get("/profile", (req, res) => {
    if(!req.session.login){
        return res.redirect("/login");
    }
    res.render("profile", {user: req.session.user});
});


router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts")
});


router.get("/chat", (req, res) => {
    res.render("chat")
});



export default router;