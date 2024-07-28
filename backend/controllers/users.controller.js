const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

const accessTokenCookieOptions = {
    httpOnly: true,
    secure: true,
    expire: Date.now() + 1000 * 60 * 60 * 3,
    sameSite: "none",
};
const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: true,
    expire: Date.now() + 1000 * 60 * 60 * 24,
    sameSite: "none",
};
let file = __filename;
file = file.split("\\");
file = file[file.length - 1];
const dir = file == "index.js" ? __dirname : path.join(__dirname, "..");

const signUp = async (req, res) => {
    try {
        let { name, mobile, password, role, isActive } = req.body;
        const createdBy = req.user?._id;
        if (!name || !mobile) {
            return res.status(406).json(new ApiError(406, "name and mobile number is required"));
        }
        name = name
            .trim()
            .split(" ")
            .map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
        let user;
        if (password) {
            const hash = bcrypt.hashSync(password, 10);
            user = await User.create({
                name,
                mobile,
                password: hash,
                role,
                createdBy,
                updatedBy: createdBy,
                isActive,
            });
        } else {
            user = await User.create({ name, mobile, role, createdBy, isActive });
        }
        if (user) {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        name: user.name,
                        mobile: user.mobile,
                        _id: user._id,
                        createdAt: user.createdAt,
                        createdBy: user.createdBy,
                        isActive: user.isActive,
                    },
                    "registered successfully"
                )
            );
        } else {
            return res.status(500).json(new ApiError(500, "Can't register"));
        }
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Something went wrong", error));
    }
};

const getSuperUsersNumber = async (req, res) => {
    try {
        const allAdmins = await User.find({ $and: [{ role: "admin" }, { isActive: true }] });
        return res
            .status(200)
            .json(new ApiResponse(200, { number: allAdmins.length }, "Super users number"));
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Something went wrong", error));
    }
};

const createSuperUser = async (req, res) => {
    let { name, mobile } = req.body;
    try {
        if (!name || !mobile) {
            return res.status(406).json(new ApiError(406, "name and mobile number is required"));
        }
        const allAdmins = await User.find({ $and: [{ role: "admin" }, { isActive: true }] });
        if (allAdmins.length > 0) {
            return res.status(403).json(new ApiError(403, "Super user already exists"));
        }
        name = name
            .trim()
            .split(" ")
            .map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
        let user;
        user = await User.create({ name, mobile, role: "admin", isActive: true });
        if (user) {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        name: user.name,
                        mobile: user.mobile,
                        _id: user._id,
                        createdAt: user.createdAt,
                        isActive: user.isActive,
                    },
                    "registered successfully"
                )
            );
        } else {
            return res.status(500).json(new ApiError(500, "Can't register"));
        }
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Something went wrong", error));
    }
};

const login = async (req, res) => {
    const { mobile, password } = req.body;
    try {
        let user = await User.findOne({ mobile: mobile }).select("+password").select("+role");
        if (user) {
            const matched = bcrypt.compareSync(password, user.password);
            if (matched) {
                if (user.isActive) {
                    const accessToken = await user.getAccessToken();
                    const refreshToken = await user.getRefreshToken();
                    const data = {
                        user: {
                            id: user._id,
                            admin: user.isAdmin,
                            name: user.name,
                            mobile: user.mobile,
                        },
                        accessToken,
                        refreshToken,
                    };
                    return res
                        .status(200)
                        .cookie("accessToken", accessToken, accessTokenCookieOptions)
                        .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
                        .json(new ApiResponse(200, data, "user logged in successfully"));
                } else {
                    return res.status(403).json(new ApiError(403, "login not allowed"));
                }
            }
        }
    } catch (error) {
        return res
            .status(error.statusCode || 500)
            .json(new ApiError(error.statusCode || 500, error.message || "something went wrong"));
    }
};

const logout = async (req, res) => {
    const token = req.cookies?.accessToken || req.cookies?.refreshToken;
    if (!token) {
        return res.status(406).json(new ApiError(406, "no token found"));
    }
    try {
        let decoaded = jwt.verify(
            token,
            req.cookies.accessToken
                ? process.env.ACCESS_TOKEN_SECRET
                : process.env.REFRESH_TOKEN_SECRET
        );
        if (!decoaded) {
            return res.status(400).json(new ApiError(400, "token expired or invalid token"));
        }
        return res
            .status(200)
            .clearCookie("accessToken", accessTokenCookieOptions)
            .clearCookie("refreshToken", refreshTokenCookieOptions)
            .json(new ApiResponse(200, {}, "User logged out successfully"));
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Something went wrong", error));
    }
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const updatedBy = req.user._id;
    if (!oldPassword || !newPassword) {
        return res.status(400).json(new ApiError(400, "Old password and new password is required"));
    } else if (oldPassword === newPassword) {
        return res
            .status(400)
            .json(new ApiError(400, "New password should be different from old password"));
    } else if (newPassword.length < 8) {
        return res
            .status(400)
            .json(new ApiError(400, "Password should be atleast 8 characters long"));
    }
    const user = req.user;
    try {
        const dbUser = await User.findById(user._id).select("+password");
        const matched = bcrypt.compareSync(oldPassword, dbUser.password);
        if (!matched) {
            return res.status(400).json(new ApiError(400, "Old password is incorrect"));
        } else {
            const hash = bcrypt.hashSync(newPassword, 10);
            dbUser.password = hash;
            dbUser.updatedBy = updatedBy;
            const updatedUser = await dbUser.save();
            if (!updatedUser) {
                return res.status(500).json(new ApiError(500, "Failed to change password"));
            } else {
                return res
                    .status(200)
                    .json(new ApiResponse(200, updatedUser, "Password changed successfully"));
            }
        }
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Something went wrong", error));
    }
};

const verify = async (req, res) => {
    const token = req.cookies?.accessToken || req.cookies?.refreshToken;
    try {
        if (!token) {
            return res
                .status(400)
                .clearCookie("accessToken", accessTokenCookieOptions)
                .clearCookie("refreshToken", refreshTokenCookieOptions)
                .json(new ApiError(400, "invalid token"));
        }
        let decoaded = jwt.verify(
            token,
            req.cookies.accessToken
                ? process.env.ACCESS_TOKEN_SECRET
                : process.env.REFRESH_TOKEN_SECRET
        );
        if (!decoaded) {
            return res
                .status(400)
                .clearCookie("accessToken", accessTokenCookieOptions)
                .clearCookie("refreshToken", refreshTokenCookieOptions)
                .json(new ApiError(400, "invalid token"));
        }
        let user = await User.findById(decoaded._id).select(
            "-password -__v -createdAt -updatedAt +role"
        );
        const accessToken = await user.getAccessToken();
        const refreshToken = await user.getRefreshToken();
        return res
            .status(200)
            .cookie("accessToken", accessToken, accessTokenCookieOptions)
            .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken,
                        user: {
                            id: user._id,
                            name: user.name,
                            mobile: user.mobile,
                            role: user.role,
                        },
                    },
                    "User verified successfully"
                )
            );
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Something went wrong", error));
    }
};

const allUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password -__v +role")
            .populate("updatedBy")
            .populate("createdBy");
        return res.status(200).json(new ApiResponse(200, users, "list of all users"));
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Something went wrong", error));
    }
};

const singleUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
            .populate("createdBy updatedBy")
            .select("-password -__v");
        if (user) {
            return res.status(200).json(new ApiResponse(200, user, "user fatched successfully"));
        } else {
            return res.status(404).json(new ApiError(404, "user not found"));
        }
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "something went wrong"));
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (user) {
            return res.status(200).json(new ApiResponse(200, user, "user deleted successfully"));
        } else {
            return res.status(400).json(new ApiError(400, "user not found"));
        }
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, error.message || "Something went wrong", error));
    }
};

const editUser = async (req, res) => {
    try {
        let { name, mobile, role, isActive, id } = req.body;
        const updatedBy = req.user?._id;
        if (!name || !mobile) {
            return res.status(406).json(new ApiError(406, "name and mobile number is required"));
        } else if (!id) {
            return res.status(406).json(new ApiError(406, "id is required"));
        } else if (!role) {
            return res.status(406).json(new ApiError(406, "role is required"));
        } else if (mobile.toString().length !== 10) {
            return res.status(406).json(new ApiError(406, "invalid mobile number"));
        }
        name = name
            .trim()
            .split(" ")
            .map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
        const user = await User.findById(id);
        user.name = name;
        user.mobile = mobile;
        user.role = role;
        user.updatedBy = updatedBy;
        user.isActive = isActive;
        const newUser = await user.save();
        return res.status(200).json(new ApiResponse(200, newUser, "user updated successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "No data found"));
    }
};

const internalBackup = async (req, res) => {
    const fs = require("fs/promises");
    try {
        const users = await User.find().select("+password +role -__v");
        if (users.length === 0) return res.status(400).json(new ApiError(400, "No data found"));
        let file = path.join(dir, "users_backup.json");
        fs.writeFile(file, JSON.stringify(users))
            .then(() => {
                return res.status(200).json(new ApiResponse(200, "Backup created successfully"));
            })
            .catch((err) => {
                return res.status(500).json(new ApiError(500, "Failed to create backup", err));
            });
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};

const externalBackup = async (req, res) => {
    const fs = require("fs/promises");
    const time = Date.now();
    try {
        const users = await User.find().select("+password +role -__v");
        if (users.length === 0) return res.status(400).json(new ApiError(400, "No data found"));
        let file = path.join(dir, "users_backup_" + time + ".json");
        fs.writeFile(file, JSON.stringify(users))
            .then(() => {
                return res.status(200).download(file);
            })
            .finally(() => {
                setTimeout(() => {
                    fs.unlink(file);
                }, 500);
            });
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "No data found"));
    }
};

const restoreInternal = async (req, res) => {
    const fs = require("fs");
    fs.readdir(dir, function (err, files) {
        if (err) {
            return res.status(500).json(new ApiError(500, "Backup not present", err));
        }
        if (files.includes("users_backup.json")) {
            const data = require("../users_backup.json");
            try {
                if (data.length === 0)
                    return res.status(400).json(new ApiError(400, "No data found"));
                else {
                    User.deleteMany().then(async () => {
                        const users = await User.insertMany(data);
                        return res.status(201).json(
                            new ApiResponse(
                                201,
                                {
                                    acknowledged: true,
                                    addCount: users.length,
                                },
                                "Data inserted successfully"
                            )
                        );
                    });
                }
            } catch (error) {
                return res.status(500).json(new ApiError(500, "Internal Server Error", error));
            }
        }
    });
};

const restoreExternal = async (req, res) => {
    const fs = require("fs");
    let file = req.file;
    const fileName = path.join(dir, "uploads", file.filename);
    try {
        const data = require(fileName);
        if (data.length === 0)
            return res.status(200).json(new ApiError(400, "No data found in this JSON"));
        User.deleteMany().then(async () => {
            const users = await User.insertMany(data);
            fs.unlink(fileName, (err) => {});
            return res.status(201).json(
                new ApiResponse(
                    201,
                    {
                        acknowledged: true,
                        addCount: users.length,
                    },
                    "Data inserted successfully"
                )
            );
        });
    } catch (error) {
        return res
            .status(200)
            .json(new ApiError(500, error.message || "Failed to restore data", error));
    }
};

module.exports = {
    signUp,
    createSuperUser,
    getSuperUsersNumber,
    login,
    logout,
    verify,
    allUsers,
    singleUser,
    deleteUser,
    editUser,
    internalBackup,
    externalBackup,
    restoreInternal,
    restoreExternal,
    changePassword,
};
