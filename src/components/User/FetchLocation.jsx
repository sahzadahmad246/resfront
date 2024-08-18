import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAddress, setLocation } from "../../actions/otherAction"; // Ensure correct path

const FetchLocation = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=1b83cd97373249e09d149faa357a366b`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.results && data.results.length > 0) {
                const { postcode, city, neighbourhood } = data.results[0].components;
                dispatch(setLocation({ lat: latitude, lng: longitude }));
                dispatch(setAddress({ city, postcode, neighbourhood }));
              } else {
                console.error("Location details not found");
              }
            })
            .catch((error) => {
              console.error("Error fetching location:", error);
            });
        },
        (error) => {
          console.error("Error getting user location:", error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by your browser.");
    }
  }, [dispatch]);

  return null;
};

export default FetchLocation;
