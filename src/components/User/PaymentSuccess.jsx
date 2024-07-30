import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../../actions/orderAction";
import "./PaymentSuccess.css";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const PaymentSuccess = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const reference = queryParams.get("reference");
  const status = queryParams.get("status");
  const token = queryParams.get("token");

  const { user } = useSelector((state) => state.user);
  const cartItems = JSON.parse(localStorage.getItem("cartItems"));
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const deliveryInfo = JSON.parse(localStorage.getItem("shippingInfo"));

  useEffect(() => {
    if (status === "success" && reference && token) {
      handleCreateOrder(token);
    }
  }, [status, reference, token]);

  const handleCreateOrder = (token) => {
    const order = {
      deliveryInfo: {
        location: {
          type: "Point",
          coordinates: [deliveryInfo.longitude, deliveryInfo.latitude],
        },
        address: deliveryInfo.address,
        city: deliveryInfo.city,
        pincode: deliveryInfo.pincode,
        phone: deliveryInfo.phone,
      },
      orderItems: cartItems,
      paymentInfo: {
        id: reference,
        status: "paid",
      },
      itemPrice: orderInfo.subtotal,
      deliveryPrice: orderInfo.deliveryCharge,
      discount: orderInfo.discount,
      taxPrice: orderInfo.gst,
      totalPrice: orderInfo.total,
      token,
    };

    dispatch(createOrder(order));
    localStorage.removeItem("cartItems");
  };

  return (
    <div className="paymentSuccess-main">
      <IoIosCheckmarkCircleOutline size={90} color="green" />
      <p>Wow! Order placed successful</p>
      <span>Payment id {reference}</span>
      <Link to="/account/orders">View Order</Link>
    </div>
  );
};

export default PaymentSuccess;
