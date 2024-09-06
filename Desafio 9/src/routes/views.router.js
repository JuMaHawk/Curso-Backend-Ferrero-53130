import ViewsController from "../controllers/viewsController.js";
import express from "express";
import {handlePolicies } from "../middelwaree/middleware.js";
const router = express.Router();
const viewsController = new ViewsController;

router.get("/", viewsController.home)
router.get("/realtimeproducts", handlePolicies(["ADMIN"]), viewsController.realtimeproducts)
router.get("/login", viewsController.login)
router.get("/register", viewsController.register)
router.get("/profile", handlePolicies(["USER", "ADMIN"]), viewsController.profile)
router.get("/chat", handlePolicies(["USER"]), viewsController.chat)
router.get("/ticket", viewsController.ticket)
router.get("/reset-password", viewsController.resetPassword)
router.get("/password", viewsController.cambioPassword)
router.get("/confirmacion-envio", viewsController.confirmacion)



// router.get("/", async (req, res) => {
//     try {
//         if (!req.cookies["userLogin"]) {
//             return res.redirect("/login")
//         }
//         res.render("home", {user: req.user })
//     } catch (error) {
//         res.status(500).json({ error: "Error interno del servidor, este" })
//     }
// })


// router.get("/realtimeproducts", handlePolicies(["ADMIN"]), async (req, res) => {
//     res.render("realTimeProducts")
// })


// router.get("/login", (req, res) => {
//     res.render("login");
// });


// router.get("/register", (req, res) => {
//     res.render("register");
// });


// router.get("/profile", handlePolicies(["USER", "ADMIN"]), (req, res) => {
//     if (!req.cookies["userLogin"]) {
//         res.redirect("/login")
//     }
//     res.render("profile", {
//         usuario: req.user.usuario.first_name,
//         role: req.user.usuario.role
//     })
// });


// router.get("/chat", handlePolicies(["USER"]),(req, res) => {
//     res.render("chat")
// });

// router.get("/ticket", (req,res) => {
//     res.render("ticket")
// })



export default router;