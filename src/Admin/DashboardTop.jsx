import React, { useState } from "react";
import "./DashboardTop.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { logout, clearErrors } from "../actions/userAction";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { IoIosNotificationsOutline } from "react-icons/io";


const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&::before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&::after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const DashboardTop = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSwitchChange = (event) => {
    setIsOnline(event.target.checked);
  };

  return (
    <div className="dashboard-main">
      <div className="dashboard-top">
        <div className="dashboard-top-left">
          <Link>Thai Chilli China</Link>
        </div>
        <div className="dashboard-top-right">
          <FormControlLabel
            className="toggle-online"
            control={
              <Android12Switch
                checked={isOnline}
                onChange={handleSwitchChange}
              />
            }
            label={isOnline ? "Online" : "Offline"}
          />
          <div className="admin-notfication">
            <IoIosNotificationsOutline size={35} />
          </div>
          <div className="admin-account" onClick={toggleDropdown}>
            <img src={user?.avatar.url} alt="User Avatar" />
            <span>{user?.name}</span>
            {showDropdown ? <FaCaretUp /> : <FaCaretDown />}
            {showDropdown && (
              <Box className="admin-dropdown-box">
                <div className="admin-dropdown-box-1">
                  <img src={user?.avatar.url} alt="User Avatar" />
                  <span className="px-2">
                    <h4 className="py-1 text-neutral-700">{user?.name}</h4>
                    <h4 className="py-1 text-neutral-700">{user?.phone}</h4>
                  </span>
                </div>
                <h4 className="py-2 text-neutral-700">{user?.email}</h4>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTop;
