const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

const mongoose = require("mongoose");
require("dotenv").config();

const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");

// Database
mongoose
  .connect(process.env.DB_CONN_URI)
  .then(() => console.log("DB Connected"))
  .catch((err: any) => console.log(err));

// App
app.use(express.json());
app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// Router
app.get("/", (res: any) => {
  res.send("Hello World!");
});

const appointments = require("./routes/appointments");
app.use("/meet/", appointments);

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
