import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import crypto from "crypto";
import cors from "cors";
import path from "path";
import { body, validationResult } from "express-validator";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import orderRouter from "./routes/order.route.js";
import appointmentRouter from "./routes/appointment.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/orders", orderRouter);
app.use("/api/appointments", appointmentRouter);

const Appointment = mongoose.model("Appointment", {
  name: String,
  email: String,
  phone: String,
  date: Date,
  time: String,
  propertyId: mongoose.Schema.Types.ObjectId,
});

app.post("/api/checkAvailability", async (req, res) => {
  const { name, email, phone, selectedDate, selectedTime, propertyId } =
    req.body;
  try {
    const newAppointment = new Appointment({
      name,
      email,
      phone,
      date: new Date(selectedDate),
      time: selectedTime,
      propertyId,
    });
    await newAppointment.save();

    const overlappingAppointments = await Appointment.find({
      _id: { $ne: newAppointment._id },
      propertyId,
      date: newAppointment.date,
      time: selectedTime,
    });

    if (overlappingAppointments.length > 0) {
      await Appointment.findByIdAndRemove(newAppointment._id);
      return res.status(409).json({
        message: "Time slot not available. Please choose another time.",
      });
    }

    return res.status(200).json({ message: "Time slot is available." });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post(
  "/api/verify",
    body("response").isObject(),
    body("response.razorpay_order_id").isString().notEmpty(),
    body("response.razorpay_payment_id").isString().notEmpty(),
    body("response.razorpay_signature").isString().notEmpty(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body.response;
  
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
  
      if (generatedSignature === razorpay_signature) {
        return res.status(200).json({ code: 200, message: "Signature is valid" });
      } else {
        return res.status(500).json({ code: 500, message: "Invalid signature" });
      }
    }
  );

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001!");
});
