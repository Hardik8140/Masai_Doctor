const express = require("express");
const { DoctorModel } = require("../model/doctor.model");

const doctorRouter = express.Router();

doctorRouter.post("/appointments", async (req, res) => {
  const payload = req.body;

  try {
    const doc = new DoctorModel(payload);
    await doc.save();
    res.status(200).json({ msg: "New appointment add successful!" });
  } catch (error) {}
});

doctorRouter.get("/", async (req, res) => {
  const { specialization, sort, search } = req.query;

  let query = {};

  if (specialization) {
    query.specialization = specialization;
  }
  if (search) {
    query.$text = { $search: search, $caseSensitive: false };
  }

  try {
    let doc = DoctorModel.find(query);

    if (sort === "date") {
      doc = doc.sort({ date: 1 });
    }

    const result = await doc.exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: "Internal server error" });
  }
});

doctorRouter.patch("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const doc = await DoctorModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!doc) {
      return res.status(404).json({ error: "Doctor not Found" });
    }
    res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

doctorRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await DoctorModel.findByIdAndDelete(id);
    if (!doc) {
      return res.status(404).json({ error: "Doctor not Found" });
    }
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = { doctorRouter };
