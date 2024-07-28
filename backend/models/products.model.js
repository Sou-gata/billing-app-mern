const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        value: {
            type: String,
            required: true,
        },
        unit: {
            type: String,
        },
        quantity: {
            type: Number,
        },
        cp: {
            type: Number,
            required: true,
        },
        gst: {
            type: Number,
            required: true,
        },
        sku: {
            type: String,
            required: true,
            unique: true,
        },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Products", ProductSchema);
