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

router.route("/add").post(addBill);
router.route("/search-date").post(searchByDate);
router.route("/search-mobile").post(searchByMobile);
router.route("/search-name").post(searchByName);
router.route("/internal-backup").get(internalBackup);
router.route("/restore-internal-backup").get(restoreInternalBackup);
router.route("/external-backup").get(externalBackup);
router.route("/restore-external-backup").post(upload.single("file"), restoreExternalBackup);
router.route("/:id").get(viewSingleBill);
router.route("/delete/:id").delete(deleteSingle);
router.route("/delete-all").delete(deleteAll);
router.route("/edit/:id").put(editBill);

module.exports = router;
