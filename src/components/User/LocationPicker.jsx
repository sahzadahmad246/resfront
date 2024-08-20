import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLocation, setAddress } from "../../actions/otherAction";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button, CircularProgress } from "@mui/material";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationPicker = () => {
  const dispatch = useDispatch();
  const { location } = useSelector((state) => state.location);

  const [position, setPosition] = useState(location);
  const [locality, setLocality] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLocationDetection = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition({ lat: latitude, lng: longitude });
          dispatch(setLocation({ lat: latitude, lng: longitude }));

          fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=1b83cd97373249e09d149faa357a366b`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.results && data.results.length > 0) {
                const { formatted, components } = data.results[0];
                setLocality(
                  components.city || components.town || components.village || ""
                );
                dispatch(setAddress(formatted));
              }
            })
            .catch((error) => {
              console.error("Error fetching location:", error);
            })
            .finally(() => {
              setLoading(false);
            });
        },
        (error) => {
          console.error("Error getting user location:", error.message);
          setLoading(false);
        }
      );
    } else {
      console.log("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div>
      <Button
        type="submit"
        variant="contained"
        onClick={handleLocationDetection}
        disableElevation
        disabled={loading}
        endIcon={loading && <CircularProgress size={20} color="inherit" />}
      >
        {loading ? "Detecting..." : "Detect my location"}
      </Button>
    </div>
  );
};

export default LocationPicker;
