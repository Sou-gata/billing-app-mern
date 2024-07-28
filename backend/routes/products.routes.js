const express = require("express");
const router = express.Router();

const {
    addProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    addAllProduct,
    deleteAllProducts,
    restore,
    restoreJSON,
    restoreXLSX,
    backup,
    backupJson,
    backupXLSX,
    isBackupPresent,
    addExcelData,
    searchProduct,
} = require("../controllers/products.controller");

const upload = require("../utils/upload");
const { isWorker, isAdmin } = require("../middleware/auth.middleware");

router.route("/add").post(isWorker, addProduct);
router.route("/all").get(getAllProducts);
router.route("/backup-present").get(isBackupPresent);

router.route("/backup/json").get(isWorker, backupJson);
router.route("/backup/excel").get(isWorker, backupXLSX);
router.route("/backup").get(isWorker, backup);

router.route("/restore/json").post(isAdmin, upload.single("file"), restoreJSON);
router.route("/restore/excel").post(isAdmin, upload.single("file"), restoreXLSX);
router.route("/restore").get(isAdmin, restore);

router.route("/search").post(searchProduct);
router.route("/:id").get(getSingleProduct);
router.route("/update/:mid").put(isWorker, updateProduct);
router.route("/delete/all").delete(isWorker, deleteAllProducts);
router.route("/delete/:id").delete(isWorker, deleteProduct);
router.route("/add/all").post(addAllProduct);
router.route("/add/excel").post(isAdmin, upload.single("file"), addExcelData);

module.exports = router;
