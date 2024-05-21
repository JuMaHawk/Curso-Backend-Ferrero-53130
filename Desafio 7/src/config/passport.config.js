import passport from "passport";
import local from "passport-local";
import UsuarioModel from "../models/usuario.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import GitHubStrategy from "passport-github2";

const LocalStrategy = local.Strategy;


//ESTRATEGIA PARA EL REGISTRO.
const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
            let usuario = await UsuarioModel.findOne({ email: email });
            if (usuario) {
                return done(null, false);
            };

            let nuevoUsuario = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            let resultado = await UsuarioModel.create(nuevoUsuario);
            return done(null, resultado)

        } catch (error) {
            return done(error);
        }
    }));

    //AGREGAMOS OTRA ESTRATEGIA PARA EL LOGIN.
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            let usuario = await UsuarioModel.findOne({ email });
            if (!usuario) {
                console.log("Este usuario no existe");
                return done(null, false);
            };

            if (!isValidPassword(password, usuario)) {
                return done(null, false);
            }

            return done(null, usuario);
        } catch (error) {
            return done(error);
        }
    }));

    //SERIALIZAR Y DESEREALIZAR.
    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UsuarioModel.findById({ _id: id });
        done(null, user);
    });

    //ESTRATEGIA CON GITHUB.
    passport.use("github", new GitHubStrategy({
        clientID: "Iv23liICJtZRvslOJozg",
        clientSecret: "09c98ac227008c77a2afbfcf143d79363f6e68ef",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("Profile:", profile);
        try {
            let usuario = await UsuarioModel.findOne({ email: profile._json.email });
            if ("usuario") {
                let nuevoUsuario = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 25,
                    email: profile._json.email,
                    password: ""
                }

                let resultado = await UsuarioModel.create(nuevoUsuario);
                done(null, resultado);
            } else {
                done(null, usuario);
            }
        } catch (error) {
            return done(error)
        }
    }))


}

export default initializePassport;