import express from "express";
import { createOrder, getOrders } from "../controllers/orders.controller.js";

const router = express.Router();

router.get('/get', getOrders)
router.post('/create', createOrder)

export default router;
