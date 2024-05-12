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
        amount: {
            type: Number,
        },
        location: {
            type: String,
        },
        entry: {
            type: String,
        },
        group: {
            type: String,
        },
        category: {
            type: String,
        },
        gst: {
            type: Number,
            required: true,
        },
        hsn: {
            type: Number,
        },
        brand: {
            type: String,
        },
        specification: {
            type: String,
        },
        id: {
            type: String,
        },
        sku: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Products", ProductSchema);
