const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    }
}, { timestamps: true });

module.exports = mongoose.model("Events", eventSchema);