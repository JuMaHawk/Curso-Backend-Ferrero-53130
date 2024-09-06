class ViewsController {

    async home(req, res) {
        try {
            if (!req.cookies["userLogin"]) {
                return res.redirect("/login")
            }
            res.render("home", { user: req.user })
        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor, este" })
        }
    }


    async realtimeproducts(req, res) {
        res.render("realTimeProducts")
    }


    async login(req, res) {
        res.render("login");
    };


    async register(req, res) {
        res.render("register");
    };


    async profile (req, res) {
        if (!req.cookies["userLogin"]) {
            res.redirect("/login")
        }
        res.render("profile", {
            usuario: req.user.usuario.first_name,
            role: req.user.usuario.role
        })
    }
    

    async chat (req, res) {
        res.render("chat")
    }


    async ticket(req,res) {
        res.render("ticket")
    }


    async resetPassword (req, res) {
        res.render("resetpass")
    }


    async cambioPassword (req, res) {
        res.render("cambiopassword")
    }

    async confirmacion (req, res) {
        res.render("confirmacion-envio")
    }

}

export default ViewsController;