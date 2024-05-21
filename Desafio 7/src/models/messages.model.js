import mongoose, { Schema } from "mongoose"

const messagesSchema = new mongoose.Schema({

    user: {
        type: String,
        required: true,
    },

    message: {
        type: String,
        required: true,
    }
})

const MessagesModel = mongoose.model("messages", messagesSchema)

export default MessagesModel;