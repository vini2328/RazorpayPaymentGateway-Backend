import { instance } from "../server.js";
import crypto from "crypto"
import  {Payment}  from "../models/paymentModel.js";

export const checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
  });
};

export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
  req.body;

const body = razorpay_order_id + "|" + razorpay_payment_id;

const expectedSignature = crypto
  .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
  .update(body.toString())
  .digest("hex");

const isAuthentic = expectedSignature === razorpay_signature

if(isAuthentic){

  await Payment.create({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  
  res.redirect(`https://64ec9992854efe11cd3a5cb6--preeminent-palmier-34cdf4.netlify.app/paymentsuccess?reference=${razorpay_payment_id}`)

}else{
  res.status(400).json({
    success: false,
  });

}
  }
