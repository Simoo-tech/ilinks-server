const express = require("express");
const cors = require("cors");
const connectDB = require("../config/ConnectDB");
require("dotenv").config();
const app = express();

// connect to Database
connectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("uploads"));
app.use(
  cors({
    origin: ["https://ilink.onrender.com", "http://localhost:5173"],
    methods: ["POST", "PUT", "DELETE", "GET"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/users"));
app.use("/api/ilinkData", require("./routes/ilinkData"));
app.use("/api/userIlink", require("./routes/userIlinkShow"));
app.use("/api/upload-files", require("./routes/uploadFile"));
//// verify email
app.post("/api/send-verify-email", require("./controllers/sendVerifyEmail"));

app.listen(process.env.PORT, () => {
  console.log("server started", process.env.PORT);
});
