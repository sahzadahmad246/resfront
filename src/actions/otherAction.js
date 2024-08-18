import { SET_ADDRESS, SET_LOCATION } from "../constants/otherConstant";

// Action to set location
export const setLocation = (location) => ({
  type: SET_LOCATION,
  payload: location,
});

// Action to set address
export const setAddress = (address) => ({
  type: SET_ADDRESS,
  payload: address,
});
