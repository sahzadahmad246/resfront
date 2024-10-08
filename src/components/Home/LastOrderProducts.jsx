import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { myOrders } from "../../actions/orderAction";
import { addItemsToCart } from "../../actions/cartAction";
import { toast } from "react-toastify";
import vegIcon from "../../images/veg-icon.png";
import nonVegIcon from "../../images/non-veg-icon.png";
import Loader from "../Layout/Loader";
import "../../components/Pages/Home.css";

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
      const lastOrder = orders[orders.length - 1];
      setLastOrderProducts(lastOrder.orderItems);
    }
  }, [orders]);

  const handleAddToCart = (productId) => {
    dispatch(addItemsToCart(productId, 1));
    toast.success("Item added to cart");
  };

  if (loading) return <Loader />; // Show loader while loading

  if (error) {
    toast.error(error); // Show error message if there's an error
    return null;
  }

  return (
    <div className="last-order-products">
      <h2 className="fw-bold text-center p-3">Last Order Products</h2>
      <div className="product-grid">
        {lastOrderProducts.map((product) => (
          <div key={product._id} className="product-card">
            <img
              src={product.image.url} // Assuming the product has an image property
              alt={product.name}
            />
            <Link to={`/product/${product._id}`}>
              <span className="d-flex align-items-center">
                <h3 className="me-2">{product.name}</h3>
                {product.foodType === "Veg" ? (
                  <img
                    src={vegIcon}
                    alt="Veg Icon"
                    style={{ width: "20px", height: "20px" }}
                  />
                ) : product.foodType === "Non Veg" ? (
                  <img
                    src={nonVegIcon}
                    alt="Non Veg Icon"
                    style={{ width: "20px", height: "20px" }}
                  />
                ) : null}
              </span>
            </Link>
            <span className="d-flex justify-between items-center w-full">
              <p className="fw-bold text-dark">₹{product.price}</p>

              <button
                className="random-add-btn bg-danger rounded-lg"
                onClick={() => handleAddToCart(product._id)}
              >
                Add
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LastOrderProducts;
