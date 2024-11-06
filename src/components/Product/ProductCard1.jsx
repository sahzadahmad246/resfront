import React from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@mui/material";

export default function ProductCard1({
  product = {
    id: 1,
    name: "Delicious Burger",
    image: "/placeholder.svg?height=200&width=200",
    foodType: "non-veg",
    rating: 4.5,
    price: 9.99,
  },
  handleAddToCart,
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-row sm:flex-col h-full">
      <div className="relative w-1/3 sm:w-full h-24 sm:h-40 bg-gray-200">
        <img
          src={product.images[0]?.url || product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
          <img
            src={
              product.foodType === "Veg"
                ? "/placeholder.svg?height=20&width=20&text=🥬"
                : "/placeholder.svg?height=20&width=20&text=🍖"
            }
            alt={product.foodType}
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
        </div>
      </div>
      <div className="flex-1 p-2 sm:p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm sm:text-lg font-semibold mb-1 truncate">{product.name}</h3>
          <div className="flex items-center mb-1 sm:mb-2">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-xs sm:text-sm text-gray-600">{product.ratings || product.rating}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1 sm:mt-auto">
          <span className="text-sm sm:text-lg font-bold">₹{product.price.toFixed(2)}</span>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleAddToCart(product._id)}
            startIcon={<ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}