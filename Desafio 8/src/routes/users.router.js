import express from "express";
import UsuarioModel from "../models/usuario.model.js"
import { createHash } from "../utils/hashbcrypt.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const router = express.Router();



//REGISTRO CON PASSPORT.
router.post("/", passport.authenticate("register", {
    failureRedirect: "/failedregister"
}), async (req, res) => {
   
    if(!req.user) {
        return res.status(400).send("Credenciales invalidas");
    }

    res.redirect("/login")
});


router.get("/failedregister", (req, res) => {
    res.send("No se pudo concretar el registro")
});


//LOGIN CON PASSPORT.
router.post("/login", passport.authenticate("login", {
    failureRedirect: "api/users/faillogin"
}), async (req, res) => {
    if (!req.user) {
        return res.status(400).send("Credenciales invalidas");
    }

    let token = jwt.sign({ usuario: req.user }, "coderhouse", { expiresIn: "24h" });
    res.cookie("userLogin", token, { maxAge: 3600000, httpOnly: true })
    res.redirect("/api/users/current")
});


router.get("/faillogin", async (req, res) => {
    res.send("Error al intentar hacer el login")
})


router.get("/logout", (req, res) => {
    
    res.clearCookie("userLogin")
    res.redirect("/login");
})

//GITHUB
router.get("/github", passport.authenticate("github", { scope: ["user: email"] }), async (req, res) => { })

router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/login"
}), async (req, res) => {

    let token = jwt.sign({ usuario: req.user }, "coderhouse", { expiresIn: "24h" });
    res.cookie("userLogin", token, { maxAge: 3600000, httpOnly: true })
    res.redirect("/api/users/current")
})


//CURRENT
router.get("/current", passport.authenticate("jwt", {session: false}),(req, res) => {
    return res.send(req.user);
})

export default router;