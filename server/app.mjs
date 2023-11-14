import express from "express";
const app = express();
const PORT = process.env.PORT || 5000;

import "dotenv/config";
import mongoose from "mongoose";

import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";

// Database
mongoose.connect(process.env.DB_CONN_URI);

// App
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.options("*", cors(corsOptions));

// Router
import appointments from "./routes/appointments.js";
app.use("/meet/", appointments);

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

export default app;
