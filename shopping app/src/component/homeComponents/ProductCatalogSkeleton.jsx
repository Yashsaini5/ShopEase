import React from "react";

const ProductCatalogSkeleton = () => {
  return (
    <div className="h-[74vh] w-full bg-gradient-to-r from-[#f0f4f8] via-[#e5ecf1] to-[#f7f9fb] overflow-x-hidden relative">
      {/* Blurred Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute w-72 h-72 bg-[#a5d8ff] rounded-full filter blur-2xl opacity-20 top-16 left-12"></div>
        <div className="absolute w-72 h-72 bg-[#c3fbd8] rounded-full filter blur-2xl opacity-20 bottom-16 right-12"></div>
      </div>

      <div className="w-full h-[16vh] relative z-10">
        <h1 className="h-[10vh] w-fit text-2xl md:text-5xl font-bold pt-4 z-10 text-center underline underline-offset-[15px] decoration-4 absolute right-20 text-gray-400 animate-pulse">
          Loading Collections...
        </h1>
      </div>

      {/* Arrow Buttons (Disabled Look) */}
      <button
        className="bg-gray-500 rounded-md text-white text-3xl h-16 w-8 z-50 absolute right-0 top-[50%] opacity-20 cursor-not-allowed"
        disabled
      >
        <i className="ri-arrow-right-s-fill"></i>
      </button>
      <button
        className="bg-gray-500 rounded-md text-white text-3xl h-16 w-8 z-50 absolute left-0 top-[50%] opacity-20 cursor-not-allowed"
        disabled
      >
        <i className="ri-arrow-left-s-fill"></i>
      </button>

      <div className="flex items-center gap-10 h-[50vh] w-[100%] relative justify-around pl-8 z-10">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="h-[50vh] w-[17vw] bg-white rounded-xl shadow-md overflow-hidden relative"
          >
            {/* Image Placeholder */}
            <div className="h-[70%] w-full bg-gray-300 animate-pulse"></div>

            {/* Details Placeholder */}
            <div className="p-3 h-[30%] flex flex-col justify-between">
              <div>
                <div className="h-3 w-1/2 bg-gray-300 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-5 w-16 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalogSkeleton;
