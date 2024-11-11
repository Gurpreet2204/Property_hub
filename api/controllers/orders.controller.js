import Order from '../models/order.model.js'; 
import Razorpay from 'razorpay'; 

const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
  key_id: "rzp_test_0o4NhN2bWbS3HN",
//   key_secret: process.env.RAZORPAY_SECRET,
  key_secret:"57MWf0vaI3H0Q91FHOayWjK1",
});

export const createOrder = async (req, res) => {
  try {
    const { appointmentFees, status, orderId, createdAt } = req.body;

    const options = {
      amount: appointmentFees * 100, 
      currency: "INR",
      receipt: orderId, 
      notes: {
        status,
        createdAt,
      },
    };

    const order = await razorpayInstance.orders.create(options);

    const newOrder = new Order({
      orderId: order.id,
      amount: order.amount / 100, 
      currency: order.currency,
      status: order.status,
      createdAt: new Date().toISOString(),
    });

    await newOrder.save();

    return res.status(200).json({
      code: 200,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error(error);
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
