const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        mobile: { type: Number, required: true, unique: true },
        isActive: { type: Boolean, default: true },
        role: { type: String, default: "worker", select: false },
        password: {
            type: String,
            required: false,
            default: "$2b$10$phVXWREpUdpP/YTwesIxNujwmoxHAAmVGvFHc5eNLR43Mv34qS3a.", //12345678
            select: false,
        },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

userSchema.methods.getAccessToken = function () {
    return jwt.sign({ _id: this._id, role: this.role }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    });
};
userSchema.methods.getRefreshToken = function () {
    return jwt.sign({ _id: this._id, role: this.role }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
    });
};

module.exports = mongoose.model("User", userSchema);
