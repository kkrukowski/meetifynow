const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

const mongoose = require("mongoose");
require("dotenv").config();

const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");

// Database
mongoose.connect(process.env.DB_CONN_URI);

// App
const corsOptions = {
  origin: process.env.CLIENT_URI,
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// Router
const appointments = require("./routes/appointments");
app.use("/meet/", appointments);

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

export default app;
