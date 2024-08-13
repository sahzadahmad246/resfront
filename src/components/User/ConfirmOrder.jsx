import React, { useState } from "react";
import CheckoutSteps from "./CheckoutSteps";
import "./ConfirmOrder.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { createOrder } from "../../actions/orderAction";

const ConfirmOrder = () => {
  const { user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const subtotal = Math.round(
    cartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
  );
  console.log("subtotl", subtotal)
  const totalQuantity = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const deliveryCharge = subtotal > 500 ? 0 : 40;
  const discount = 10;
  const gst = Math.round(subtotal * 0.05); // 5% GST
  const total = Math.round(subtotal + deliveryCharge - discount + gst);

  const proceedToPay = async () => {
    setLoading(true);
    const paymentData = {
      subtotal,
      deliveryCharge,
      gst,
      discount,
      total,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(paymentData));

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    try {
      const {
        data: { key },
      } = await axios.get("http://localhost:5000/api/v1/getkey", config);

      const {
        data: { order },
      } = await axios.post(
        "http://localhost:5000/api/v1/process/payment",
        { total },
        config
      );

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Thai Chilli China",
        description: "For order from Thai Chilli China",
        image: "https://avatars.githubusercontent.com/u/124631079?s=400&v=4",
        order_id: order.id,
        callback_url: "http://localhost:5000/api/v1/paymentVerification",
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        notes: {
          address: "Hiranandani Estate",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const razor = new window.Razorpay(options);
      razor.open();
      setLoading(false);
    } catch (error) {
      console.error("Error processing payment:", error);
      setLoading(false);
    }
  };

  const placeCODOrder = async () => {
    setLoading(true);
    const paymentData = {
      subtotal,
      deliveryCharge,
      gst,
      discount,
      total,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(paymentData));
    navigate("/order/creation");
  };

  return (
    <>
      <div className="checkout-stepper">
        <CheckoutSteps activeStep={1} />
      </div>
      <div className="confirm-order-main">
        <div className="confirm-order-left">
          <div className="confirm-shipping-info">
            <div className="shipping-info-top">
              <h1>Delivering to</h1>
            </div>

            <div className="shipping-info-main">
              <p>
                <i className="px-2 fa-solid fa-user"></i>
                {user && user.name}
              </p>

              <p>
                <i className="px-2 fa-solid fa-phone"></i>
                {user && user.phone}
              </p>
              <p>
                <i className="px-2 fa-solid fa-envelope"></i>
                {user && user.email}
              </p>
              <p>
                <i className="px-2 fa-solid fa-home"></i>
                {(user.deliveryInfo && user.deliveryInfo.address) ||
                  "No address found"}
              </p>
              <p>
                <i className="px-2 fa-solid fa-city"></i>
                {(user.deliveryInfo && user.deliveryInfo.city) ||
                  "No city found"}
              </p>
              <p>
                <i className="px-2 fa-brands fa-usps"></i>
                {(user.deliveryInfo && user.deliveryInfo.pincode) ||
                  "No pincode found"}
              </p>
            </div>
          </div>
          <div className="confirm-cartItem-info">
            <h1>Items in your cart</h1>
            <div className="confirm-cartItem">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item.product} className="cartItem-in-confirm">
                    <div className="name-img-in-confirm">
                      <img src={item.image.url} alt={item.name} />
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </div>
                    <span>
                      {item.quantity} X {item.price} =
                      <b> {item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="confirm-order-right">
          <div className="order-summary">
            <h1>Order summary</h1>
            <div className="price-info">
              <h2>Subtotal ({totalQuantity} items)</h2>
              <h2>{`₹${subtotal}`}</h2>
            </div>
            <div className="price-info">
              <h2>Delivery Charge</h2>
              <h2>
                {deliveryCharge === 0 ? (
                  <>
                    <span className="line-through">₹40</span>{" "}
                    <span className="text-success">FREE</span>
                  </>
                ) : (
                  `₹${deliveryCharge}`
                )}
              </h2>
            </div>
            <div className="price-info">
              <h2>GST @5%</h2>
              <h2>{`₹${gst}`}</h2>
            </div>
            <div className="price-info">
              <h2>Discount</h2>
              <h2>{`₹${discount}`}</h2>
            </div>
            <div className="total-price-info">
              <h2 className="font-bold">Grand Total</h2>
              <h2 className="font-bold">{`₹${total}`}</h2>
            </div>
            <button
              className="proceed-to-pay"
              onClick={proceedToPay}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : `Pay  ₹${total} Online`}
            </button>
            <button
              className="proceed-to-pay bg-success"
              onClick={placeCODOrder}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : `Pay  ₹${total} on delivery`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
