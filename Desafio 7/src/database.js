import mongoose from "mongoose"


//CONECTO CON MONGO DB.
mongoose.connect("mongodb+srv://jmferrero:JuMaHawk@cluster0.jk1wtsh.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conectados a la base de datos!"))
    .catch((error) => console.log("Tenemos un error", error))