import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { addItemsToCart } from "../../actions/cartAction";
import "./Product.css";
import vegIcon from "../../images/veg-icon.png";
import nonVegIcon from "../../images/non-veg-icon.png";

const Product = ({ product }) => {
  const [foodTypeIcon, setFoodTypeIcon] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (product.foodType === "Non Veg") {
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

  const handleAddToCart = () => {
    dispatch(addItemsToCart(product._id, 1));
    toast.success("Item added to cart");
  };

  return (
    <div className="productCard">
      <div className="product-box-left">
        <img src={product.images[0].url} alt={product.name} />
      </div>

      <div className="product-box-right">
        <h3 className="product-name">
          <Link to={`/product/${product._id}`}>
            <span className="product-name-price">
              <span className="fw-bold fs-6 d-flex justify-between items-center">
                <span>{product.name}</span>
                <img
                  className="ps-1 w-1/12"
                  src={foodTypeIcon}
                  alt={product.foodType}
                />
              </span>
            </span>
          </Link>

          <div className="product-rating">
            <ReactStars {...options} />
            <span>({product.numOfReviews} Reviews)</span>
          </div>
        </h3>
        <div className="p-price-add-c">
          <span className="fw-bold">{`₹ ${product.price}`}</span>
          {product.stock > 0 ? (
            <button
              className="bg-danger px-2 text-white rounded-lg"
              onClick={handleAddToCart}
            >
              ADD
            </button>
          ) : (
            <button className="bg-secondary px-2 text-white rounded-lg" disabled>
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
