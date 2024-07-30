import React, { useState } from "react";
import "./Shipping.css";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingInfo } from "../../actions/cartAction";
import MetaData from "../../components/Home/MetaData";
import CheckoutSteps from "./CheckoutSteps";
import UpdateShippingAddress from "./UpdateShippingAddress";
import { useNavigate } from "react-router-dom";

const Shipping = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleEditToggle = () => {
    setIsEditing(false);
  };
  const shippingInfo = {
    phone: user && user.phone,
    address: user.deliveryInfo && user.deliveryInfo.address,
    city: user.deliveryInfo && user.deliveryInfo.city,
    pincode: user.deliveryInfo && user.deliveryInfo.pincode,
    longitude: user.deliveryInfo && user.deliveryInfo.location.coordinates[1],
    latitude: user.deliveryInfo && user.deliveryInfo.location.coordinates[0],
  };
  const handleContinue = () => {
    dispatch(saveShippingInfo(shippingInfo));
    navigate("/order/confirm")
  };
  return (
    <>
      <MetaData title="Shipping details" />
      <div className="checkout-stepper">
        <CheckoutSteps activeStep={0} />
      </div>
      <div className="shipping-container">
        {isEditing ? (
          <UpdateShippingAddress
            user={user}
            onEditComplete={handleEditToggle}
          />
        ) : (
          <div className="shipping-info">
            <div className="shipping-info-top">
              <h1>Confirm details</h1>
              <button onClick={handleEditClick}>Edit</button>
            </div>

            <div className="shipping-info-main">
              <p>
                <i className="px-2 fa-solid fa-user"></i>
                {user && user.name}
              </p>

              <p>
                <i className="px-2 fa-solid fa-phone"></i>
                {user && user.phone}
              </p>
              <p>
                <i className="px-2 fa-solid fa-envelope"></i>
                {user && user.email}
              </p>
              <p>
                <i className="px-2 fa-solid fa-home"></i>
                {(user.deliveryInfo && user.deliveryInfo.address) ||
                  "No address found"}
              </p>
              <p>
                <i className="px-2 fa-solid fa-city"></i>
                {(user.deliveryInfo && user.deliveryInfo.city) ||
                  "No city found"}
              </p>
              <p>
                <i className="px-2 fa-brands fa-usps"></i>
                {(user.deliveryInfo && user.deliveryInfo.pincode) ||
                  "No pincode found"}
              </p>
            </div>
            <div className="continue-btn">
              <h3 className="text-success cursor-default">
                <i className="fa-solid fa-circle-info"></i> Please check the
                address carefully
              </h3>
              <button onClick={handleContinue}>Continue</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Shipping;
