import axios from 'axios';
import {
  COUPON_CREATE_REQUEST,
  COUPON_CREATE_SUCCESS,
  COUPON_CREATE_FAIL,
  COUPON_CREATE_RESET,
} from '../constants/couponConstant';

// Create Coupon Action
export const createCoupon = (couponData) => async (dispatch) => {
  try {
    dispatch({ type: COUPON_CREATE_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Include this if you're using cookies for authentication
    };

    const { data } = await axios.post(
      'https://resback-ql89.onrender.com/api/v1/create/coupon', // Added 'http://'
      couponData,
      config
    );

    dispatch({
      type: COUPON_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COUPON_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
