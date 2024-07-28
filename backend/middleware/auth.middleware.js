const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");

const isAdmin = async (req, res, next) => {
    let token;
    if (req.cookies?.accessToken) {
        token = req.cookies?.accessToken;
    } else if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req?.headers?.authorization.split(" ")[1];
    } else {
        return res
            .status(403)
            .json(new ApiError(403, "Not authorized or token expires, Please login again"));
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded?._id).select("+role");
        req.user = user;
        if (user.role === "admin") {
            next();
        } else {
            return res.status(403).json(new ApiError(403, "You are not authorized"));
        }
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Something went wrong", error));
    }
};

const isWorker = async (req, res, next) => {
    let token;
    if (req.cookies?.accessToken) {
        token = req.cookies?.accessToken;
    } else if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req?.headers?.authorization.split(" ")[1];
    } else {
        return res
            .status(403)
            .json(new ApiError(403, "Not authorized or token expires, Please login again"));
    }
    try {
        if (token) {
            const decoded = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET || "thisIsTheSecret#12@34"
            );
            const user = await User.findById(decoded?._id).select("+role");
            req.user = user;
            const { role } = user;
            if (role === "worker" || role === "admin") {
                next();
            } else {
                return res.status(403).json(new ApiError(403, "You are not authorized"));
            }
        } else {
            return res
                .status(403)
                .json(new ApiError(403, "Not authorized or token expires, Please login again"));
        }
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Something went wrong", error));
    }
};

module.exports = { isAdmin, isWorker };
