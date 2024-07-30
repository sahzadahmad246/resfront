import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { logout, clearErrors } from "../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { MdDashboard } from "react-icons/md";
import { toast } from "react-toastify";
import '../components/Pages/Account.css'
const AccountNav = () => {
  const { error, loading, user, isAuthenticated, token } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (user && user.role === "admin") {
      setIsAdmin(true);
    }
  }, [error, dispatch, user]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    toast.success("Logged out successfully");
  };

  return (
    <div className="account-left">
      <>
        {isAdmin && (
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => (isActive ? "left-item active" : "left-item")}
          >
            <MdDashboard/>
            <p>Dashboard</p>
          </NavLink>
        )}
        <NavLink
          to="/account/profile"
          className={({ isActive }) => (isActive ? "left-item active" : "left-item")}
        >
          <i className="fa-solid fa-user"></i>
          <p>Profile</p>
        </NavLink>
        <NavLink
          to="/account/orders"
          className={({ isActive }) => (isActive ? "left-item active" : "left-item")}
        >
          <i className="fa-solid fa-bag-shopping"></i>
          <p>Orders</p>
        </NavLink>
        <NavLink
          to="/account/address"
          className={({ isActive }) => (isActive ? "left-item active" : "left-item")}
        >
          <i className="fa-solid fa-house"></i>
          <p>Address</p>
        </NavLink>
        <NavLink
          to="/account/payments"
          className={({ isActive }) => (isActive ? "left-item active" : "left-item")}
        >
          <i className="fa-solid fa-money-bill"></i>
          <p>Payment</p>
        </NavLink>
        <NavLink
          to="/password/update"
          className={({ isActive }) => (isActive ? "left-item active" : "left-item")}
        >
          <i className="fa-solid fa-lock"></i>
          <p>Update Password</p>
        </NavLink>
        <div className="logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt p-2"></i>
          Logout
        </div>
      </>
    </div>
  );
};

export default AccountNav;
