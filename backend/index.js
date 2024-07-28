const express = require("express");
const path = require("path");
require("dotenv").config();
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// middlewares
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.use(express.static(path.join(__dirname, "public")));

const PORT = 7684;

const productRoutes = require("./routes/products.routes");
const billRoutes = require("./routes/bills.routes");
const userRoutes = require("./routes/user.routes");

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/bills", billRoutes);
app.use("/api/v1/users", userRoutes);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public"));
});
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "public"));
});

// 404 handlers
app.post("*", (req, res) => {
    res.status(404).json({ status: 404, message: "Not Found", success: false });
});

require("./db/connectDB")()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`\n⚙️  Server is running on http://localhost:${PORT}\n`);
            console.log("Note: Don't close this window ☠️❌\n");
            // require("child_process").exec(`start http://localhost:${PORT}/`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection error...", err);
    });
