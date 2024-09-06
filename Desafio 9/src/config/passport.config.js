import passport from "passport";
import jwt from "passport-jwt";
import local from "passport-local";
import UsuarioModel from "../models/usuario.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import GitHubStrategy from "passport-github2";
import CartModel from "../models/carts.model.js";



const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;


//ESTRATEGIA CON JWT PARA EL LOGIN.
const initializePassport = () => {

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "coderhouse",
    }, async (jwt_payload, done) => {
        try {
            const user = await UsuarioModel.findById(jwt_payload.usuario._id)
            if(!user){
                return done(null, false)
            }
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }));


    //ESTRATEGIA CON LOCAL PARA EL REGISTRO.    
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
            let usuario = await UsuarioModel.findOne({ email: username });
            if (usuario) {
                console.log("Ya existe el usuario ingresado");
                return done(null, false);
            };

            const role = email === "admincoder@coder.com" ? "admin" : "usuario";

            const newCart = new CartModel({ products: [] });
            await newCart.save();
            let nuevoUsuario = {
                first_name,
                last_name,
                email,
                age,
                role,
                password: createHash(password),
                cart: newCart._id
            }

            let resultado = await UsuarioModel.create(nuevoUsuario);
            return done(null, resultado) //CARGA EN REQ.USER EL USUARIO REGISTRADO

        } catch (error) {
            return done(error);
        }
    }));


    //ESTRATEGIA CON LOCAL PARA EL LOGIN.
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

            return done(null, usuario); //CARGA EN REQ.USER EL USUARIO Y QUEDAMOS LOGUEADOS.

        } catch (error) {

            return done(error);
        }
    }));


    //ESTRATEGIA DE REGISTRO CON GITHUB.
    passport.use("github", new GitHubStrategy({
        clientID: "Iv23liICJtZRvslOJozg",
        clientSecret: "09c98ac227008c77a2afbfcf143d79363f6e68ef",
        callbackURL: "http://localhost:8080/api/users/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        // console.log("Profile:", profile);
        try {
            let usuario = await UsuarioModel.findOne({ email: profile._json.email });
            if (!usuario) {
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
    }));


    //SERIALIZAR Y DESEREALIZAR.
    // passport.serializeUser((user, done) => {
    //     done(null, user._id)
    // });

    // passport.deserializeUser(async (id, done) => {
    //     let user = await UsuarioModel.findById({ _id: id });
    //     done(null, user);
    // });
}

//CREO MI PROPIO EXTRACTOR DE COOKIES.
export const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["userLogin"];
    }
    return token;
}

export default initializePassport;