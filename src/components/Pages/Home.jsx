import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Search from "../Header/Search";
import "./Home.css";
import IndianCategory from "../../images/mainCategoryIndian.jpeg";
import ChineseCategory from "../../images/mainCategoryChinese.jpeg";
import ThaiCategory from "../../images/mainCategoryThai.jpeg";
import Product from "../Product/Product";
import MetaData from "../Home/MetaData";
import { getProductsByCategory } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Layout/Loader";
import { toast } from "react-toastify";
import { clearErrors } from "../../actions/productAction";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProductsByCategory("indian"));
  }, [dispatch, error, toast]);

  return (
    <>
      {loading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <div>
          <MetaData title={"Thai Chilli China"} />
          <div className="d-flex flex-row">
            {isMobile && (
              <Link to="/search" className="search-box w-full m-3">
                <span className="material-symbols-outlined fs-2">search</span>
                <input type="text" placeholder="search here" />
              </Link>
            )}
          </div>
          <div className="main-category">
            <h3>Explore by category</h3>
            <div className="main-category-boxes">
              <div className="main-category-box">
                <img src={ChineseCategory} alt="Chinese Category" />
                <p>Chinese</p>
              </div>
              <div className="main-category-box">
                <img src={IndianCategory} alt="Indian Category" />
                <p>Indian</p>
              </div>
              <div className="main-category-box">
                <img src={ThaiCategory} alt="Thai Category" />
                <p>Thai</p>
              </div>
            </div>
          </div>
          <div
            className="container"
            id="container"
            style={{ overflowX: "auto", whiteSpace: "wrap" }}
          >
            {products &&
              products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            <Link to="menu" className="see-all-btn">
              See All
            </Link>
          </div>
          
        </div>
      )}
    </>
  );
};

export default Home;
