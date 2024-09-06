import jwt from "jsonwebtoken";
import UsuarioModel from "../models/usuario.model.js"
import EmailManager from "../services/email.js";
import generarResetToken from "../utils/tokenreset.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js"

const emailManager = new EmailManager;

class UserController {
    async register(req, res) {
        try {
            if (!req.user) {
                return res.status(400).send("Credenciales invalidas");
            }
            res.redirect("/login")
        }

        catch (error) {
            res.send(error)
        }
    }


    async failedregister(req, res) {
        res.send("No se pudo concretar el registro")
    }


    async login(req, res) {
        try {
            if (!req.user) {
                return res.status(400).send("Credenciales invalidas");
            }
            let token = jwt.sign({ usuario: req.user }, "coderhouse", { expiresIn: "24h" });
            res.cookie("userLogin", token, { maxAge: 3600000, httpOnly: true })
            res.redirect("/api/users/current")
        } catch (error) {
            res.send(error)
        }
    };


    async current(req, res) {
        return res.send(req.user);
    }


    async faillogin(req, res) {
        res.send("Error al intentar hacer el login")
    }


    async logout(req, res) {
        res.clearCookie("userLogin")
        res.redirect("/login");
    }


    async github(req, res) {
        let token = jwt.sign({ usuario: req.user }, "coderhouse", { expiresIn: "24h" });
        res.cookie("userLogin", token, { maxAge: 3600000, httpOnly: true })
        res.redirect("/api/users/current")
    }


    async requestPasswordReset(req, res) {
        const { email } = req.body;
        try {
            const user = await UsuarioModel.findOne({ email })

            if (!user) {
                return res.status(404).send("Usuario no encontrado")
            }
            const token = generarResetToken();
            user.resetToken = {
                token: token,
                expire: new Date(Date.now() + 3600000)
            }
            await user.save()

            await emailManager.enviarCorreoRestablecimiento(email, user.first_name, token);

            res.redirect("/confirmacion-envio")

        } catch (error) {
            res.status(500).send("Error interno del servidor")
        }
    }


    async resetPassword(req, res) {
        const { email, password, token } = req.body;

        try {
            const user = await UsuarioModel.findOne({ email })

            if (!user) {
                return res.render("cambiopassword", { error: "Usuario no encontrado" })
            }

            const resetToken = user.resetToken;

            if (!resetToken || resetToken.token !== token) {
                return res.render("cambiopassword", { error: "El token es invalido" })
            }

            const ahora = new Date()

            if (ahora > resetToken.expire) {
                return res.render("cambiopassword", { error: "El token ya expiro" })
            }

            if (isValidPassword(password, user)) {
                return res.render("cambiopassword", { error: "La nueva clave no puede ser igual a la anterior" })
            }

            user.password = createHash(password)
            user.resetToken = undefined;
            await user.save();

            return res.redirect("/login")

        } catch (error) {

            res.status(500).render("passwordreset", { error: "Error interno del servidor" })
        }
    }


    async cambiarRol(req, res) {
        const { uid } = req.params;

        try {
            const user = await UsuarioModel.findById(uid);

            if (!user) {
                return res.status(404).send("Usuario no encontrado")
            }

            const nuevoRol = user.role === "user" ? "premium" : "usuario";

            const actualizado = await UsuarioModel.findByIdAndUpdate(uid, { role: nuevoRol })

            res.json(actualizado);

        } catch (error) {
            res.status(500).send("Error en el servidor")
        }
    }

}
export default UserController;