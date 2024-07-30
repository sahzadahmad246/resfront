import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "./Cart.css";
import CartItemCard from "../Product/CartItemCard";
import { useSelector } from "react-redux";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
const Cart = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { cartItems } = useSelector((state) => state.cart);
  const { error, loading, isAuthenticated, user } = useSelector(
    (state) => state.user
  );

  // Calculate subtotal
  const subtotal = cartItems.reduce((acc, curr) => {
    return acc + curr.price * curr.quantity;
  }, 0);


  const totalQuantity = cartItems.reduce((acc, curr) => {
    return acc + curr.quantity;
  }, 0);

  const deliveryCharge = subtotal > 500 ? 0 : 40;

  
  const discount = 10;

  
  const total = subtotal + deliveryCharge - discount;

  
  const handlePlaceOrder = () => {
    navigate("/login?redirect=shipping")
  };

  return (
    <>
      {cartItems.length !== 0 ? (
        <div className="cart-main">
          <div className="cart-left">
            {cartItems.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>
          <div className="cart-right">
            <h1 className="font-bold">Price Details</h1>
            <div className="price-info-boxes">
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
                <h2>Discount</h2>
                <h2>{`₹${discount}`}</h2>
              </div>
            </div>
            <div className="price-info">
              <h2 className="font-bold">Total</h2>
              <h2 className="font-bold">{`₹${total}`}</h2>
            </div>
            <button onClick={handlePlaceOrder}>Place Order</button>
          </div>
        </div>
      ) : (
        <div className="no-item">
        <MdOutlineRemoveShoppingCart size={60}/>
          <p>No item in the cart</p>
          <Link to="/menu" cl>View menu</Link>
        </div>
      )}
    </>
  );
};

export default Cart;
