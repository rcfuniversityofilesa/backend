const SerialCounter = require("../models/serial.model");

async function generateAdminSerial() {
  const counter = await SerialCounter.findOneAndUpdate(
    { role: "exco" },
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );

  const padded = String(counter.count).padStart(4, "0");
  return `EXCO/${padded}`;
}

module.exports = generateAdminSerial
