const multer = require("multer");

const getExtension = (filename) => {
    const parts = filename.split(".");
    return parts[parts.length - 1];
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "." + getExtension(file.originalname));
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
