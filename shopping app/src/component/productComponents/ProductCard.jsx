import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/product/${product._id}`);
  };

  const mainImage =
    product.images?.[0] ||
    "https://via.placeholder.com/300x300?text=No+Image";

  // If product contains variants, show the first one
  const variant = product.variants?.[0];

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl p-3 cursor-pointer transition-all"
      onClick={handleOpen}
    >
      {/* Product Image */}
      <div className="w-full h-40 md:h-48 overflow-hidden rounded-lg flex items-center justify-center bg-gray-100">
        <img
          src={mainImage}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Product Info */}
      <div className="mt-3">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
          {product.name}
        </h3>

        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
        )}

        {/* Prices */}
        <div className="mt-2">
          <span className="text-lg font-bold text-blue-600">
            ₹{variant?.newPrice || product.price || "0"}
          </span>

          {variant?.oldPrice && (
            <span className="text-sm text-gray-400 line-through ml-2">
              ₹{variant.oldPrice}
            </span>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {product.categoryName && (
            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-md">
              {product.categoryName}
            </span>
          )}

          {variant?.size && (
            <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-md">
              {variant.size}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
