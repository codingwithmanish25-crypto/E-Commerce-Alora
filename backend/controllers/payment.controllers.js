import razorpay from "../config/razorpay.js";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";

// @desc    Create a new Razorpay Order
// @route   POST /api/payments/create-order
export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        
        if (!amount) {
            return res.status(400).json({ error: "Amount is required" });
        }

        const options = {
            amount: amount * 100, // Razorpay takes amount in paisa
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        
        res.status(200).json({
            order: order,
            razorpay_key_id: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/verify-payment
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const secret = process.env.RAZORPAY_KEY_SECRET;

        const isValid = validateWebhookSignature(
            `${razorpay_order_id}\vert{}${razorpay_payment_id}`,
            razorpay_signature,
            secret
        );

        if (isValid) {
            res.status(200).json({ status: "success", message: "Payment Verified Successfully" });
        } else {
            res.status(400).json({ status: "failure", message: "Invalid payment signature" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Test connection status
// @route   GET /api/payments/test-connect
export const testConnection = (req, res) => {
    res.json({ message: "Haan bhai! Backend se connection ekdum mast chal raha hai!" });
};