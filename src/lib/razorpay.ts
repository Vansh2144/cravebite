import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const isPlaceholder = !keyId || keyId.includes("yourkeyhere") || !keySecret || keySecret.includes("secrethere");

export const razorpayInstance = isPlaceholder
  ? null
  : new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

export const IS_MOCK_PAYMENT = isPlaceholder;
