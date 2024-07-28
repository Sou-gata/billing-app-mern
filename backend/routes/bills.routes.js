const express = require("express");
const router = express.Router();

const {
    addBill,
    searchByDate,
    searchByMobile,
    searchByName,
    viewSingleBill,
    deleteSingle,
    deleteAll,
    internalBackup,
    restoreInternalBackup,
    editBill,
    externalBackup,
    restoreExternalBackup,
} = require("../controllers/bills.controller");
const upload = require("../utils/upload");
const { isAdmin, isWorker } = require("../middleware/auth.middleware");

router.route("/add").post(isWorker, addBill);
router.route("/search-date").post(searchByDate);
router.route("/search-mobile").post(searchByMobile);
router.route("/search-name").post(searchByName);
router.route("/internal-backup").get(internalBackup);
router.route("/restore-internal-backup").get(isAdmin, restoreInternalBackup);
router.route("/external-backup").get(externalBackup);
router
    .route("/restore-external-backup")
    .post(isAdmin, upload.single("file"), restoreExternalBackup);
router.route("/:id").get(viewSingleBill);
router.route("/delete/:id").delete(isAdmin, deleteSingle);
router.route("/delete-all").delete(isAdmin, deleteAll);
router.route("/edit/:id").put(isWorker, editBill);

module.exports = router;
