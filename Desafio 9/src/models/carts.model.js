import mongoose from "mongoose";

const cartSchema = new mongoose.Schema ({
    products : [
        {
            products : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "products",
                // required : true
            },
            quantity : {
                type : Number,
                // required : true
            }
        }
    ]
})



const CartModel = mongoose.model("carts", cartSchema)

export default CartModel;