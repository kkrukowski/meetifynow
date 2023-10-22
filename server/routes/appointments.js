const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Appointment = require("../models/appointments").Appointment;
const Answer = require("../models/appointments").Answer;
const DateData = require("../models/appointments").DateData;

const randomString = require("randomstring");

// Get all appointments
router.get("/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findOne({
      appointmentId,
    });

    if (appointment === null) {
      res.status(400).json({ message: "Appointment not found" });
    } else {
      res.status(200).json(appointment);
    }
  } catch {
    res.status(400).json({ message: "Invalid appointment" });
  }
});

// Create new appointment
router.post("/new", async (req, res) => {
  // check if id is unique
  try {
    const { meetName, dates, startTime, endTime } = req.body;

    //Validate name data
    if (!meetName) {
      return res
        .status(400)
        .json({ message: "Invalid or missing 'name' data" });
    } else if (typeof meetName !== "string") {
      return res.status(400).json({ message: "Invalid name data" });
    }

    // Validate date data
    if (!dates) {
      return res
        .status(400)
        .json({ message: "Invalid or missing 'availableDates' data" });
    }

    const newMeet = new Appointment({
      appointmentId: randomString.generate(7),
      meetName,
      dates,
      startTime,
      endTime,
    });
    await newMeet.save();
    return res.status(200).json({ message: "New appointment added", newMeet });
  } catch (err) {
    console.warn(err);
    return res.status(400).json({ message: "Invalid appointment" });
  }
});

// Middleware for request validation
const validateAnswerData = [
  check("username").isString().notEmpty(),
  check("dates").isArray().notEmpty(),
  check("dates.*.date").isNumeric(),
  check("dates.*.online").isBoolean(),
];

// Make new answer
router.post("/:appointmentId", validateAnswerData, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { appointmentId } = req.params;
    const { username, dates } = req.body;

    // Creating dates array
    let datesArray = [];
    dates.forEach((dateItem) => {
      console.log(dateItem);
      const meetDate = dateItem.date;
      const isOnline = dateItem.online;
      const data = new DateData({
        meetDate,
        isOnline,
      });
      datesArray.push(data);
    });

    console.log(datesArray);

    const answer = new Answer({ username, datesArray });
    await Appointment.findOneAndUpdate(
      { appointmentId },
      { $push: { answers: answer } }
    ).then((result, err) => {
      if (err) res.status(400).json({ message: "Invalid answer", err: err });
      res.json({ message: "New answer added" });
    });
  } catch (err) {
    console.warn(err);
    res.status(400).json({ message: "Appointment not found", err: err });
  }
});

module.exports = router;
