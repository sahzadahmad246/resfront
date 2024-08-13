import React, { useEffect, useState } from "react";
import "./AdminOrders.css";
import AdminNav from "./AdminNav";
import { CiSearch } from "react-icons/ci";
import DashboardTop from "./DashboardTop";
import MetaData from "../components/Home/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import newOrderSound from "../images/newOrderAlert.mp3";
import { IoMdClose } from "react-icons/io";
import {
  getAllOrders,
  clearErrors,
  updateOrderStatus,
} from "../actions/orderAction";
import {
  getSingleUser,
  clearErrors as singleUserClearErrors,
} from "../actions/adminAction";
import { MdOutlineLocationOn } from "react-icons/md";
import { BsPrinter } from "react-icons/bs";
import { IoIosCall } from "react-icons/io";
import { FaBox } from "react-icons/fa";
import { Button, CircularProgress } from "@mui/material";
import NewOrderPopup from "./NewOrderPopup";
import OrderStatusStepper from "./OrderStatusStepper";
import OrderBill from "./OrderBill";
import Loader from "../components/Layout/Loader";
const AdminOrders = () => {
  const dispatch = useDispatch();
  const { error, orders, loading } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.singleUser);
  const { error: updateError } = useSelector((state) => state.orderStatus);
  const [loadingButton, setLoadingButton] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState("Accepted");
  const [newOrders, setNewOrders] = useState([]);
  const [prevOrdersLength, setPrevOrdersLength] = useState(0);
  const [showBill, setShowBill] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const fetchOrders = () => {
      dispatch(getAllOrders());
    };

    fetchOrders();

    const intervalId = setInterval(() => {
      fetchOrders();
    }, 2000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      orders.forEach((order) => {
        if (!users[order.user]) {
          dispatch(getSingleUser(order.user));
        }
      });

      // Update filteredOrders with all orders after fetching them
      setFilteredOrders([...orders]);

      const placedOrders = orders.filter(
        (order) => order.orderStatus === "Placed"
      );
      setNewOrders(placedOrders);

      if (orders.length > prevOrdersLength && placedOrders.length > 0) {
        const audio = new Audio(newOrderSound);
        audio.play();
      }
      setPrevOrdersLength(orders.length);
    }

    if (error) {
      dispatch(clearErrors());
    }

    if (updateError) {
      dispatch(clearErrors());
    }
  }, [dispatch, error, orders, users, updateError, prevOrdersLength]);

  useEffect(() => {
    // Apply filtering based on activeStatus and searchTerm
    const filterOrders = () => {
      let filtered = [...orders];

      if (activeStatus !== "All") {
        filtered = filtered.filter((order) => order.orderStatus === activeStatus);
      }

      if (searchTerm.trim() !== "") {
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();
        filtered = filtered.filter((order) => {
          const { user, deliveryInfo, _id } = order;
          const userName = users[user]?.name.toLowerCase();
          const userPhone = deliveryInfo.phone.toLowerCase();
          return (
            userName.includes(normalizedSearchTerm) ||
            userPhone.includes(normalizedSearchTerm) ||
            _id.toLowerCase().includes(normalizedSearchTerm)
          );
        });
      }

      // Sort orders in descending order based on creation date
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setFilteredOrders(filtered);
    };

    filterOrders();
  }, [searchTerm, orders, users, activeStatus]);


  const handleOrderStatusChange = (orderId, currentStatus) => {
    setLoadingButton(true);

    let nextStatus = "";

    switch (currentStatus) {
      case "Accepted":
        nextStatus = "Ready";
        break;
      case "Ready":
        nextStatus = "On the way";
        break;
      case "On the way":
        nextStatus = "Delivered";
        break;
      default:
        return;
    }

    dispatch(updateOrderStatus(orderId, nextStatus))
      .then(() => {
        dispatch(getAllOrders());
        setLoadingButton(false);
      })
      .catch(() => {
        setLoadingButton(false);
      });
  };

  const handleOrderProcessed = (orderId) => {
    setNewOrders((prevOrders) =>
      prevOrders.filter((order) => order._id !== orderId)
    );
  };

  const handlePrintBill = (order) => {
    setSelectedOrder(order);
    setShowBill(true);
  };

  const closeBill = () => {
    setShowBill(false);
  };

  return (
    <div className="dashboard-main">
      <MetaData title="Orders - Thai Chilli China" />
      <DashboardTop />
      <div className="dashboard">
        <div className="dashboard-left">
          <AdminNav />
        </div>
        <div className="dashboard-right">
          {showBill && (
            <div className="showBill">
              <div className="modelContent">
                <button onClick={closeBill}>
                  <IoMdClose size={30} />
                </button>
                <OrderBill order={selectedOrder} />
              </div>
            </div>
          )}
          <div className="live-order-top">
            <div className="live-order-top-1">
              <span
                onClick={() => setActiveStatus("Accepted")}
                className={activeStatus === "Accepted" ? "active-status" : ""}
              >
                Preparing
              </span>
              <span
                onClick={() => setActiveStatus("Ready")}
                className={activeStatus === "Ready" ? "active-status" : ""}
              >
                Ready
              </span>
              <span
                onClick={() => setActiveStatus("On the way")}
                className={activeStatus === "On the way" ? "active-status" : ""}
              >
                On the way
              </span>
              <span
                onClick={() => setActiveStatus("Delivered")}
                className={activeStatus === "Delivered" ? "active-status" : ""}
              >
                Delivered
              </span>
            </div>
            <div className="live-order-top-2">
              <CiSearch />
              <input
                type="text"
                placeholder="Search orders"
                className="px-2 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="order-list">
            {filteredOrders.length === 0 ? (
              <div className="no-orders">
                {orders.length === 0 ? (
                  <>
                    <CiSearch size={50} color="#ff004d" />
                    <p>Searching for new orders</p>
                  </>
                ) : (
                  <FaBox size={50} color="#ff004d" />
                )}
                <p>No orders found</p>
              </div>
            ) : (
              <div>
                {filteredOrders.map((order) => (
                  <div key={order._id} className="live-order-box">
                    <div className="live-order-box-1">
                      <span className="live-order-box-1-1">
                        {users[order.user] &&
                          users[order.user].avatar &&
                          users[order.user].avatar.url ? (
                          <img
                            src={users[order.user].avatar.url}
                            alt={users[order.user].name}
                          />
                        ) : (
                          "Loading avatar..."
                        )}
                        <span className="px-2 d-flex flex-col">
                          <span className="fs-5 fw-bold">
                            {users[order.user]
                              ? users[order.user].name
                              : "Loading..."}
                          </span>
                        </span>
                      </span>
                      <div className="d-flex flex-col items-end">
                        <span>
                          <strong>Order value</strong> ₹{order.totalPrice}
                        </span>
                        <span className="text-slate-900">ID: #{order._id}</span>
                      </div>
                    </div>
                    <OrderStatusStepper
                      statusHistory={order.statusHistory}
                      createdAt={order.createdAt}
                    />
                    <div className="live-order-box-2">
                      <div className="live-order-box-2-left">
                        <span className="d-flex items-center">
                          <span className="bg-gray-200 p-2 m-2 rounded-full">
                            <MdOutlineLocationOn size={25} />
                          </span>
                          <span className="text-slate-500">
                            {order.deliveryInfo.address}{" "}
                            {order.deliveryInfo.city}{" "}
                            {order.deliveryInfo.pincode}
                          </span>
                        </span>
                        <span className="d-flex items-center">
                          <span className="bg-gray-200 p-2 m-2 rounded-full">
                            <IoIosCall size={25} />
                          </span>
                          <a
                            href={`tel:+${order.deliveryInfo.phone}`}
                            className="text-slate-500"
                          >
                            Call Customer
                          </a>
                        </span>
                      </div>
                      <div className="live-order-box-2-right">
                        <>
                          {order.orderItems?.map((item) => (
                            <div key={item.product} className="live-order-item">
                              <span className="order-item-name ps-2 text-slate-500">
                                {item.name}
                              </span>
                              <span>
                                <span className="order-item-price ps-2">
                                  ₹{item.price}
                                </span>
                                <span className="order-item-quantity ps-2">
                                  x {item.quantity}
                                </span>
                                <span className="order-item-total ps-2">
                                  ₹{item.price * item.quantity}
                                </span>
                              </span>
                            </div>
                          ))}
                          <div className="live-order-box-2-right-1 d-flex justify-between">
                            <span>
                              Total Bill{" "}
                              <span className="px-2">₹{order.totalPrice}</span>
                              <span className={
                                order.paymentInfo.status === "paid"
                                  ? "text-success"
                                  : "text-danger"
                              }>
                                {order.paymentInfo.status}
                              </span>
                            </span>
                            <span className="d-flex items-center text-blue-600">
                              <Button
                                variant="text"
                                className={` ${loadingButton
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                                  }`}
                                onClick={() => handlePrintBill(order)}
                                disabled={loadingButton}
                                startIcon={
                                  loadingButton ? (
                                    <CircularProgress
                                      size={20}
                                      color="inherit"
                                    />
                                  ) : (
                                    <BsPrinter />
                                  )
                                }
                              >
                                Print bill
                              </Button>
                            </span>
                          </div>
                          <div className="order-ready-btn">
                            {order.orderStatus === "Delivered" ? (
                              <span className="text-green-600">
                                Order was delivered on{" "}
                                {format(
                                  order.deliveredAt,
                                  "dd/MM/yyyy, 'at' hh:mm a"
                                )}
                              </span>
                            ) : (
                              <Button
                                variant="contained"
                                className={`bg-blue-500 text-white ${loadingButton
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                                  }`}
                                onClick={() =>
                                  handleOrderStatusChange(
                                    order._id,
                                    order.orderStatus
                                  )
                                }
                                disabled={loadingButton}
                                startIcon={
                                  loadingButton ? (
                                    <CircularProgress
                                      size={20}
                                      color="inherit"
                                    />
                                  ) : null
                                }
                              >
                                {loadingButton ? (
                                  ""
                                ) : (
                                  <>
                                    {order.orderStatus === "Accepted" &&
                                      "Mark order ready"}
                                    {order.orderStatus === "Ready" &&
                                      "Mark on the way"}
                                    {order.orderStatus === "On the way" &&
                                      "Mark delivered"}
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {newOrders.length > 0 && (
            <NewOrderPopup
              orders={newOrders}
              onOrderProcessed={handleOrderProcessed}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
