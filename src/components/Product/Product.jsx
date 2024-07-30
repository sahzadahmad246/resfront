import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import "./Product.css";
import vegIcon from "../../images/veg-icon.png";
import nonVegIcon from "../../images/non-veg-icon.png";

const Product = ({ product }) => {
  const [foodTypeIcon, setFoodTypeIcon] = useState();

  useEffect(() => {
    if (product.foodType === "non-veg") {
      setFoodTypeIcon(nonVegIcon);
    } else {
      setFoodTypeIcon(vegIcon);
    }
  }, [product.foodType]);

  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    size: window.innerWidth > 600 ? 18 : 25,
    value: product.ratings,
    inHalf: true,
  };

  return (
    <div className="productCard">
      <div className="product-box-left">
        <img src={product.images[0].url} alt={product.name} />
        <button className="add-to-cart-btn">ADD</button>
      </div>
      <Link to={`/product/${product._id}`}>
        <div className="product-box-right">
          <h3 className="product-name">{product.name}</h3>{" "}
          <span className="food-type-icon">
            <img src={foodTypeIcon} alt={product.foodType} />
          </span>
          <p className="product-price">{`₹ ${product.price}`}</p>
          <div className="product-rating">
            <ReactStars {...options} />{" "}
            <span>({product.numOfReviews} Reviews)</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Product;
