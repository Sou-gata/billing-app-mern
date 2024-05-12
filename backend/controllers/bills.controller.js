const mongoose = require("mongoose");
const Bill = require("../models/bills.model");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const path = require("path");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const addBill = async (req, res) => {
    const bill = req.body;

    if (!bill) {
        return res.status(400).json(new ApiError(400, "Data is required"));
    }
    if (!bill.mobile) {
        return res.status(400).json(new ApiError(400, "Mobile number is required"));
    }
    try {
        const newBill = await Bill.create(bill);
        return res.status(200).json(new ApiResponse(200, newBill, "Bill added successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};

const searchByDate = async (req, res) => {
    const { date } = req.body;
    if (!date) {
        return res.status(400).json(new ApiError(400, "Date is required"));
    }
    const startDate = new Date(date[0]);
    const endDate = new Date(date[1]);
    endDate.setDate(endDate.getDate() + 1);
    try {
        const bills = await Bill.find({ createdAt: { $gte: startDate, $lt: endDate } }).populate(
            "rows.dbId"
        );
        return res.status(200).json(new ApiResponse(200, bills, "Bills fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};
const searchByMobile = async (req, res) => {
    const { mobile } = req.body;
    if (!mobile) {
        return res.status(400).json(new ApiError(400, "Mobile number is required"));
    }
    try {
        const bills = await Bill.find({ mobile }).populate("rows.dbId");
        return res.status(200).json(new ApiResponse(200, bills, "Bills fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};
const searchByName = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json(new ApiError(400, "Name is required"));
    }
    try {
        const rejexStr = name.toLowerCase();
        const bills = await Bill.find({
            name: { $regex: new RegExp(rejexStr, "i") },
        }).populate("rows.dbId");
        return res.status(200).json(new ApiResponse(200, bills, "Bills fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};

const viewSingleBill = async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) {
        return res.status(400).json(new ApiError(400, "Invalid id"));
    }
    try {
        const bill = await Bill.findById(id).populate("rows.dbId");
        if (!bill) {
            return res.status(404).json(new ApiError(404, "Bill not found"));
        }
        return res.status(200).json(new ApiResponse(200, bill, "Bill fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};

const deleteSingle = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json(new ApiError(400, "Invalid id"));
        }
        const bill = await Bill.findByIdAndDelete(id);
        if (!bill) {
            return res.status(404).json(new ApiError(404, "Bill not found"));
        }
        return res.status(200).json(new ApiResponse(200, bill, "Bill deleted successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};

const deleteAll = async (req, res) => {
    try {
        const bills = await Bill.deleteMany({});
        return res.status(200).json(new ApiResponse(200, bills, "All bills deleted successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};

const internalBackup = async (req, res) => {
    const fs = require("fs/promises");
    try {
        const bills = await Bill.find().select("-__v");
        if (bills.length === 0) return res.status(400).json(new ApiError(400, "No data found"));
        let file = path.join(__dirname, "..", "bills_backup.json");
        fs.writeFile(file, JSON.stringify(bills))
            .then(() => {
                return res.status(200).json(new ApiResponse(200, "Backup created successfully"));
            })
            .catch((err) => {
                return res.status(500).json(new ApiError(500, "Failed to create backup", err));
            });
        return res.status(200).json(new ApiResponse(200, bills, "Internal backup"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
};

const restoreInternalBackup = async (req, res) => {
    const fs = require("fs");
    const dir = path.join(__dirname, "..");
    fs.readdir(dir, function (err, files) {
        if (err) {
            return res.status(500).json(new ApiError(500, "Backup not present", err));
        }
        if (files.includes("bills_backup.json")) {
            const data = require("../bills_backup.json");
            try {
                if (data.length === 0)
                    return res.status(400).json(new ApiError(400, "No data found"));
                else {
                    Bill.deleteMany().then(async () => {
                        const bill = await Bill.insertMany(data);
                        return res.status(201).json({
                            status: 201,
                            message: "Data inserted successfully",
                            success: true,
                            data: {
                                acknowledged: true,
                                addCount: bill.length,
                            },
                        });
                    });
                }
            } catch (error) {
                return res.status(500).json({
                    status: 500,
                    message: "Internal Server Error",
                    success: false,
                    error: error,
                });
            }
        }
    });
};

module.exports = {
    addBill,
    searchByDate,
    searchByMobile,
    searchByName,
    viewSingleBill,
    deleteSingle,
    deleteAll,
    internalBackup,
    restoreInternalBackup,
};
