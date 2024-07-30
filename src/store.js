import { configureStore } from "@reduxjs/toolkit";
import {
  newReviewReducer,
  productDetailsReducer,
  productReducer,
  adminAllProductReducer,
} from "./reducers/productReducer";
import { forgotPasswordReducer, userReducer } from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import {
  newOrderReducer,
  allOrdersReducer,
  myOrdersReducer,
  orderDetailsReducer,
} from "./reducers/orderReducer";
import {
  addNewProductReducer,
  allUsersReducer,
  deleteProductReducer,
  singleUserReducer,
  updateProductReducer,
  updateStockReducer,
} from "./reducers/adminReducer";
import { updateOrderStatus } from "./actions/orderAction";
const cartItems = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const initialState = {
  cart: {
    cartItems: cartItems,
  },
};

const store = configureStore({
  reducer: {
    products: productReducer,
    productDetails: productDetailsReducer,
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    review: newReviewReducer,
    adminProducts: adminAllProductReducer,
    allUsers: allUsersReducer,
    singleUser: singleUserReducer,
    newProduct: addNewProductReducer,
    updateStock: updateStockReducer,
    deleteProduct: deleteProductReducer,
    updateProduct: updateProductReducer,
    allOrders: allOrdersReducer,
    orderStatus: updateOrderStatus,
  },
  preloadedState: initialState,
});

export default store;
