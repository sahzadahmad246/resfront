import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCoupon } from "../actions/couponAction";
import "./AdminOrders.css";
import AdminNav from "./AdminNav";
import DashboardTop from "./DashboardTop";

const AdminOffers = () => {
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");

  const dispatch = useDispatch();

  const couponCreate = useSelector((state) => state.couponCreate);
  const { user } = useSelector((state) => state.user);
  const { loading, error, success } = couponCreate;

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createCoupon({
        code,
        discountType,
        discountValue,
        expiryDate,
      })
    );
  };

  return (
    <div className="dashboard-main">
      <DashboardTop />
      <div className="dashboard">
        <div className="dashboard-left">
          <AdminNav />
        </div>
        <div className="dashboard-right">
          <h2>Create a New Coupon</h2>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && (
            <p style={{ color: "green" }}>Coupon created successfully!</p>
          )}
          <form onSubmit={submitHandler}>
            <div>
              <label>Coupon Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
              >
                <option value="percent">Percent</option>
                <option value="amount">Amount</option>
              </select>
            </div>
            <div>
              <label>Discount Value</label>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
              />
            </div>
            <button type="submit">Create Coupon</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminOffers;
