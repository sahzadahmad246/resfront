import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { myOrders } from "../../actions/orderAction";
import { toast } from "react-toastify";
import vegIcon from "../../images/veg-icon.png";
import nonVegIcon from "../../images/non-veg-icon.png";
import Loader from "../Layout/Loader";
import "../../components/Pages/Home.css"; // Assuming your CSS styles for both sections are here

const LastOrderProducts = () => {
  const dispatch = useDispatch();
  const { loading, error, orders } = useSelector((state) => state.myOrders);
  const [lastOrderProducts, setLastOrderProducts] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    dispatch(myOrders());
  }, [dispatch]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      const lastOrder = orders[orders.length - 1]; // Get last order details
      setLastOrderProducts(lastOrder.orderItems); // Set products from last order
    }
    if (error) {
      toast.error(error);
    }
  }, [orders, error]);

  return (
    <div className="last-order-products">
      <h2 className="fw-bold text-center p-3">Products from Your Last Order</h2>
      {loading ? (
        <Loader />
      ) : lastOrderProducts.length === 0 ? (
        <p className="text-center">You have not placed any orders yet.</p>
      ) : (
        <div className="relative">
          <div
            ref={sliderRef}
            className="product-slider d-flex overflow-auto random-products"
            style={{
              scrollBehavior: "smooth",
              overflowX: "auto",
              whiteSpace: "nowrap", // Ensures that the items are arranged horizontally
            }}
          >
            {lastOrderProducts.map((item) => (
              <div
                key={item.product}
                className="product-card"
                style={{ display: "inline-block", marginRight: "10px" }} // Ensure products are displayed in line
              >
                <img
                  src={item.image.url || "/placeholder.svg"}
                  alt={item.name}
                  className="product-image"
                />
                <Link to={`/product/${item.product}`}>
                  <div className="d-flex align-items-center mb-2">
                    <h3 className="me-2">{item.name}</h3>
                    {item.foodType === "Veg" ? (
                      <img
                        src={vegIcon}
                        alt="Veg Icon"
                        style={{ width: "20px", height: "20px" }}
                      />
                    ) : item.foodType === "Non Veg" ? (
                      <img
                        src={nonVegIcon}
                        alt="Non Veg Icon"
                        style={{ width: "20px", height: "20px" }}
                      />
                    ) : null}
                  </div>
                </Link>
                <div className="d-flex justify-between align-items-center w-full">
                  <p className="fw-bold text-dark">₹{item.price}</p>
                  <button className="random-add-btn bg-danger rounded-lg">
                    Add Again
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LastOrderProducts;
