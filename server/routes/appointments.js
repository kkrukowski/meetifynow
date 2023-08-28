const { time } = require("console");
const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Appointment = require("../models/appointments").Appointment;
const Answer = require("../models/appointments").Answer;

const randomString = require("randomstring");
const moment = require("moment");

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
  console.log("New appointment");
  // check if id is unique
  try {
    const { meetName, dates, startTime, endTime } = req.body;

    console.log(req.body);

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
    res.status(200).json({ message: "New appointment added", newMeet });
  } catch (err) {
    res.status(400).json({ message: "Invalid appointment" });
  }
});

// Make new answer
router.post("/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { username, dates } = req.body;
    const answer = new Answer({ username, dates });
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
