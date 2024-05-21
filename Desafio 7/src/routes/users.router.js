import express from "express";
import UsuarioModel from "../models/usuario.model.js"
import { createHash } from "../utils/hashbcrypt.js";
import passport from "passport";
const router = express.Router();

//REGISTRAR UN NUEVO USUARIO.
// router.post("/", async (req, res) => {

//     const { first_name, last_name, email, password, age } = req.body;

//     try {
//         const existeUsuario = await UsuarioModel.findOne({ email: email });

//         if (existeUsuario) {
//             return res.status(400).send("El correo ya se encuentra registrado")
//         }

//         const role = email === "admincoder@coder.com" ? "admin" : "usuario";

//         const nuevoUsuario = await UsuarioModel.create({
//             first_name,
//             last_name,
//             email,
//             password: createHash(password),
//             age
//         })
//         res.status(200).send("Usuario creado con exito.");
        

//     } catch (error) {
//         res.status(500).send("Error al crear el nuevo usuario")
//     }
// });


//VERSION PARA PASSPORT.
router.post("/", passport.authenticate("register", {
    failureRedirect: "failedregister"
}), async (req, res) => {
    if(!req.user) {
        return res.status(400).send("Credenciales invalidas");
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol
    };

    req.session.login = true;

    res.redirect("/profile")
})

router.get("/failedregister", (req, res) => {
    res.send("No se pudo concretar el registro")
})

export default router;