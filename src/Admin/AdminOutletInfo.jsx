import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../Account/Profile.css";
import AdminNav from "./AdminNav";
import DashboardTop from "./DashboardTop";
import { getOutletInfo, clearErrors, updateOutletInfo } from "../actions/adminAction";
import UpdateOutletInfo from '../Admin/UpdateOutletInfo'

const AdminOutletInfo = () => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const { loading, error, outlet } = useSelector(state => state.getOutletInfo);
  const { user } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getOutletInfo());

    if (error) {
      alert(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="dashboard-main">
      <DashboardTop />
      <div className="dashboard">
        <div className="dashboard-left">
          <AdminNav />
        </div>
        <div className="dashboard-right">
          <div className="profile-right w-full">
            <div className="account-top">
              <span className="material-symbols-outlined" onClick={handleBack}>
                arrow_back
              </span>
              <p>Profile</p>
              <img src={outlet.outletLogo?.url} alt="outlet logo" />
            </div>
            {isEditing && <UpdateOutletInfo />}
            <div className="profile-main">
              <div className="profile-cover"></div>
              <div className="pic-edit">
                <img src={outlet.outletLogo?.url} className="preview" alt="Outlet logo" />
                {isEditing ? (
                  <></>
                ) : (
                  <>
                    <button onClick={handleEditClick}>Edit profile</button>
                  </>
                )}
              </div>

              <div className="profile-info">
                <p>
                  <i className="px-2 fa-solid fa-user"></i>
                  <strong>Outlet name: </strong> {outlet.outletName}
                </p>

                <p>
                  <i className="px-2 fa-solid fa-phone"></i>
                  <strong>Phone:</strong>{user && user.phone}
                </p>
                <p>
                  <i className="px-2 fa-solid fa-phone"></i> <strong>Alt Phone: </strong>
                  {outlet.altPhone}
                </p>
                <p>
                  <i className="px-2 fa-solid fa-envelope"></i>
                  <strong>Email: </strong>{user && user.email}
                </p>
                <p>
                  <i className="px-2 fa-solid fa-percent"></i>
                  <strong>GST: </strong>{outlet.gst}
                </p>
                <p>
                  <i className="px-2 fa-solid fa-percent"></i>
                  <strong>Tax:</strong> {outlet.taxPercent}%
                </p>



              </div>
              <div className="border-indigo-600 m-4 p-3 bg-blue-50">
                <p>
                  <i className="px-2 fa-solid fa-home"></i>
                  <strong>Address:</strong> {outlet.address}
                </p>
                <p>
                  <i className="px-2 fa-solid fa-city"></i>
                  <strong>Cancellation Policy:</strong> {outlet.cancellationPolicy}
                </p>
                <p>
                  <i className="px-2 fa-solid fa-city"></i>
                  <strong>Terms and Conditions:</strong> {outlet.termsAndConditions}
                </p></div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AdminOutletInfo;
