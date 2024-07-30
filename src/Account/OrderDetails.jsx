import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetails, clearErrors } from "../actions/orderAction";
import Loader from "../components/Layout/Loader";
import "./OrderDetails.css";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { IoTimeOutline } from "react-icons/io5";
import { MdLocationPin } from "react-icons/md";
import { CgSandClock } from "react-icons/cg";
import { FaBox } from "react-icons/fa";
import { FaCheckDouble } from "react-icons/fa6";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoHelpCircleOutline } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import MetaData from "../components/Home/MetaData";
import OrderStatusStepper from "../Admin/OrderStatusStepper";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  console.log(order);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getOrderDetails(id));
  }, [dispatch, id, error]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "";

      const date = new Date(dateString);
      return format(date, "hh:mm a 'on' dd-MMMM-yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "Accepted":
        return "Order is accepted and the restaurant is preparing.";
      case "Ready":
        return "Order is ready, soon it will be dispatched.";
      case "On the way":
        return "Order is on the way.";
      case "Delivered":
        return "Your order was delivered.";
      case "Rejected":
        return "Oops!  order rejected. Call resturat to know why";
      default:
        return "";
    }
  };

  return (
    <>
      <MetaData title={`Order Id #${order?._id}`} />
      {loading ? (
        <Loader />
      ) : (
        <div className="order-details-main">
          <div className="order-details">
            <div className="forgot-password-top px-4">
              <span
                className="material-symbols-outlined cursor-pointer"
                onClick={handleBack}
              >
                arrow_back
              </span>
              <p>Order Details</p>
              <div className=" d-flex items-center justify-center bg-success px-3 text-light rounded-full">
                {order?.paymentInfo?.status}
                <FaCheckDouble size={20} className="ps-2" />
              </div>
            </div>
            <div className="order-details-1">
              <h4 className="d-flex items-center">
                <FaBox size={45} className="py-2" />
                <span className="d-flex flex-col">
                  <span className="text-gray-500">Order ID</span>#{order?._id}
                </span>
              </h4>
              <h4 className="d-flex items-center">
                <IoTimeOutline size={55} className="py-2" />
                <span className="d-flex flex-col">
                  <span className="text-gray-500">Order placed at</span>
                  {formatDate(order?.createdAt)}
                </span>
              </h4>
              <h4 className="d-flex items-center">
                <CgSandClock size={55} className="py-2" />
                <span className="d-flex flex-col">
                  <span className="text-gray-500">Order Status</span>
                  <span
                    className={
                      order.orderStatus === "Delivered"
                        ? "text-success"
                        : "text-rose-700"
                    }
                  >
                    <span>{getStatusMessage(order?.orderStatus)}</span>
                  </span>
                </span>
              </h4>

              <h4 className="d-flex items-center">
                <MdLocationPin size={60} className="py-2" />
                <span className="d-flex flex-col">
                  <span className="text-gray-500">
                    {order.orderStatus === "Delivered"
                      ? "Delivered to"
                      : "Delivering to"}
                  </span>
                  <span>
                    <span>{order?.deliveryInfo?.address}</span>{" "}
                    <span>{order?.deliveryInfo?.city}</span>{" "}
                    <span>{order?.deliveryInfo?.pincode}</span>
                  </span>
                </span>
              </h4>
            </div>
            <OrderStatusStepper
              statusHistory={order.statusHistory}
              createdAt={order.createdAt}
            />
            {order && (
              <div>
                <div className="order-details-2">
                  <h1 className="">Items you ordered</h1>
                  {order?.orderItems &&
                    order?.orderItems.map((item) => (
                      <li key={item.product}>
                        <span className="d-flex items-center">
                          <img
                            src={item.image.url}
                            alt={item.name}
                            className="image-in-order-details"
                          />
                          <p className="text-gray-500">{item.name}</p>
                        </span>
                        <p>
                          {item.quantity} x ₹{item.price} = ₹
                          {item.quantity * item.price}
                        </p>
                      </li>
                    ))}
                </div>
                <div className="order-details-3">
                  <h2 className="fs-5">Payment Info:</h2>
                  <div className="order-details-3-2">
                    <h5 className="d-flex justify-between">
                      <span className="text-gray-500">GST</span> ₹
                      {order?.taxPrice}
                    </h5>
                    <h5 className="d-flex justify-between ">
                      <span className="text-gray-500">Delivery Charge</span> ₹
                      {order?.deliveryPrice}
                    </h5>
                    <h5 className="d-flex justify-between">
                      <span className="text-gray-500">Discount</span> ₹
                      {order?.discount}
                    </h5>
                    <h5 className="d-flex justify-between">
                      <span className="text-gray-500">Total amount</span> ₹
                      {order?.totalPrice}
                    </h5>
                  </div>
                  <div className="order-details-3-3">
                    <button className="d-flex items-center justify-center">
                      <IoShareSocialOutline size={40} className="px-2" />
                      Share
                    </button>
                    <button className="d-flex items-center justify-center">
                      <IoHelpCircleOutline size={40} className="px-2" />
                      Help
                    </button>
                    <button className="d-flex items-center justify-center">
                      <MdOutlineFileDownload size={40} className="px-2" />
                      Download Invoice
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetails;
