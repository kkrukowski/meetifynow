const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  dates: [Number],
});

const Answer = mongoose.model("Answer", AnswerSchema);

const AppointmentSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true },
  meetName: { type: String, required: true },
  dates: [Number],
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  answers: [AnswerSchema],
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);

module.exports = { Appointment, Answer };
