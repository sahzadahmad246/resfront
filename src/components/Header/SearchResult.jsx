import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import "./SearchResult.css";
import vegIcon from "../../images/veg-icon.png";
import nonVegIcon from "../../images/non-veg-icon.png";
const SearchResult = ({ product }) => {
  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    size: window.innerWidth > 600 ? 18 : 25,
    value: product.ratings,
    inHalf: true,
  };
  const [foodTypeIcon, setFoodTypeIcon] = useState();

  useEffect(() => {
    if (product.foodType === "non-veg") {
      setFoodTypeIcon(nonVegIcon);
    } else {
      setFoodTypeIcon(vegIcon);
    }
  }, [product.foodType]);
  return (
    <>
      <div className="search-card">
        <div className="search-card-left">
          <img src={product.images[0] && product.images[0].url} alt={product.name} />
        </div>
        <Link to={`/product/${product._id}`}>
          <div className="search-card-right">
            <h3 className="product-name">
              {product.name}
              <span className="food-type-icon">
                <img src={foodTypeIcon} alt={product.foodType} />
              </span>
            </h3>
            <p className="product-price">{`₹ ${product.price}`}</p>
            <div className="product-rating">
              <ReactStars {...options} />{" "}
              <span>({product.numOfReviews} Reviews)</span>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default SearchResult;
