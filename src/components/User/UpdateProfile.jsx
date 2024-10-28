import React, { useState, useEffect } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../Home/MetaData";
import {
  updateProfile,
  updateAvatar,
  loadUser,
  clearErrors,
} from "../../actions/userAction";
import { toast } from "react-hot-toast";
import "./UpdateProfile.css";
import { useNavigate } from "react-router-dom";
import LocationPicker from "./LocationPicker";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, isUpdated, user } = useSelector(
    (state) => state.user
  );

  const { location, address: reduxAddress } = useSelector(
    (state) => state.location
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationPickerKey, setLocationPickerKey] = useState(0);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success("Profile updated successfully!");
      dispatch(loadUser());
      dispatch({ type: "UPDATE_PROFILE_RESET" });
    }
    if (user) {
      setAvatarPreview(user.avatar && user.avatar.url);
      setName(user.name);
      setPhone(user.phone);
      setEmail(user.email);
      setAddress(user.deliveryInfo?.address || "");
      setCity(reduxAddress?.city || user.deliveryInfo?.city || "");
      setPincode(user.deliveryInfo?.pincode || "");
      setLatitude(
        location?.lat || user.deliveryInfo?.location?.coordinates[0] || ""
      );
      setLongitude(
        location?.lng || user.deliveryInfo?.location?.coordinates[1] || ""
      );
    }
  }, [dispatch, error, isUpdated, user, location, reduxAddress]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("city", city || user.deliveryInfo?.city || "");
    formData.append("pincode", pincode || user.deliveryInfo?.pincode || "");
    formData.append(
      "latitude",
      latitude || location.lat || user.deliveryInfo?.location?.coordinates[0] || ""
    );
    formData.append(
      "longitude",
      longitude || location.lng || user.deliveryInfo?.location?.coordinates[1] || ""
    );

    await dispatch(updateProfile(formData));

    if (avatar) {
      const avatarFormData = new FormData();
      avatarFormData.append("avatar", avatar);
      await dispatch(updateAvatar(avatarFormData));
    }

    toast.success("Profile updated successfully!");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDetectLocation = () => {
    setLocationPickerKey((prevKey) => prevKey + 1); // Update key to force re-render
    setShowLocationPicker(true);
  };

  return (
    <div className="main-update-profile">
      <MetaData title="Update profile" />
      <div className="update-profile-image">
        <img src={avatarPreview} alt="avatar" />
        <div className="file-input-wrapper">
          <input
            type="file"
            name="avatar"
            accept="image/*"
            id="file-input"
            onChange={handleAvatarChange}
          />
          <label htmlFor="file-input">
            <i className="bi bi-cloud-plus"></i>
          </label>
          <p>Choose Avatar</p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="update-profile-form"
        encType="multipart/form-data"
      >
        <TextField
          id="update-name"
          name="update-name"
          label="Name"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          id="update-email"
          name="update-email"
          label="Email"
          type="email"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="update-phone"
          name="update-phone"
          label="Phone"
          type="tel"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          id="update-address"
          name="update-address"
          label="Address"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          placeholder="Enter your address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          id="update-city"
          name="update-city"
          label="City"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          placeholder="Enter your city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <TextField
          id="update-pincode"
          name="update-pincode"
          label="Pincode"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          placeholder="Enter your pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
        <TextField
          id="update-latitude"
          name="update-latitude"
          label="Latitude"
          variant="outlined"
          required
          readOnly
          fullWidth
          margin="normal"
          placeholder="Enter your latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
        <TextField
          id="update-longitude"
          name="update-longitude"
          label="Longitude"
          variant="outlined"
          required
          readOnly
          fullWidth
          margin="normal"
          placeholder="Enter your longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />

        <Button onClick={handleDetectLocation} variant="contained">
          Detect Location
        </Button>

        {showLocationPicker && <LocationPicker key={locationPickerKey} />}

        <Button
          type="submit"
          variant="contained"
          className="update-profile-btn"
          disableElevation
          disabled={loading}
          endIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          Update
        </Button>
      </form>
    </div>
  );
};

export default UpdateProfile;
