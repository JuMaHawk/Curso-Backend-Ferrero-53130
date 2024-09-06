import mongoose from "mongoose"
import configObject from "./config/config.js"

//CONECTO CON MONGO DB.
mongoose.connect(configObject.mongo_url)
    .then(() => console.log("Conectados a la base de datos!"))
    .catch((error) => console.log("Tenemos un error", error))