import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: String, required: true },
  propertyId: mongoose.Schema.Types.ObjectId,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
const Appointment = mongoose.model("UserAppointments", appointmentSchema);

export default Appointment;
