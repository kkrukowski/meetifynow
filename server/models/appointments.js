const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  offline: [Date],
  online: [Date],
});

const Answer = mongoose.model("Answer", AnswerSchema);

const AppointmentSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true },
  name: { type: String, required: true },
  availableDates: [Date],
  answers: [AnswerSchema],
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);

module.exports = { Appointment, Answer };
