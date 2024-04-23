import mongoose from "mongoose";


const productsSchema = new mongoose.Schema({
    id: String,
    title: {
        type : String,
        index : true,
        required : true
        },
    description: {
        type :String,
        required : true
        },
    code:{
        type: String,
        unique : true,
        required : true
        },
    price: {  
        type: Number,
        required: true
        },
    status: {
        type : Boolean
        },
    stock: {
        type : Number,
        required : true
        },
    category: {
        type : String,
        required : true
        },
    thumbnail: [String]
})

const ProductsModel = mongoose.model("products", productsSchema)

export default ProductsModel;