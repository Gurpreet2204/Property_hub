import Order from '../models/order.model.js'; 
import Razorpay from 'razorpay';

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const createOrder = async (req, res) => {
    console.log('req--->',req.body);
  try {
    const { appointmentFees, status, orderId, Userid } = req.body;

    if (!appointmentFees) {
      return res.status(400).json({
        code: 400,
        message: "appointmentFees is required.",
      });
    }

    const options = {
      amount: appointmentFees * 100, 
      currency: "INR",
      receipt: orderId,
     
    };
    
    const order = await razorpayInstance.orders.create(options);
    console.log("Order created with Razorpay:", order); 

   
    const newOrder = new Order({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status || status,
      createdAt: new Date().toISOString(),
      userId: req.body.Userid
    });

    await newOrder.save();
    console.log("Order saved in MongoDB:", newOrder); 


    const responseData = {
      code: 200,
      message: "Order created successfully",
      data: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        createdAt: order.created_at,
        userID: req.body.Userid
      },
    };
    
    console.log("Response data sent to frontend:", responseData);
    return res.status(200).json(responseData);
    
  } catch(error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      code: 500,
      message: "Server error",
    });
  }
};


export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json({
      code: 200,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "Server error",
    });
  }
};
