const Products = require("../models/products.model");
const mongoose = require("mongoose");
const path = require("path");
const XLSX = require("xlsx");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

let file = __filename;
file = file.split("\\");
file = file[file.length - 1];

const dir = file == "index.js" ? __dirname : path.join(__dirname, "..");

const addProduct = async (req, res) => {
    const createdBy = req.user._id;
    const { value, unit, quantity, cp, gst, sku } = req.body;
    if (!value) {
        return res.status(400).json(new ApiError(400, "Please enter item name"));
    } else if (!cp) {
        return res.status(400).json(new ApiError(400, "Please enter cost price"));
    } else if (!gst) {
        return res.status(400).json(new ApiError(400, "Please enter GST"));
    } else if (!sku) {
        return res.status(400).json(new ApiError(400, "Please enter SKU"));
    } else {
        try {
            const product = await Products.create({
                value,
                unit,
                quantity,
                cp,
                gst,
                createdBy,
            });
            return res
                .status(201)
                .json(new ApiResponse(201, product, "Product added successfully"));
        } catch (error) {
            return res.status(500).json(new ApiError(500, "Failed to add product", error));
        }
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Products.find();
        return res.status(200).json(new ApiResponse(200, products, "All products"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to fetch products", error));
    }
};

const getSingleProduct = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json(new ApiError(400, "Please provide product ID"));
    }
    if (!isValidId(id)) {
        return res.status(400).json(new ApiError(400, "Invalid product ID"));
    }
    try {
        const product = await Products.findById(id).populate("updatedBy").populate("createdBy");
        if (!product) {
            return res.status(404).json(new ApiError(404, "Product not found"));
        } else {
            return res.status(200).json(new ApiResponse(200, product, "Product found"));
        }
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to fetch product", error));
    }
};

const updateProduct = async (req, res) => {
    const { mid } = req.params;
    const updatedBy = req.user._id;

    const { value, unit, quantity, cp, gst, sku } = req.body;
    if (!mid) {
        return res.status(400).json(new ApiError(400, "Please provide product ID"));
    }
    if (!isValidId(mid)) {
        return res.status(400).json(new ApiError(400, "Invalid product ID"));
    }
    try {
        const product = await Products.findByIdAndUpdate(mid, {
            value,
            unit,
            quantity,
            cp,
            gst,
            sku,
            updatedBy,
        });
        if (!product) {
            return res.status(404).json(new ApiError(404, "Product not found"));
        } else {
            return res.status(200).json(new ApiResponse(200, product, "Product updated"));
        }
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to update product", error));
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json(new ApiError(400, "Please provide product ID"));
    }
    if (!isValidId(id)) {
        return res.status(400).json(new ApiError(400, "Invalid product ID"));
    }
    try {
        const product = await Products.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json(new ApiError(404, "Product not found"));
        } else {
            return res.status(200).json(new ApiResponse(200, product, "Product deleted"));
        }
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to delete product", error));
    }
};

const deleteAllProducts = async (req, res) => {
    try {
        const products = await Products.deleteMany();
        if (!products) {
            return res.status(404).json(new ApiError(404, "No products found"));
        } else {
            return res.status(200).json(new ApiResponse(200, products, "All products deleted"));
        }
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to delete products", error));
    }
};

const addAllProduct = async (req, res) => {
    let products = req.body;
    products.filter((product) => {
        if (product.value && product.cp && product.gst && product.sku) {
            return true;
        } else {
            return false;
        }
    });
    if (!products) {
        return res.status(400).json(new ApiError(400, "Please provide products"));
    }
    try {
        const newProducts = await Products.insertMany(products);
        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    { addCount: newProducts.length, acknowledged: true },
                    "Products added successfully"
                )
            );
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to add products", error));
    }
};

const searchProduct = async (req, res) => {
    let { query } = req.body;
    query = query.trim().toUpperCase();
    if (!query) {
        return res.status(400).json(new ApiError(400, "Please provide search query"));
    }
    try {
        const products = await Products.find({
            $or: [{ value: { $regex: query } }, { sku: { $regex: query } }],
        });
        if (products.length === 0) {
            return res.status(404).json(new ApiError(404, "No products found"));
        } else {
            return res.status(200).json(new ApiResponse(200, products, "Products found"));
        }
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to search products", error));
    }
};

const restore = async (req, res) => {
    const fs = require("fs");

    fs.readdir(dir, function (err, files) {
        if (err) {
            return res.status(500).json(new ApiError(500, "Backup not present", err));
        }
        if (files.includes("backup.json")) {
            const data = require("../backup.json");
            try {
                if (data.length === 0)
                    return res.status(400).json(new ApiError(400, "No data found"));
                else {
                    Products.deleteMany().then(async () => {
                        const product = await Products.insertMany(data);
                        return res.status(201).json({
                            status: 201,
                            message: "Data inserted successfully",
                            success: true,
                            data: {
                                acknowledged: true,
                                addCount: product.length,
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
        } else {
            return res.status(400).json({
                status: 400,
                message: "No internal backup found",
                success: false,
            });
        }
    });
};

const backup = async (req, res) => {
    const fs = require("fs/promises");
    try {
        const products = await Products.find().select("-__v -_id");
        let file = path.join(dir, "backup.json");
        if (products.length === 0) return res.status(400).json(new ApiError(400, "No data found"));
        fs.writeFile(file, JSON.stringify(products))
            .then(() => {
                return res.status(200).json(new ApiResponse(200, "Backup created successfully"));
            })
            .catch((err) => {
                return res.status(500).json(new ApiError(500, "Failed to create backup", err));
            });
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to fetch products", error));
    }
};

const backupJson = async (req, res) => {
    console.log("Backup JSON");
    const fs = require("fs/promises");
    try {
        const products = await Products.find().select("-__v -_id");
        let file = path.join(dir, "backup_ext.json");
        if (products.length === 0) return res.status(400).json(new ApiError(400, "No data found"));
        fs.writeFile(file, JSON.stringify(products))
            .then(() => {
                return res.status(200).download(file);
            })
            .catch((err) => {
                return res.status(500).json(new ApiError(500, "Failed to create backup", err));
            });
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to fetch products", error));
    }
};

const backupXLSX = async (req, res) => {
    const fs = require("fs");
    try {
        Products.find()
            .select("-__v")
            .then((products) => {
                if (products.length === 0)
                    return res.status(400).json(new ApiError(400, "No data found"));
                let temp = [];
                for (let product of products) {
                    temp.push({
                        ITEM: product.value || "",
                        CP: product.cp || "",
                        "GST %": product.gst || "",
                        "SKU NO": product.sku || "",
                        UNIT: product.unit || "",
                        QTY: product.quantity || "",
                        AMOUNT: product.amount || "",
                        ROOM: product.location || "",
                        "ENTRY BY": product.entry || "",
                        GROUP: product.group || "",
                        "Stcok Category": product.category || "",
                        HSN: product.hsn || "",
                        BRAND: product.brand,
                        SPECIFICATION: product.specification || "",
                        "PRODUCT ID": product.id || "",
                        createdAt: product.createdAt || "",
                        updatedAt: product.updatedAt || "",
                        _id: product._id.toString() || "",
                    });
                }
                const workbook = XLSX.utils.book_new();
                const sheet = XLSX.utils.json_to_sheet([{}]);
                const sheet2 = XLSX.utils.json_to_sheet(temp);
                XLSX.utils.book_append_sheet(workbook, sheet, "BRANCH STOCK");
                XLSX.utils.book_append_sheet(workbook, sheet2, "MR MAIN STOCK");
                XLSX.utils.book_append_sheet(workbook, sheet, "IMP STOCK");
                XLSX.writeFile(workbook, "backup.xlsx");
                res.status(200).download("backup.xlsx");
                setTimeout(() => {
                    fs.unlink("backup.xlsx", (err) => {});
                }, 5000);
            });
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to fetch products", error));
    }
};

const isBackupPresent = (req, res) => {
    const fs = require("fs");

    fs.readdir(dir, function (err, files) {
        if (err) {
            return res.status(500).json(new ApiError(500, "Failed to check backup", err));
        }
        if (files.includes("backup.json")) {
            const stats = fs.statSync(path.join(dir, "backup.json"));
            return res.status(200).json(new ApiResponse(200, stats, "Backup present"));
        } else {
            return res.status(200).json(new ApiResponse(200, files, "Backup not present"));
        }
    });
};

const addExcelData = async (req, res) => {
    let file = req.file;
    const fileName = path.join(dir, "uploads", file.filename);
    const fs = require("fs/promises");
    try {
        const allData = XLSX.readFile(fileName);
        let sheets = allData.SheetNames;
        let allSheetRows = [];
        sheets.forEach((sheet, index) => {
            let rowObject = XLSX.utils.sheet_to_json(allData.Sheets[sheet]);
            allSheetRows = [...allSheetRows, ...rowObject];
        });
        let products = [];
        for (let product of allSheetRows) {
            if (!product["ITEM"]) continue;
            if (!product["GST %"]) continue;
            if (!product["RATE"] && !product["CP"]) continue;
            if (!product["SKU NO "] && !product["SKU NO"]) continue;
            products.push({
                value: product["ITEM"].toUpperCase(),
                cp: product["RATE"] || product["CP"],
                gst: product["GST %"],
                sku: (product["SKU NO "] || product["SKU NO"])?.toUpperCase(),
                unit: product["UNIT"],
                quantity: isNaN(parseFloat(product["QTY"])) ? 1 : parseFloat(product["QTY"]),
            });
        }
        if (products.length === 0) return res.status(400).json(new ApiError(400, "No data found"));
        const product = await Products.insertMany(products);
        return res.status(201).json({
            status: 201,
            message: "Data inserted successfully",
            success: true,
            data: {
                acknowledged: true,
                addCount: product.length,
            },
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json(new ApiError(500, "Failed to add products", error));
    } finally {
        fs.unlink(fileName)
            .then(() => {})
            .catch((err) => {});
    }
};

const restoreJSON = async (req, res) => {
    const fs = require("fs");
    let file = req.file;
    const fileName = path.join(dir, "uploads", file.filename);
    try {
        const data = require(fileName);
        if (data.length === 0) return res.status(200).json(new ApiError(400, "No data found"));
        Products.deleteMany()
            .then(async () => {
                const product = await Products.insertMany(data);
                fs.unlink(fileName, (err) => {});
                return res.status(201).json({
                    status: 201,
                    message: "Data inserted successfully",
                    success: true,
                    data: {
                        acknowledged: true,
                        addCount: product.length,
                    },
                });
            })
            .catch((err) => {
                return res.status(200).json(new ApiError(500, "Failed to restore data", err));
            });
    } catch (error) {
        return res.status(200).json(new ApiError(500, "Failed to restore data", error));
    }
};

const restoreXLSX = async (req, res) => {
    let file = req.file;
    if (!file) return res.status(500).json(new ApiError(500, "Something went wrong"));
    const fileName = path.join(dir, "uploads", file.filename);
    try {
        const allData = XLSX.readFile(fileName);
        const sheetName = allData.SheetNames[1];
        let rowObject = XLSX.utils.sheet_to_json(allData.Sheets[sheetName]);
        let products = [];
        for (let product of rowObject) {
            if (product["ITEM"] === undefined) continue;
            if (product["GST %"] === undefined) continue;
            if (product["RATE"] === undefined && product["CP"] === undefined) continue;
            products.push({
                value: product["ITEM"].toUpperCase(),
                cp: product["RATE"] || product["CP"] || "0",
                gst: product["GST %"] || "0",
                sku: (product["SKU NO "] || product["SKU NO"]).toUpperCase(),
                unit: product["UNIT"] || "",
                quantity: product["QTY"] || "0",
                amount: product["AMOUNT"] || "0",
                location: product["ROOM"],
                entry: product["ENTRY BY"],
                group: product["GROUP"],
                category: product["Stcok Category"] || "",
                hsn: product["HSN"] || "0",
                brand: product["BRAND"],
                specification: product["SPECIFICATION"],
                id: product["PRODUCT ID"],
                _id: product["_id"],
            });
        }
        if (products.length === 0) return res.status(400).json(new ApiError(400, "No data found"));
        Products.deleteMany().then(async () => {
            const product = await Products.insertMany(products);
            return res.status(201).json({
                status: 201,
                message: "Data inserted successfully",
                success: true,
                data: {
                    acknowledged: true,
                    addCount: product.length,
                },
            });
        });
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to add products", error));
    }
};

module.exports = {
    addProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    deleteAllProducts,
    addAllProduct,
    searchProduct,
    restore,
    backup,
    restoreJSON,
    restoreXLSX,
    backupJson,
    backupXLSX,
    isBackupPresent,
    addExcelData,
};
