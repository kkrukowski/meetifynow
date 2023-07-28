const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Appointment = require("../models/appointments").Appointment;
const Answer = require("../models/appointments").Answer;

const randomString = require("randomstring");

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
  try {
    const { name } = req.body;
    const appointment = await Appointment.create({
      appointmentId: randomString.generate(7),
      name,
    });
  } catch {
    res.status(400).json({ message: "Invalid appointment" });
  }
  console.log(req.body);
  res.json({ message: "New appointment added" });
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
