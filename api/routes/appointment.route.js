// filepath: d:\projects\PropertyHub\api\routes\appointment.routes.js
import { getUserAppointments } from "../controllers/appointment.controller.js";
import express from "express";
const router = express.Router();

router.get("/my-appointments/get", getUserAppointments);

export default router;