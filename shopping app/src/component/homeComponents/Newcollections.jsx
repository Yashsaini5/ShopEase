import React, { useContext, useRef, useEffect } from "react";
import { DataContext } from "../../context/DataProvider";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import ProductCatalogSkeleton from "./ProductCatalogSkeleton";

gsap.registerPlugin(ScrollTrigger);

const Newcollections = () => {
  const ref = useRef(null);
  const slider = useRef();
  const { data } = useContext(DataContext);

  useEffect(() => {
       gsap.to(ref.current, {
         opacity: 1,
         left: "3%",
         duration: 2,
         scrollTrigger: {
           trigger: ref.current, // Element to trigger the animation
           start: "-600% top", // Start animation when top of element is 80% from the top of the viewport
           end: "-380% top", // End animation when top of element is 30% from the top
           scrub: 1, // Smooth scrubbing, takes 1 second to "catch up" to the scrollbar
          //  markers:true
         },
       });
     }, []);

  function nextpage() {
    gsap.to(slider.current, {
      left: "-100%",
      duration: 1,
      ease: "sine.inOut",
    });
  }

  function prepage() {
    gsap.to(slider.current, {
      left: "0%",
      duration: 1,
      ease: "sine.inOut",
    });
  }

  if (!data) {
    return <ProductCatalogSkeleton />;
  }

  return (
    <div className="h-[74vh] w-full bg-gradient-to-r from-[#f0f4f8] via-[#e5ecf1] to-[#f7f9fb] overflow-x-hidden relative">
      {/* Blurred Background Aesthetic Shapes */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute w-72 h-72 bg-[#a5d8ff] rounded-full filter blur-2xl opacity-20 top-16 left-12"></div>
        <div className="absolute w-72 h-72 bg-[#c3fbd8] rounded-full filter blur-2xl opacity-20 bottom-16 right-12"></div>
      </div>

      <div className="w-full h-[16vh] relative z-10">
        <h1
          ref={ref}
          className="h-[10vh] w-fit text-2xl md:text-5xl font-bold pt-4 z-10 text-center underline underline-offset-[15px] decoration-4 absolute right-20"
        >
          New Collections
        </h1>
      </div>

      <button
        className="bg-gray-800 rounded-md text-white text-3xl h-16 w-8 z-50 absolute right-0 top-[50%] opacity-30 hover:opacity-100 transition-opacity duration-300"
        onClick={nextpage}
      >
        <i className="ri-arrow-right-s-fill"></i>
      </button>
      <button
        className="bg-gray-800 rounded-md text-white text-3xl h-16 w-8 z-50 absolute left-0 top-[50%] opacity-30 hover:opacity-100 transition-opacity duration-300"
        onClick={prepage}
      >
        <i className="ri-arrow-left-s-fill"></i>
      </button>

      <div
        ref={slider}
        className="flex items-center gap-10 h-[50vh] w-[100%] relative justify-around pl-8 z-10"
      >
        {data.slice().reverse().slice(0, 10).map((product) => (
          <Link to={`/product/${product._id}`} key={product._id}>
            <div className="h-[50vh] w-[17vw] bg-white rounded-xl shadow-md overflow-hidden relative hover:scale-105 transition-transform duration-300">
              <div className="h-[70%] w-full relative">
                <img
                  className="h-full w-full object-cover"
                  src={product.images[0]}
                  alt={product.name}
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-2xl font-bold">View Details</p>
                </div>
              </div>

              <div className="p-3 h-[30%] flex flex-col justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{product.brand || "Brand"}</p>
                  <h2 className="text-md font-semibold text-gray-800 truncate">{product.name}</h2>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-lg font-bold text-red-600">₹{product.variants[0]?.newPrice}</p>
                  {product.variants[0]?.oldPrice && (
                    <p className="text-sm line-through text-gray-400">₹{product.variants[0]?.oldPrice}</p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Newcollections;
