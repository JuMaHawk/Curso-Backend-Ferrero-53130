import express from "express";
// import UsuarioModel from "../models/usuario.model.js";
// import { isValidPassword } from "../utils/hashbcrypt.js";
import passport from "passport";

const router = express.Router();

// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const usuario = await UsuarioModel.findOne({ email: email });

//         if (usuario) {
//             if (isValidPassword(password, usuario)) {
//                 req.session.login = true;
//                 req.session.user = {
//                     first_name: usuario.first_name,
//                     email: usuario.email,
//                     age: usuario.age,
//                     last_name: usuario.last_name,
//                     role: usuario.role
//                 }
//                 res.redirect("/");
//             } else {
//                 res.status(401).send("Contraseña erronea");
//             }
//         } else {
//             res.status(404).send("Usuario no encontrado");
//         }

//     } catch (error) {
//     res.status(400).send("Error en el login")
// }
// })


//LOGIN CON PASSPORT.
router.post("/login", passport.authenticate("login", {
    failureRedirect: "api/sessions/faillogin"
}), async (req, res) => {
    if (!req.user) {
        return res.status(400).send("Credenciales invalidas");
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role
    };

    req.session.login = true;

    res.redirect("/profile")
})


router.get("/faillogin", async (req, res) => {
    res.send("Error al intentar hacer el login")
})




router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})


//GITHUB
router.get("/github", passport.authenticate("github", {scope: ["user: email"]}), async (req, res) => {})

router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/login"
}), async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile")
})



export default router;