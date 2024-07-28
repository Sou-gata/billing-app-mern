const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/users.controller");
const { isAdmin, isWorker } = require("../middleware/auth.middleware");

router.route("/signup").post(isAdmin, signUp);
router.route("/create-super-user").post(createSuperUser);
router.route("/super-user-number").get(getSuperUsersNumber);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/verify").get(verify);
router.route("/all").get(allUsers);
router.route("/user/:id").get(singleUser);
router.route("/change-password").post(isWorker, changePassword);
router.route("/delete/:id").delete(isAdmin, deleteUser);
router.route("/edit").post(isAdmin, editUser);
router.route("/internal-backup").get(internalBackup);
router.route("/external-backup").get(externalBackup);
router.route("/restore-internal").post(isAdmin, restoreInternal);
router.route("/restore-external").post(isAdmin, restoreExternal);

module.exports = router;
