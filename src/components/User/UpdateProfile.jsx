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
import { toast } from "react-toastify";
import "./UpdateProfile.css";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, isUpdated, user } = useSelector(
    (state) => state.user
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
      setAddress(user.deliveryInfo && user.deliveryInfo.address) ;
      setCity( user.deliveryInfo && user.deliveryInfo.city);
      setPincode(user.deliveryInfo && user.deliveryInfo.pincode);
      setLatitude(user.deliveryInfo && user.deliveryInfo.location.coordinates[0]);
      setLongitude( user.deliveryInfo && user.deliveryInfo.location.coordinates[1]);
    }
  }, [dispatch, error, isUpdated]);

  const handleLocationDetection = () => {
    if ("geolocation" in navigator) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=1b83cd97373249e09d149faa357a366b`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.results && data.results.length > 0) {
                const { postcode, city } = data.results[0].components;
                setCity(city || "");
                setPincode(postcode || "");
                setLatitude(latitude);
                setLongitude(longitude);
              } else {
                console.error("Location details not found");
              }
            })
            .catch((error) => {
              console.error("Error fetching location:", error);
            })
            .finally(() => {
              setLocationLoading(false);
            });
        },
        (error) => {
          console.error("Error getting user location:", error.message);
          setLocationLoading(false);
        }
      );
    } else {
      console.log("Geolocation is not supported by your browser.");
    }
  };

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
      latitude || user.deliveryInfo?.location?.coordinates[1] || ""
    );
    formData.append(
      "longitude",
      longitude || user.deliveryInfo?.location?.coordinates[0] || ""
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
          readonly
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
          readonly
          fullWidth
          margin="normal"
          placeholder="Enter your longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />

        <Button
          variant="outlined"
          className="detect-location-btn"
          onClick={handleLocationDetection}
          disabled={locationLoading}
          endIcon={
            locationLoading && <CircularProgress size={20} color="inherit" />
          }
        >
          {locationLoading ? "Detecting..." : "Detect my location"}
        </Button>

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
