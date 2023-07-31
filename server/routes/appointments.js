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
    res.json(appointment);
  } catch {
    res.status(400).json({ message: "Invalid appointment" });
  }
});

// Create new appointment
router.post("/new", async (req, res) => {
  // check if id is unique
  try {
    const { name, availableDates } = req.body;

    //Validate name data
    if (!name) {
      return res
        .status(400)
        .json({ message: "Invalid or missing 'name' data" });
    } else if (typeof name !== "string") {
      return res.status(400).json({ message: "Invalid name data" });
    }

    // Validate date data
    if (!availableDates) {
      return res
        .status(400)
        .json({ message: "Invalid or missing 'availableDates' data" });
    } else {
      availableDates.forEach((date) => {
        if (!isNaN(date)) {
          return res.status(400).json({ message: "Invalid date data" });
        }
      });
    }

    const appointment = await Appointment.create({
      appointmentId: randomString.generate(7),
      name,
      availableDates,
    });
    res.status(200).json({ message: "New appointment added", appointment });
  } catch (err) {
    res.status(400).json({ message: "Invalid appointment" });
  }
});

// Make new answer
router.post("/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { username } = req.body;
    const answer = new Answer({ username });
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
