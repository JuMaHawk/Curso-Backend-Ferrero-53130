import express from "express";
import UsuarioModel from "../models/usuario.model.js";
import { isValidPassword } from "../utils/hashbcrypt.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await UsuarioModel.findOne({ email: email });

        if (usuario) {
            if (isValidPassword(password, usuario)) {
                req.session.login = true;
                req.session.user = {
                    first_name: usuario.first_name,
                    email: usuario.email,
                    age: usuario.age,
                    last_name: usuario.last_name,
                    role: usuario.role
                }
                res.redirect("/");
            } else {
                res.status(401).send("Contraseña erronea");
            }
        } else {
            res.status(404).send("Usuario no encontrado");
        }
    
    } catch (error) {
    res.status(400).send("Error en el login")
}
})

router.get("/logout", (req,res) => {
    if(req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

export default router;