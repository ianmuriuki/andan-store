import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unit: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const shippingAddressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, default: "Kenya" },
  instructions: { type: String },
});

const paymentInfoSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ["mpesa", "card", "cash"],
    required: true,
  },
  transactionId: String,
  mpesaReceiptNumber: String,
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: "KES",
  },
  paidAt: Date,
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    paymentInfo: {
      type: paymentInfoSchema,
      required: true,
    },
    itemsPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    taxPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    deliveryDate: Date,
    estimatedDelivery: {
      type: Date,
      required: true,
    },
    notes: String,
    trackingNumber: String,
    cancelReason: String,
    refundAmount: {
      type: Number,
      min: 0,
    },
    refundReason: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ "paymentInfo.status": 1 });
orderSchema.index({ createdAt: -1 });

// Method to generate order number
orderSchema.methods.generateOrderNumber = function () {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `ORD${year}${month}${day}${random}`;
};

// Method to calculate totals
orderSchema.methods.calculateTotals = function () {
  this.itemsPrice = this.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Calculate tax (16% VAT in Kenya)
  this.taxPrice = this.itemsPrice * 0.16;

  // Calculate shipping (free for orders over 2000 KES)
  this.shippingPrice = this.itemsPrice >= 2000 ? 0 : 100;

  this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
};

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function () {
  return ["pending", "confirmed"].includes(this.status);
};

// Method to check if order can be refunded
orderSchema.methods.canBeRefunded = function () {
  return (
    ["delivered"].includes(this.status) &&
    this.paymentInfo.status === "completed"
  );
};

// Pre-save middleware to generate order number and calculate totals
orderSchema.pre("save", function (next) {
  if (this.isNew && !this.orderNumber) {
    this.orderNumber = this.generateOrderNumber();
  }

  if (this.isModified("items") || this.isNew) {
    this.calculateTotals();
  }

  // Set estimated delivery (1-2 days for Nairobi, 3-5 days for other areas)
  if (this.isNew) {
    const deliveryDays =
      this.shippingAddress.city.toLowerCase() === "nairobi" ? 2 : 5;
    this.estimatedDelivery = new Date(
      Date.now() + deliveryDays * 24 * 60 * 60 * 1000
    );
  }

  next();
});

// Post-save middleware to update product sales count
orderSchema.post("save", async function (doc) {
  if (doc.status === "delivered" && doc.isModified("status")) {
    const { Product } = await import("./Product.js");

    for (const item of doc.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { salesCount: item.quantity },
      });
    }
  }
});

export const Order = mongoose.model("Order", orderSchema);
