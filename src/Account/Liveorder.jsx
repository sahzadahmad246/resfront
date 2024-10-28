import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import homeBanner from ".././images/homeBanner.png";
import "./Liveorder.css";
const LiveOrder = ({ liveOrders, showLiveOrder }) => {
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const liveOrderRef = useRef(null);

  if (!liveOrders || liveOrders.length === 0) return null;

  const handlePrev = () => {
    setCurrentOrderIndex((prevIndex) =>
      prevIndex === 0 ? liveOrders.length - 1 : prevIndex - 1
    );
  };
  console.log("liveorders");
  const handleNext = () => {
    setCurrentOrderIndex((prevIndex) =>
      prevIndex === liveOrders.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentOrder = liveOrders[currentOrderIndex];

  return (
    <div
      ref={liveOrderRef}
      className={`live-order-container ${showLiveOrder ? "visible" : "hidden"}`}
    >
      <div className="order-content">
        {liveOrders.length > 1 && (
          <button onClick={handlePrev} className="order-nav-button">
            &lt;
          </button>
        )}

        <div className="order-info">
          <img
            src={currentOrder.orderItems[0].image.url || homeBanner}
            alt={currentOrder.orderItems[0].name}
            className="order-image"
          />
          <div className="live-order-details">
            <h3>{currentOrder.orderItems[0].name}</h3>
            <span className="text-success">your order is {currentOrder.orderStatus}</span>
          </div>
        </div>
        <Link
          to={`/account/orders/${currentOrder._id}`}
          className="view-order-link"
        >
          View Order
        </Link>

        {liveOrders.length > 1 && (
          <button onClick={handlePrev} className="order-nav-button">
            &gt;
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveOrder;
