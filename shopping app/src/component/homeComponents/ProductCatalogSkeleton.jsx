import React from "react";

const ProductCatalogSkeleton = () => {
  return (
   <div className="w-full bg-gradient-to-r from-[#f0f4f8] via-[#e5ecf1] to-[#f7f9fb] overflow-hidden relative py-10">

  {/* Blurred Background Shapes */}
  <div className="absolute top-0 left-0 w-full h-full -z-10">
    <div className="absolute w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-[#a5d8ff] rounded-full blur-2xl opacity-20 top-10 left-6"></div>
    <div className="absolute w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-[#c3fbd8] rounded-full blur-2xl opacity-20 bottom-10 right-6"></div>
  </div>

  {/* Heading */}
  <div className="w-full mb-6 text-center">
    <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-400 underline underline-offset-8 decoration-2 animate-pulse">
      Loading Collections...
    </h1>
  </div>

  {/* Disabled Arrows */}
  <button
    className="bg-gray-500 rounded-md text-white text-2xl sm:text-3xl h-10 w-6 sm:h-14 sm:w-8 z-20 
               absolute right-1 top-1/2 opacity-20 cursor-not-allowed"
    disabled
  >
    <i className="ri-arrow-right-s-fill"></i>
  </button>

  <button
    className="bg-gray-500 rounded-md text-white text-2xl sm:text-3xl h-10 w-6 sm:h-14 sm:w-8 z-20 
               absolute left-1 top-1/2 opacity-20 cursor-not-allowed"
    disabled
  >
    <i className="ri-arrow-left-s-fill"></i>
  </button>

  {/* Responsive Skeleton Cards */}
  <div
    className="
      grid 
      grid-cols-2
      sm:grid-cols-3
      md:grid-cols-4
      lg:grid-cols-5 
      gap-4 sm:gap-6 px-4
    "
  >
    {[...Array(5)].map((_, index) => (
      <div
        key={index}
        className="
          bg-white rounded-xl shadow-md overflow-hidden
          h-[28vh] sm:h-[32vh] md:h-[36vh] lg:h-[40vh]
          w-full
        "
      >
        {/* Image Block */}
        <div className="h-[60%] w-full bg-gray-300 animate-pulse"></div>

        {/* Details */}
        <div className="p-3 h-[40%] flex flex-col justify-between">
          <div>
            <div className="h-3 w-1/2 bg-gray-300 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
          </div>

          <div className="flex items-center gap-2 mt-2">
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
