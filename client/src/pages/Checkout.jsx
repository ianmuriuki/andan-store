import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  CreditCard,
  MapPin,
  Phone,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Smartphone,
  Loader2,
  Shield,
  Clock,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { orderService } from "../services/orderService";
import { usePayment } from "../hooks/usePayment";

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  postalCode: yup.string().required("Postal code is required"),
  paymentMethod: yup.string().required("Payment method is required"),
  mpesaNumber: yup.string().when("paymentMethod",
     {
    is: "mpesa",
    then: (schema) => schema.required("M-Pesa number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { initiateMpesaPayment, isProcessing: isPaying } = usePayment();

  const subtotal = getCartTotal();
  const deliveryFee = subtotal >= 2000 ? 0 : 100;
  const tax = subtotal * 0.16;
  const total = subtotal + deliveryFee + tax;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      paymentMethod: "mpesa",
    },
  });

  const paymentMethod = watch("paymentMethod");

  const steps = [
    { id: 1, title: "Delivery Information", icon: MapPin },
    { id: 2, title: "Payment Method", icon: CreditCard },
    { id: 3, title: "Review Order", icon: CheckCircle },
  ];

  const onSubmit = async (data) => {
    console.log("Submitting order", data, "Current step:", currentStep);
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      setTimeout(() => {
        console.log("Advanced to step:", currentStep + 1);
      }, 0);
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create the order in the backend
      // const orderPayload = {
      //   items: items.map(item => ({
      //     product: item._id || item.id,
      //     name: item.name,
      //     price: item.price,
      //     quantity: item.quantity,
      //     unit: item.unit,
      //     image: item.image,
      //   })),
      //   shippingAddress: {
      //     firstName: data.firstName,
      //     lastName: data.lastName,
      //     email: data.email,
      //     phone: data.phone,
      //     street: data.address,
      //     city: data.city,
      //     state: "", // You can add a state field if you collect it
      //     zipCode: data.postalCode,
      //     country: "Kenya",
      //     instructions: "", // Add if you collect delivery instructions
      //   },
      //   paymentInfo: {
      //     method: "mpesa",
      //     amount: total,
      //     currency: "KES",
      //     status: "pending",
      //   },
      //   itemsPrice: subtotal,
      //   taxPrice: tax,
      //   shippingPrice: deliveryFee,
      //   totalPrice: total,
      //   notes: "", // Add if you collect order notes
      // };

      const orderPayload = {
        items: items.map((item) => ({
          product: item._id || item.id, // <--- FIXED
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit,
          image: item.image,
        })),
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          street: data.address,
          city: data.city,
          state: data.state, // <--- FIXED
          zipCode: data.postalCode,
          country: "Kenya",
          instructions: data.instructions || "",
        },
        paymentInfo: {
          method: "mpesa",
          amount: total,
          currency: "KES",
          status: "pending",
        },
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: deliveryFee,
        totalPrice: total,
        notes: data.notes || "",
      };

      const orderRes = await orderService.createOrder(orderPayload);
      const orderId =
        orderRes.data?._id || orderRes.data?.id || orderRes._id || orderRes.id;

      // 2. Initiate M-Pesa payment
      await initiateMpesaPayment(orderId, data.mpesaNumber);

      // 3. Clear cart and redirect
      clearCart();
      toast.success("Order placed and payment initiated!");
      navigate("/orders");
    } catch (error) {
      console.error("Order creation error:", error.response?.data || error);
      toast.error(
        error.message || "Order or payment failed. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  console.log("Checkout component rendered. Current step:", currentStep);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">
            No items in cart
          </h2>
          <p className="text-neutral-600 mb-6">
            Add some items to your cart before checkout.
          </p>
          <button onClick={() => navigate("/products")} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  console.log("Current form errors:", errors);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-main section-padding">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-heading text-4xl font-bold text-neutral-800 mb-4">
            Checkout
          </h1>
          <p className="text-neutral-600 text-xl">
            Complete your order in just a few steps
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          className="card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "bg-primary-500 text-white"
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-semibold ${
                          isActive
                            ? "text-primary-500"
                            : isCompleted
                            ? "text-green-500"
                            : "text-neutral-600"
                        }`}
                      >
                        Step {step.id}
                      </p>
                      <p className="text-sm text-neutral-600">{step.title}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-8 ${
                        currentStep > step.id
                          ? "bg-green-500"
                          : "bg-neutral-200"
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {/* Step 1: Delivery Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    className="card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-heading text-2xl font-bold text-neutral-800 mb-6">
                      Delivery Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          First Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                          <input
                            type="text"
                            {...register("firstName")}
                            className={`input-field pl-10 ${
                              errors.firstName ? "border-error-500" : ""
                            }`}
                            placeholder="First name"
                          />
                        </div>
                        {errors.firstName && (
                          <p className="text-error-500 text-sm mt-1">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Last Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                          <input
                            type="text"
                            {...register("lastName")}
                            className={`input-field pl-10 ${
                              errors.lastName ? "border-error-500" : ""
                            }`}
                            placeholder="Last name"
                          />
                        </div>
                        {errors.lastName && (
                          <p className="text-error-500 text-sm mt-1">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                          <input
                            type="email"
                            {...register("email")}
                            className={`input-field pl-10 ${
                              errors.email ? "border-error-500" : ""
                            }`}
                            placeholder="Email address"
                          />
                        </div>
                        {errors.email && (
                          <p className="text-error-500 text-sm mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                          <input
                            type="tel"
                            {...register("phone")}
                            className={`input-field pl-10 ${
                              errors.phone ? "border-error-500" : ""
                            }`}
                            placeholder="+254 700 123 456"
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-error-500 text-sm mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Delivery Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-neutral-400 w-5 h-5" />
                        <textarea
                          {...register("address")}
                          className={`input-field pl-10 h-24 resize-none ${
                            errors.address ? "border-error-500" : ""
                          }`}
                          placeholder="Enter your full delivery address"
                        />
                      </div>
                      {errors.address && (
                        <p className="text-error-500 text-sm mt-1">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          {...register("city")}
                          className={`input-field ${
                            errors.city ? "border-error-500" : ""
                          }`}
                          placeholder="City"
                        />
                        {errors.city && (
                          <p className="text-error-500 text-sm mt-1">
                            {errors.city.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          {...register("postalCode")}
                          className={`input-field ${
                            errors.postalCode ? "border-error-500" : ""
                          }`}
                          placeholder="00100"
                        />
                        {errors.postalCode && (
                          <p className="text-error-500 text-sm mt-1">
                            {errors.postalCode.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <motion.button
                        type="button"
                        className="btn-primary"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={async () => {
                          const valid = await handleSubmit(() => true)();
                          if (Object.keys(errors).length === 0) {
                            setCurrentStep(currentStep + 1);
                            setTimeout(() => {
                              console.log("Advanced to step:", currentStep + 1);
                            }, 0);
                          } else {
                            console.log("Validation errors:", errors);
                            toast.error(
                              "Please fix the errors above before continuing."
                            );
                          }
                        }}
                      >
                        Continue to Payment
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Payment Method */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    className="card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-heading text-2xl font-bold text-neutral-800 mb-6">
                      Payment Method
                    </h2>

                    <div className="space-y-4 mb-8">
                      {/* M-Pesa Option */}
                      <motion.div
                        className={`border-2 rounded-card p-4 cursor-pointer transition-colors ${
                          paymentMethod === "mpesa"
                            ? "border-primary-500 bg-primary-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                        onClick={() => setValue("paymentMethod", "mpesa")}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center space-x-4">
                          <input
                            type="radio"
                            {...register("paymentMethod")}
                            value="mpesa"
                            className="w-4 h-4 text-primary-500"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-500 rounded-card flex items-center justify-center">
                              <Smartphone className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-neutral-800">
                                M-Pesa
                              </h3>
                              <p className="text-sm text-neutral-600">
                                Pay with your mobile money
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Credit Card Option (Disabled) */}
                      <div className="border-2 border-neutral-200 rounded-card p-4 opacity-50">
                        <div className="flex items-center space-x-4">
                          <input
                            type="radio"
                            disabled
                            className="w-4 h-4 text-primary-500"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-500 rounded-card flex items-center justify-center">
                              <CreditCard className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-neutral-800">
                                Credit/Debit Card
                              </h3>
                              <p className="text-sm text-neutral-600">
                                Coming soon
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* M-Pesa Number Input */}
                    {paymentMethod === "mpesa" && (
                      <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          M-Pesa Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                          <input
                            type="tel"
                            {...register("mpesaNumber")}
                            className={`input-field pl-10 ${
                              errors.mpesaNumber ? "border-error-500" : ""
                            }`}
                            placeholder="254700123456"
                          />
                        </div>
                        {errors.mpesaNumber && (
                          <p className="text-error-500 text-sm mt-1">
                            {errors.mpesaNumber.message}
                          </p>
                        )}
                        <p className="text-sm text-neutral-600 mt-2">
                          You will receive an M-Pesa prompt on this number
                        </p>
                      </motion.div>
                    )}

                    <div className="flex justify-between">
                      <motion.button
                        type="button"
                        onClick={goToPreviousStep}
                        className="btn-ghost"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </motion.button>
                      <motion.button
                        type="submit"
                        className="btn-primary"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Review Order
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review Order */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    className="card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-heading text-2xl font-bold text-neutral-800 mb-6">
                      Review Your Order
                    </h2>

                    {/* Order Items */}
                    <div className="space-y-4 mb-8">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-card"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-card"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-neutral-800">
                              {item.name}
                            </h3>
                            <p className="text-sm text-neutral-600">
                              {item.quantity} × KSH {item.price}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-neutral-800">
                              KSH {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Information Summary */}
                    <div className="bg-neutral-50 rounded-card p-4 mb-8">
                      <h3 className="font-semibold text-neutral-800 mb-3">
                        Delivery Information
                      </h3>
                      <div className="text-sm text-neutral-600 space-y-1">
                        <p>
                          {watch("firstName")} {watch("lastName")}
                        </p>
                        <p>{watch("email")}</p>
                        <p>{watch("phone")}</p>
                        <p>{watch("address")}</p>
                        <p>
                          {watch("city")}, {watch("postalCode")}
                        </p>
                      </div>
                    </div>

                    {/* Payment Method Summary */}
                    <div className="bg-neutral-50 rounded-card p-4 mb-8">
                      <h3 className="font-semibold text-neutral-800 mb-3">
                        Payment Method
                      </h3>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Smartphone className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-800">M-Pesa</p>
                          <p className="text-sm text-neutral-600">
                            {watch("mpesaNumber")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <motion.button
                        type="button"
                        onClick={goToPreviousStep}
                        className="btn-ghost"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={isProcessing || isPaying}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{
                          scale: isProcessing || isPaying ? 1 : 1.02,
                        }}
                        whileTap={{
                          scale: isProcessing || isPaying ? 1 : 0.98,
                        }}
                      >
                        {isProcessing || isPaying ? (
                          <div className="flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing Payment...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>Place Order</span>
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="card sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-heading text-2xl font-bold text-neutral-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-semibold text-neutral-800">
                    KSH {subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Delivery Fee</span>
                  <span className="font-semibold text-neutral-800">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `KSH ${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Tax (16%)</span>
                  <span className="font-semibold text-neutral-800">
                    KSH {tax.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-neutral-800">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-primary-500">
                      KSH {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="space-y-3 pt-6 border-t border-neutral-200">
                <div className="flex items-center space-x-3 text-sm text-neutral-600">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure payment with M-Pesa</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-neutral-600">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>1-2 hour delivery in Nairobi</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-neutral-600">
                  <CheckCircle className="w-4 h-4 text-primary-500" />
                  <span>100% satisfaction guarantee</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
