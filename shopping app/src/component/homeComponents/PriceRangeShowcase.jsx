import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCatalogSkeleton from "./ProductCatalogSkeleton";

gsap.registerPlugin(ScrollTrigger);

const PriceRangeShowcase = ({ category, ranges = [] }) => {
  const ref = useRef(null);
  const [productsByRange, setProductsByRange] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gsap.to(ref.current, {
      opacity: 1,
      left: "0%",
      duration: 2,
      scrollTrigger: {
        trigger: ref.current,
        start: "-600% top",
        end: "-380% top",
        scrub: 1,
        // markers:true
      },
    });
  }, []);

  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = {};
        const seenProductIds = new Set();

        for (let price of ranges) {
          const { data } = await axios.get(
            apiUrl +
              `/api/products/filter?category=${category}&maxPrice=${price}`
          );

          // Filter unique products (not seen before)
          const uniqueProducts = data.filter((product) => {
            const isNew = !seenProductIds.has(product._id);
            if (isNew) seenProductIds.add(product._id);
            return isNew;
          });

          // Limit to 10
          result[price] = uniqueProducts.slice(0, 10);
        }

        setProductsByRange(result);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, ranges]);

  if (loading) {
    return <ProductCatalogSkeleton />;
  }

  return (
    <div className="py-8 px-4 bg-gray-100">
      <div className="w-full h-[16vh] relative z-10">
        <h2
          ref={ref}
          className="mb-8 h-[10vh] w-fit text-2xl md:text-4xl font-bold pt-4 z-10 text-center underline underline-offset-[15px] decoration-4 absolute right-20"
        >
          {category} by Price
        </h2>
      </div>
      {ranges.slice(0, 10).map((price) => (
        <div key={price} className="mb-10">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">
            Under ₹{price}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {productsByRange[price]?.length > 0 ? (
              productsByRange[price].map((product) => (
                <Link to={`/product/${product._id}`} key={product._id}>
                  <div className="h-[50vh] w-[17vw] bg-white rounded-xl shadow-md overflow-hidden relative hover:scale-105 transition-transform duration-300">
                    {/* Increased image height */}
                    <div className="h-[70%] w-full relative">
                      <img
                        className="h-full w-full object-cover"
                        src={product.images[0]}
                        alt={product.name}
                      />

                      {/* View Details Overlay */}
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-2xl font-bold">
                          View Details
                        </p>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-3 h-[30%] flex flex-col justify-between">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          {product.brand || "Brand"}
                        </p>
                        <h2 className="text-md font-semibold text-gray-800 truncate">
                          {product.name}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-lg font-bold text-red-600">
                          ₹{product.variants[0]?.newPrice}
                        </p>
                        {product.variants[0]?.oldPrice && (
                          <p className="text-sm line-through text-gray-400">
                            ₹{product.variants[0]?.oldPrice}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">No products under ₹{price}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PriceRangeShowcase;
