import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import homeBanner from "../../images/homeBanner.png";
import vegIcon from "../../images/veg-icon.png";
import nonVegIcon from "../../images/non-veg-icon.png";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Layout/Loader";
import { toast } from "react-toastify";
import { clearErrors, getProducts } from "../../actions/productAction";
import { getOutletInfo } from "../../actions/adminAction";
import { addItemsToCart } from "../../actions/cartAction";
import QuickCart from "./QuickCart";
import MetaData from "../Home/MetaData";
import FetchLocation from "../User/FetchLocation"; // Import FetchLocation
import { CiLocationArrow1 } from "react-icons/ci";

const Home = () => {
  const dispatch = useDispatch();

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const { outlet } = useSelector((state) => state.getOutletInfo);
  const { cartItems } = useSelector((state) => state.cart);
  const { products, loading, error } = useSelector((state) => state.products);
  const address = useSelector((state) => state.location.address);

  const [subCategories, setSubCategories] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const [fetchingLocation, setFetchingLocation] = useState(true);

  useEffect(() => {
    dispatch(getOutletInfo(outlet._id));
    dispatch(getProducts());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, outlet._id, error]);

  useEffect(() => {
    if (products) {
      const subCategoryMap = {};

      products.forEach((product) => {
        if (!subCategoryMap[product.subCategory]) {
          subCategoryMap[product.subCategory] = product;
        }
      });

      const uniqueSubCategories = Object.keys(subCategoryMap).map(
        (subCategory) => ({
          name: subCategory,
          imageUrl: subCategoryMap[subCategory].images[0]?.url || homeBanner,
        })
      );

      const shuffledSubCategories = uniqueSubCategories.sort(
        () => 0.5 - Math.random()
      );

      setSubCategories(shuffledSubCategories.slice(0, 5));

      const shuffledProducts = products.sort(() => 0.5 - Math.random());
      setRandomProducts(shuffledProducts.slice(0, 15));
    }
  }, [products]);

  useEffect(() => {
    if (!address || !address.lat || !address.lng) {
      setFetchingLocation(true);
    } else {
      setFetchingLocation(false);
    }
  }, [address]);

  const handleAddToCart = (productId) => {
    dispatch(addItemsToCart(productId, 1));
    toast.success("Item added to cart");
  };

  return (
    <>
      {loading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <div>
          <MetaData title={"Thai Chilli China"} />

          {address && (
            <div className="quick-location">
              <span className="p-2 m-2 bg-gray-200 rounded-full">
                <CiLocationArrow1 />
              </span>
              <span>
                {address.neighbourhood || address.suburb}{" "}
                {address.city || address.town || address.village}
              </span>
            </div>
          )}

          <div className="mobile-search">
            {isMobile && (
              <Link to="/search" className="search-box w-full">
                <span className="material-symbols-outlined fs-2">search</span>
                <input type="text" placeholder="search here" />
              </Link>
            )}
          </div>

          <div className="quick-status">
            <div
              className={`outlet-status rounded-lg text-center border ${
                outlet.outletStatus === "Closed"
                  ? "text-danger bg-red-100"
                  : "text-success bg-green-100"
              }`}
            >
              {outlet.outletStatus === "Closed"
                ? `Restaurant is currently closed, (Timing 11:00 AM - 03:30 PM and 07:00 PM - 11:30 PM)`
                : "Open Now"}
            </div>
            <div className="outlet-status">
              {cartItems.length > 0 ? <QuickCart /> : null}
            </div>
          </div>
          <Link to="/menu" className="homeBanner">
            <img src={homeBanner} alt="banner" />
          </Link>
          <div className="categories-box">
            {subCategories.map((subCategory) => (
              <Link
                key={subCategory.name}
                to={`/menu?subCategory=${encodeURIComponent(subCategory.name)}`}
                className="category-item"
              >
                <span className="category-image">
                  <img src={subCategory.imageUrl} alt={subCategory.name} />
                </span>
                <span className="category-name text-center fw-bold fs-6">
                  {subCategory.name}
                </span>
              </Link>
            ))}
          </div>
          <h2 className="fw-bold text-center p-3">Suggested for you</h2>
          <div className="random-products">
            <div className="product-grid">
              {randomProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <img
                    src={product.images[0]?.url || homeBanner}
                    alt={product.name}
                  />
                  <Link to={`/product/${product._id}`}>
                    <span className="d-flex align-items-center">
                      <h3 className="me-2">{product.name}</h3>
                      {product.foodType === "Veg" ? (
                        <img
                          src={vegIcon}
                          alt="Veg Icon"
                          style={{ width: "20px", height: "20px" }}
                        />
                      ) : product.foodType === "Non Veg" ? (
                        <img
                          src={nonVegIcon}
                          alt="Non Veg Icon"
                          style={{ width: "20px", height: "20px" }}
                        />
                      ) : null}
                    </span>
                  </Link>
                  <span className="d-flex justify-between  items-center w-full">
                    <p className="fw-bold text-dark"> ₹{product.price}</p>
                    <button
                      className="random-add-btn bg-danger rounded-lg"
                      onClick={() => handleAddToCart(product._id)}
                    >
                      Add
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <FetchLocation style={{ display: 'none' }} />
        </div>
      )}
    </>
  );
};

export default Home;
