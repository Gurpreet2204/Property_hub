import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId:{type:String, required:true},
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status:{type: String, required: true},
  createdAt:{type: String, required:true},
  userId:{type:String, required:true},
  propertyId:{type:String, required:true}
  
});

const Order = mongoose.model('Order', orderSchema);

export default Order