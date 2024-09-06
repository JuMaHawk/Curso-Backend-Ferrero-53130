import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import UserController from "../controllers/users.controller.js";

const userController = new UserController;
const router = express.Router();

router.post("/register",  passport.authenticate("register", {session: false, failureRedirect: "failedregister"}), userController.register)
router.get("/failedregister", userController.failedregister)
router.post("/login", passport.authenticate("login", {session: false, failureRedirect: "faillogin"}), userController.login)
router.get("/current", passport.authenticate("jwt", {session: false }), userController.current)
router.get("/faillogin", userController.faillogin)
router.get("/logout",userController.logout)
router.get("/github", passport.authenticate("github", {scope: ["user: email"], session: false }))
router.get("/githubcallback", passport.authenticate("github", {session: false, failureRedirect: "/login"}), userController.github)
router.post("/requestPasswordReset", userController.requestPasswordReset)
router.post("/reset-password", userController.resetPassword)
router.put("/premium/:uid", userController.cambiarRol)

//REGISTRO CON PASSPORT.
// router.post("/register", passport.authenticate("register", {
//     session: false,
//     failureRedirect: "/failedregister"
// }), async (req, res) => {

//     if (!req.user) {
//         return res.status(400).send("Credenciales invalidas");
//     }

//     res.redirect("/login")
// });


// router.get("/failedregister", (req, res) => {
//     res.send("No se pudo concretar el registro")
// });


//LOGIN CON PASSPORT.
// router.post("/login", passport.authenticate("login", {
//     session: false,
//     failureRedirect: "api/users/faillogin"
// }), async (req, res) => {
//     if (!req.user) {
//         return res.status(400).send("Credenciales invalidas");
//     }

//     let token = jwt.sign({ usuario: req.user }, "coderhouse", { expiresIn: "24h" });
//     res.cookie("userLogin", token, { maxAge: 3600000, httpOnly: true })
//     res.redirect("/api/users/current")
// });


// router.get("/faillogin", async (req, res) => {
//     res.send("Error al intentar hacer el login")
// })


// router.get("/logout", (req, res) => {
//     res.clearCookie("userLogin")
//     res.redirect("/login");
// })

//GITHUB
// router.get("/github", passport.authenticate("github", { scope: ["user: email"], session: false }), async (req, res) => { })

// router.get("/githubcallback", passport.authenticate("github", {
//     failureRedirect: "/login"
// }), async (req, res) => {

//     let token = jwt.sign({ usuario: req.user }, "coderhouse", { expiresIn: "24h" });
//     res.cookie("userLogin", token, { maxAge: 3600000, httpOnly: true })
//     res.redirect("/api/users/current")
// })


//CURRENT
// router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
//     return res.send(req.user);
// })

export default router;