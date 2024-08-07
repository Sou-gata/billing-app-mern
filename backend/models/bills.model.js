const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema(
    {
        mobile: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
        },
        date: {
            type: Date,
            required: true,
        },
        rows: [
            {
                sku: {
                    type: String,
                },
                item: {
                    type: String,
                    required: true,
                },
                specification: {
                    type: String,
                },
                unit: {
                    type: String,
                },
                rate: {
                    type: Number,
                    required: true,
                },
                gst: {
                    type: Number,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                value: {
                    type: Number,
                    required: true,
                },
                gstRs: {
                    type: Number,
                    required: true,
                },
                total: {
                    type: Number,
                    required: true,
                },
                dbId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Products",
                },
            },
        ],
        subTotal: {
            quantity: {
                type: Number,
                default: 0,
            },
            value: {
                type: Number,
                default: 0,
            },
            gstRs: {
                type: Number,
                default: 0,
            },
            total: {
                type: Number,
                default: 0,
            },
        },
        delivery: {
            gst: {
                type: Number,
                default: 0,
            },
            value: {
                type: Number,
                default: 0,
            },
            gstRs: {
                type: Number,
                default: 0,
            },
            total: {
                type: Number,
                default: 0,
            },
        },
        grandTotal: {
            value: {
                type: Number,
                default: 0,
            },
            gstRs: {
                type: Number,
                default: 0,
            },
            total: {
                type: Number,
                default: 0,
            },
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Bills", BillSchema);
