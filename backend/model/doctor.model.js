const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema(
  {
    name: { type: String, text: true },
    image: String,
    specialization: String,
    experience: Number,
    location: String,
    date: String,
    slots: Number,
    fee: Number,
  },
  {
    versionKey: false,
  }
);

const DoctorModel = mongoose.model("doctors", doctorSchema);

module.exports = { DoctorModel };
