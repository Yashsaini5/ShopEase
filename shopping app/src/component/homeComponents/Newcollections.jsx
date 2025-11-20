import React, { useContext, useRef, useEffect } from "react";
import { DataContext } from "../../context/DataProvider";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import ProductCatalogSkeleton from "./ProductCatalogSkeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

gsap.registerPlugin(ScrollTrigger);

const Newcollections = () => {
  const ref = useRef(null);
  const { data } = useContext(DataContext);

  useEffect(() => {
    gsap.to(ref.current, {
      opacity: 1,
      left: "3%",
      duration: 2,
      scrollTrigger: {
        trigger: ref.current,
        start: "-600% top",
        end: "-380% top",
        scrub: 1,
      },
    });
  }, []);

  if (!data) return <ProductCatalogSkeleton />;

  return (
    <div className="w-full px-4 py-10 relative bg-gradient-to-r from-[#f0f4f8] via-[#e5ecf1] to-[#f7f9fb]">
      {/* Header */}
      <h1
        ref={ref}
        className="text-2xl md:text-4xl font-bold underline underline-offset-[12px] decoration-4 mb-6"
      >
        New Collections
      </h1>

      {/* Swiper */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          0: { slidesPerView: 2 },   // mobile (2.2 cards visible)
          480: { slidesPerView: 2 },
          640: { slidesPerView: 3 },   // small screens: 3 cards
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },  // laptops
        }}
        className="h-full"
      >
        {data
          .slice()
          .reverse()
          .slice(0, 10)
          .map((product) => (
            <SwiperSlide key={product._id}>
              <Link to={`/product/${product._id}`}>
                <div
                  className="
                    bg-white rounded-xl shadow-md overflow-hidden 
                    hover:scale-105 transition-transform duration-300 w-full h-[32vh] sm:h-[36vh] md:h-[40vh] lg:h-[45vh]" >
                  {/* Image Section */}
                  <div className="h-[60%] w-full relative">
                    <img
                      className="h-full w-full object-cover"
                      src={product.images[0]}
                      alt={product.name}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-xl font-bold">
                        View Details
                      </p>
                    </div>
                  </div>

                  {/* Text Section */}
                  <div className="p-3 h-[40%] flex flex-col justify-between">
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
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default Newcollections;
