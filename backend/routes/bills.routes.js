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
} = require("../controllers/bills.controller");

router.route("/add").post(addBill);
router.route("/search-date").post(searchByDate);
router.route("/search-mobile").post(searchByMobile);
router.route("/search-name").post(searchByName);
router.route("/internal-backup").get(internalBackup);
router.route("/restore-internal-backup").get(restoreInternalBackup);
// router.route("/external-backup").get(externalBackup);
router.route("/:id").get(viewSingleBill);
// router.route("/edit/:id").post(editBill);
router.route("/delete/:id").delete(deleteSingle);
router.route("/delete-all").delete(deleteAll);

module.exports = router;
