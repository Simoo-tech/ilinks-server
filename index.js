const express = require("express");
const cors = require("cors");
const connectDB = require("./config/ConnectDB");
require("dotenv").config();
const app = express();

// connect to Database
connectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("upload"));

app.use(
  cors({
    origin: ["https://ilink.onrender.com", "http://localhost:5173"],
    methods: ["POST", "PUT", "DELETE", "GET"],
    credentials: true,
    allowedHeaders: ["access_token"],
  })
);

// Request headers you wish to allow
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Headers", "*");
  // Pass to next layer of middleware
  next();
});

// Routes
app.get("/api", (req, res) => {
  res.status(200).send("Hello, welcome to ilinks server");
});
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/user", require("./src/routes/users"));
app.use("/api/ilinkData", require("./src/routes/ilink"));
app.use("/api/userIlink", require("./src/routes/userIlinkShow"));
app.use("/api/upload-files", require("./src/routes/uploadFile"));
//// verify email
app.post(
  "/api/send-verify-email",
  require("./src/controllers/sendVerifyEmail")
);

app.listen(process.env.PORT, () => {
  console.log("server started", process.env.PORT);
});
