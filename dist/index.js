const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
mongoose
    .connect(process.env.DB_CONN_URI)
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log(err));
//# sourceMappingURL=index.js.map