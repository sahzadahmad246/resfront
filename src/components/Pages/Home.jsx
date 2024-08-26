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
import LocationPicker from "../User/LocationPicker"; 
import { CiLocationArrow1 } from "react-icons/ci";
import { CiUnlock, CiLock } from "react-icons/ci";
import { haversineDistance } from "../User/haversineDistance";

const Home = () => {
  const dispatch = useDispatch();

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const { outlet } = useSelector((state) => state.getOutletInfo);
  const { cartItems } = useSelector((state) => state.cart);
  const { products, loading, error } = useSelector((state) => state.products);
  const { location, address } = useSelector((state) => state.location);
  const [subCategories, setSubCategories] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const [fetchingLocation, setFetchingLocation] = useState(true);
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);

  useEffect(() => {
    dispatch(getOutletInfo(outlet._id));
    dispatch(getProducts());
    console.log("data from redux", location, address);
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
    if (location && outlet) {
      const userLocation = {
        lat: location.lat,
        lng: location.lng,
      };
      const outletLocation = {
        lat: outlet.location?.coordinates[0],
        lng: outlet.location?.coordinates[1],
      };

      const distance = haversineDistance(userLocation, outletLocation);

      if (distance > 6) {
        setDeliveryAvailable(false);
      } else {
        setDeliveryAvailable(true);
      }
    }
  }, [location, outlet]);

  const handleAddToCart = (productId) => {
    dispatch(addItemsToCart(productId, 1));
    toast.success("Item added to cart");
  };

  const handleNavigate = () => {
    if (outlet.location && outlet.location.coordinates) {
      const [lng, lat] = outlet.location.coordinates;
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(googleMapsUrl, "_blank");
    } else {
      toast.error("Outlet location not available.");
    }
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
            <div className="location-status">
              <div className="quick-location">
                <span className="p-2 m-2 bg-gray-200 rounded-full">
                  <CiLocationArrow1 />
                </span>
                <span>
                  {address.neighborhood  || "Unknown locality"}, {""}
                  {address.city  || "Unknown city"}
                 
                </span>
              </div>
              <div
                className={`outlet-status p-2 m-2 ${
                  outlet.outletStatus === "Closed"
                    ? "text-danger"
                    : "text-success"
                }`}
              >
                {outlet.outletStatus === "Closed" ? (
                  <span className="d-flex items-center">
                    <CiLock size={25} /> Closed
                  </span>
                ) : (
                  <span className="d-flex items-center">
                    <CiUnlock size={25} /> Open
                  </span>
                )}
              </div>
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

          <div className="quick-cart">
            {!deliveryAvailable && (
              <div className="delivery-status rounded-lg">
                <span className="text-danger">
                  Delivery not available for your location.
                </span>
                <button
                  className="bg-success text-white px-2 py-1 rounded-lg"
                  onClick={handleNavigate}
                >
                  Navigate us
                </button>
              </div>
            )}
            {cartItems.length > 0 ? <QuickCart /> : null}
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
                  <span className="d-flex justify-between items-center w-full">
                    <p className="fw-bold text-dark">₹{product.price}</p>
                    {product.stock > 0 ? (
                      <button
                        className="random-add-btn bg-danger rounded-lg"
                        onClick={() => handleAddToCart(product._id)}
                      >
                        Add
                      </button>
                    ) : (
                      <button
                        className="random-add-btn bg-secondary rounded-lg"
                        disabled
                      >
                        Out of Stock
                      </button>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <LocationPicker />
        </div>
      )}
    </>
  );
};

export default Home;
