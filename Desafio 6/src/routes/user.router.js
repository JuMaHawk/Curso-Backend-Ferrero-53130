import express from "express";
import UsuarioModel from "../models/usuario.model.js"
const router = express.Router();


router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    try {
        const existeUsuario = await UsuarioModel.findOne({ email: email });

        if (existeUsuario) {
            return res.status(400).send("El correo ya se encuentra registrado")
        }

        const nuevoUsuario = await UsuarioModel.create({
            first_name,
            last_name,
            email,
            password,
            age,
        })


        req.session.user = {
            email: nuevoUsuario.email,
            first_name: nuevoUsuario.first_name
        };

        req.session.login = true;
        res.status(200).send("Usuario creado con exito.");

    } catch (error) {
        console.log(req.body)
        res.status(500).send("Error al crear el nuevo usuario")
    }
});

export default router;