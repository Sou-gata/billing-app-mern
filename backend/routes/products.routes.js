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

router.route("/add").post(addProduct);
router.route("/all").get(getAllProducts);
router.route("/backup-present").get(isBackupPresent);

router.route("/backup/json").get(backupJson);
router.route("/backup/excel").get(backupXLSX);
router.route("/backup").get(backup);

router.route("/restore/json").post(upload.single("file"), restoreJSON);
router.route("/restore/excel").post(upload.single("file"), restoreXLSX);
router.route("/restore").get(restore);

router.route("/search").post(searchProduct);
router.route("/:id").get(getSingleProduct);
router.route("/update/:mid").put(updateProduct);
router.route("/delete/all").delete(deleteAllProducts);
router.route("/delete/:id").delete(deleteProduct);
router.route("/add/all").post(addAllProduct);
router.route("/add/excel").post(upload.single("file"), addExcelData);

module.exports = router;
