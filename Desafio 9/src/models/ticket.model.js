import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema ({
    code: {
        type: String,
        required : true
    },

    purchase_datetime: String,

    amount : Number,

    purchaser: {
        type: String,
        required: true
    }
});

const ticketModel = mongoose.model("ticket", ticketSchema)

export default ticketModel;