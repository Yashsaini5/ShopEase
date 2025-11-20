import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../../context/DataProvider";
import { useLocation, useParams } from "react-router-dom";
import RelatedProduct from "../productComponents/RelatedProduct";
import { useNavigate } from "react-router-dom";

// const Product = () => {
//   const { id } = useParams();
//   const { data, addToCart, addToWishlist, removeFromWishlist, wishlist, fetchWishlist} = useContext(DataContext);
//   const navigate = useNavigate()

//   if (!data) {
//     return <div>Loading...</div>; // Fallback UI
//   }

//   const product = data.find((item) => item._id === id);
//   if (!product)
//     return (
//       <p className="pt-20 pl-5 text-4xl">PRODUCT NOT FOUND - ERROR 404!</p>
//     );
//     // console.log(product)

//     const [mainImg, setMainImg] = useState(null)
//     const [isLiked, setIsLiked] = useState(null);
//     const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

//     useEffect(() => {
//       if (product?.images?.length > 0) {
//         setMainImg(product.images[0]);
//       }
//     }, [product]);

//     useEffect(() => {
//       fetchWishlist()
//     }, [])

//     useEffect(() => {
//       if (Array.isArray(wishlist)) {
//         setIsLiked(wishlist.some((item) =>item.product?._id === product._id));
//       }
//     }, [wishlist, product]);
//     // console.log(isLiked);

//     let offer = Math.floor ((product.variants[0].oldPrice-product.variants[0].newPrice)/product.variants[0].oldPrice*100)
//     const handleWishlist = async () => {
//       if (isLiked) {
//        await removeFromWishlist(product._id);
//       } else if(!wishlist.some((item) => item.product._id === product._id)) {
//         await addToWishlist(product._id);
//       }
//       await fetchWishlist()
//     };
const Product = () => {
  const { id } = useParams();
  const {
    user,
    data,
    addToCart,
    addToWishlist,
    removeFromWishlist,
    wishlist,
    fetchWishlist,
  } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [mainImg, setMainImg] = useState(null);
  const [isLiked, setIsLiked] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  // const [mainImg, setMainImg] = useState(images[0]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);


  useEffect(() => {
    if (data?.length > 0) {
      const product = data.find((item) => item._id === id);
      if (product) {
        setMainImg(product.images?.[0] || null);
        setSelectedVariant(product.variants?.[0] || null);
      }
    }
  }, [data, id]);

  // ✅ Load wishlist
  useEffect(() => {
    fetchWishlist();
  }, []);

  // ✅ Update liked state
  useEffect(() => {
    const product = data?.find((item) => item._id === id);
    if (Array.isArray(wishlist) && product) {
      setIsLiked(wishlist.some((item) => item.product?._id === product._id));
    }
  }, [wishlist, data, id]);

  if (!data || data.length === 0) return <div>Loading...</div>;

  const product = data.find((item) => item._id === id);
  if (!product)
    return (
      <p className="pt-20 pl-5 text-4xl">PRODUCT NOT FOUND - ERROR 404!</p>
    );

  const offer = Math.floor(
    ((product.variants[0].oldPrice - product.variants[0].newPrice) /
      product.variants[0].oldPrice) *
      100
  );

const zoomCursorStyle = {
  cursor: "zoom-in"
};

  const handleWishlist = async () => {
    if (isLiked) {
      await removeFromWishlist(product._id);
    } else if (!wishlist.some((item) => item.product._id === product._id)) {
      await addToWishlist(product._id);
    }
    await fetchWishlist();
  };

const handleMouseMove = (e) => {
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();

  const x = ((e.clientX - left) / width) * 100;
  const y = ((e.clientY - top) / height) * 100;

  setZoomPosition({ x, y });
  setCursorPos({
    x: e.clientX - left,
    y: e.clientY - top
  });
};

  const handleAddToCart = async () => {
    if (user) {
      await addToCart(
        product?._id,
        1,
        selectedVariant?.size,
        selectedVariant?.newPrice,
        selectedVariant?.oldPrice
      );
      navigate("/cart");
    } else {
      localStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/login", { replace: true });
    }
  };

 return (
  <div>
    <div className="h-16"></div>

    {/* MAIN WRAPPER */}
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-100 to-stone-200 flex justify-center">
      <div className="w-[92vw] h-fit mt-10 flex flex-col lg:flex-row gap-8">

        {/* ---------------- LEFT IMAGE SECTION ---------------- */}
        <div className="flex flex-col lg:flex-row w-full lg:w-[40vw] h-fit lg:sticky lg:top-24 pb-10 gap-4">

          {/* THUMBNAILS (DESKTOP ONLY - SIDE LIST) */}
          <div className="hidden lg:flex flex-col gap-3 w-24">
            {product.images.slice(0, 5).map((img, i) => (
              <div
                key={i}
                onClick={() => setMainImg(img)}
                className={`h-20 w-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300
                ${mainImg === img ? "border-orange-500" : "border-gray-300"}`}
              >
                <img src={img} alt={`thumb-${i}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>

          {/* MAIN IMAGE */}
          <div
            className="relative h-[300px] sm:h-[380px] md:h-[450px] lg:h-[80vh] w-full rounded-xl shadow-xl overflow-hidden bg-white"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setShowModal(true)}
            style={zoomCursorStyle}
          >
            {/* Wishlist Button */}
            <div className="absolute top-3 right-3 z-[999]">
              <div
                onClick={(e) => { e.stopPropagation(); handleWishlist(); }}
                className={`text-4xl w-14 h-14 flex items-center justify-center rounded-full shadow-md bg-white hover:scale-110 transition-transform duration-200 cursor-pointer
                  ${isLiked ? "text-red-500" : "text-gray-400"}`}
              >
                <i className="ri-heart-fill"></i>
              </div>
            </div>

            {/* MAIN PRODUCT IMAGE WITH ZOOM */}
            <img
              src={mainImg}
              alt="product-main"
              className="h-full w-full object-contain transition-all duration-200"
              style={{
                transform: isZoomed ? "scale(2.2)" : "scale(1)",
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />

            {/* MAGNIFIER CIRCLE */}
            {isZoomed && (
              <div
                className="pointer-events-none absolute rounded-full border-2 border-orange-500 bg-white/10"
                style={{
                  width: "140px",
                  height: "140px",
                  left: cursorPos.x - 70,
                  top: cursorPos.y - 70,
                }}
              ></div>
            )}
          </div>

          {/* THUMBNAILS BELOW (MOBILE ONLY) */}
          <div className="flex lg:hidden gap-3 mt-4 p-2 overflow-x-auto rounded-xl bg-white shadow-md">
            {product.images.slice(0, 5).map((img, i) => (
              <div
                key={i}
                onClick={() => setMainImg(img)}
                className={`h-20 min-w-[80px] rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300
                ${mainImg === img ? "border-orange-500" : "border-gray-300"}`}
              >
                <img src={img} alt={`thumb-${i}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>

        </div>

        {/* ---------------- RIGHT PRODUCT INFO ---------------- */}
        <div className="w-full lg:w-[45vw] min-h-screen px-4 sm:px-8 py-4 bg-white rounded-2xl shadow-lg">
          
          <div className="text-gray-400 text-sm mb-2">
            Home / Category / {product.name}
          </div>

          <h2 className="text-gray-800 text-xl sm:text-2xl font-bold">{product.brand}</h2>
          <p className="text-2xl sm:text-3xl font-semibold mt-2">{product.name}</p>

          <hr className="my-4 border-gray-300" />

          <p className="text-lg text-green-700 font-semibold mt-2">Special Price</p>

          <div className="flex gap-3 items-end mt-2 ml-1">
            <p className="text-2xl sm:text-3xl font-semibold text-gray-900">
              ₹{selectedVariant?.newPrice}
            </p>
            <p className="text-lg text-gray-400 line-through">₹{selectedVariant?.oldPrice}</p>
            <p className="text-lg text-green-600 font-semibold">{offer}% off</p>
          </div>

          {/* Size selector */}
          <div className="mt-6">
            <p className="text-lg font-medium text-gray-700 mb-2">Select Size:</p>

            <div className="flex gap-3 flex-wrap">
              {product.variants.map((variant) => (
                <div
                  key={variant.size}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-5 py-2 border rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 ${
                    selectedVariant?.size === variant.size
                      ? "bg-orange-500 text-white border-orange-600 scale-105"
                      : "bg-gray-100 hover:bg-orange-100 border-gray-300 text-gray-700"
                  }`}
                >
                  {variant.size}
                </div>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex gap-5 mt-8">
            <div
              onClick={() => {
                setAnimateCart(true);
                setTimeout(() => setAnimateCart(false), 600);

                handleAddToCart(
                  product?._id,
                  1,
                  selectedVariant?.size,
                  selectedVariant?.newPrice,
                  selectedVariant?.oldPrice
                );
              }}
              className={`border-2 border-orange-500 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-16 sm:px-20 rounded-lg cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg
                ${animateCart ? "scale-110 shadow-2xl" : ""}`}
            >
              Add to Cart
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 text-sm text-gray-600 leading-relaxed space-y-1">
            <p>✅ 100% Original product</p>
            <p>🚚 Cash on delivery available</p>
            <p>↩️ Easy 7-day return and exchange policy</p>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Product Description</h3>
            <p className="text-gray-600 text-base leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications */}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Product Specifications</h3>
            <div className="flex flex-col gap-2">
              {product.specifications.map((spec, index) => (
                <div
                  key={index}
                  className="flex justify-between border-b border-gray-200 py-2 text-gray-700"
                >
                  <span className="font-medium w-1/3">{spec.key}:</span>
                  <span className="w-2/3">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>

    {/* RELATED PRODUCTS */}
    <div className="w-full bg-gradient-to-b from-stone-200 to-stone-300 py-10">
      <div className="mx-4 sm:mx-8">
        <RelatedProduct
          category={product.category?.name}
          subCategory={product.subCategory}
        />
      </div>
    </div>

    {/* FULLSCREEN MODAL */}
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex items-center justify-center p-4 cursor-zoom-out">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-5 right-5 text-white text-xl bg-black/40 p-3 rounded-full"
        >
          ✕
        </button>

        <div className="max-w-4xl w-full">
          <img src={mainImg} className="w-full max-h-[90vh] object-contain rounded-xl" />

          <div className="flex gap-3 mt-4 overflow-x-auto justify-center">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setMainImg(img)}
                className={`h-20 w-20 rounded-md object-cover cursor-pointer border-2 ${
                  mainImg === img ? "border-white" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
);


};

export default Product;
