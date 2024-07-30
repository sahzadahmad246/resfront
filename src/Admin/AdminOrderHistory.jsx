import React, { useState, useEffect } from "react";
import "./AdminOrderHistory.css";
import AdminNav from "./AdminNav";
import DashboardTop from "./DashboardTop";
import { MdOutlineLocationOn } from "react-icons/md";
import { IoIosCall } from "react-icons/io";
import { FaBox } from "react-icons/fa";
import { Button, CircularProgress } from "@mui/material";
import { format } from "date-fns";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../actions/orderAction";

const AdminOrderHistory = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.allOrders);

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  useEffect(() => {
    filterOrders(filterType);
  }, [filterType, orders]);

  const filterOrders = (type) => {
    setLoading(true);
    let filtered = [];

    switch (type) {
      case "last7days":
        filtered = filterByLastDays(7);
        break;
      case "last1day":
        filtered = filterByLastDays(1);
        break;
      case "last1month":
        filtered = filterByLastMonth();
        break;
      case "custom":
        // Implement custom date range filtering logic here
        break;
      case "search":
        filtered = searchOrders(searchTerm);
        break;
      default:
        filtered = orders.filter((order) => order.orderStatus === "Delivered");
        break;
    }

    setFilteredOrders(filtered);
    setLoading(false);
  };

  const filterByLastDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return orders.filter((order) => {
      const orderDate = new Date(order.deliveredAt);
      return orderDate >= date && order.orderStatus === "Delivered";
    });
  };

  const filterByLastMonth = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);

    return orders.filter((order) => {
      const orderDate = new Date(order.deliveredAt);
      return orderDate >= date && order.orderStatus === "Delivered";
    });
  };

  const searchOrders = (term) => {
    return orders.filter(
      (order) =>
        order._id.toLowerCase().includes(term.toLowerCase()) ||
        order.deliveryInfo.name?.toLowerCase().includes(term.toLowerCase()) ||
        order.deliveryInfo.phone.includes(term)
    );
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    setFilterType("search");
  };

  const exportCSVData = () => {
    const csvData = filteredOrders.map((order) => ({
      OrderID: order._id,
      CustomerName: order.deliveryInfo.name,
      Phone: order.deliveryInfo.phone,
      Address: `${order.deliveryInfo.address}, ${order.deliveryInfo.city}, ${order.deliveryInfo.pincode}`,
      OrderDate: format(new Date(order.createdAt), "dd/MM/yyyy hh:mm a"),
      TotalPrice: `₹${order.totalPrice}`,
    }));

    return csvData;
  };

  return (
    <div className="dashboard-main">
      <DashboardTop />
      <div className="dashboard">
        <div className="dashboard-left">
          <AdminNav />
        </div>
        <div className="dashboard-right">
          <div className="admin-order-history">
            <div className="order-history-filters">
              <div className="filter-buttons">
                <button onClick={() => setFilterType("last1day")}>1D</button>
                <button onClick={() => setFilterType("last7days")}>7D</button>
                <button onClick={() => setFilterType("last1month")}>1M</button>
                <button onClick={() => setFilterType("all")}>All Orders</button>
                {/* Add custom date range filter button */}
              </div>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search orders"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="export-button">
                <CSVLink
                  data={exportCSVData()}
                  filename={`order-history-${Date.now()}.csv`}
                  className="btn btn-primary"
                >
                  Export to CSV
                </CSVLink>
              </div>
            </div>
            <div className="order-history-list">
              {loading ? (
                <div className="loading-spinner">
                  <CircularProgress />
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="no-orders">
                  <FaBox size={50} color="#ff004d" />
                  <p>No orders found</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div key={order._id} className="order-history-item">
                    <div className="order-history-item-left">
                      <span className="order-id">Order ID: {order._id}</span>
                      <span className="customer-details">
                        <MdOutlineLocationOn size={20} />
                        {order.deliveryInfo.address}, {order.deliveryInfo.city}{" "}
                        {order.deliveryInfo.pincode}
                      </span>
                      <span className="customer-details">
                        <IoIosCall size={20} />
                        <a href={`tel:${order.deliveryInfo.phone}`}>
                          {order.deliveryInfo.phone}
                        </a>
                      </span>
                    </div>
                    <div className="order-history-item-right">
                      <span className="order-date">
                        Order Date:{" "}
                        {format(
                          new Date(order.createdAt),
                          "dd/MM/yyyy hh:mm a"
                        )}
                      </span>
                      <span className="order-total">
                        Total: ₹{order.totalPrice}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderHistory;
