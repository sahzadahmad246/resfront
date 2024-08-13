import axios from "axios";
import {
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_SUCCESS,
  ALL_PRODUCT_FAIL,
  ADMIN_ALL_PRODUCT_REQUEST,
  ADMIN_ALL_PRODUCT_SUCCESS,
  ADMIN_ALL_PRODUCT_FAIL,
  CLEAR_ERRORS,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_FAIL,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_FAIL,
  NEW_REVIEW_RESET,
} from "../constants/productConstant";

export const getProducts = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_PRODUCT_REQUEST });
    const { data } = await axios.get("/api/v1/products");

    dispatch({
      type: ALL_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get all products as an admin
export const getAdminProducts = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_ALL_PRODUCT_REQUEST });
    const { data } = await axios.get("/api/v1/products");

    dispatch({
      type: ADMIN_ALL_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_ALL_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get products by category
export const getProductsByCategory = (category) => async (dispatch) => {
  try {
    dispatch({ type: ALL_PRODUCT_REQUEST });
    const { data } = await axios.get(
      `/api/v1/products/category/${category}`
    );

    dispatch({
      type: ALL_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get products by subcategory
export const getProductsBySubCategory = (subCategory) => async (dispatch) => {
  try {
    dispatch({ type: ALL_PRODUCT_REQUEST });
    const { data } = await axios.get(
      `http://localhost:5000/api/v1/products/subcategory/${subCategory}`
    );

    dispatch({
      type: ALL_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get product details
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const { data } = await axios.get(
      `http://localhost:5000/api/v1/product/${id}`
    );

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Submit a product review
export const newReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.put(
      "http://localhost:5000/api/v1/review",
      reviewData,
      config
    );

    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
