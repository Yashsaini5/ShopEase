import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../../context/DataProvider";
import { useNavigate, useLocation } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, user, fetchWishlist, addToCart, removeFromWishlist } =
    useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();

  // if (!user) {
  //   return <div>Loading...</div>; // Fallback UI
  // }
  useEffect(() => {
    if (user == null) {
      localStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/login", { replace: true });
    } else {
      fetchWishlist(user);
    }
  }, [user, navigate]);

  // console.log("wishlist", wishlist)
  if (!user || user == null) return null;

  return (
   <div className="pt-20 px-4 md:px-10 min-h-screen bg-gray-50">
  <h1 className="text-3xl font-semibold mb-8 border-b-4 border-gray-400 inline-block">
    My Wishlist
  </h1>

  {wishlist.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl shadow-inner">
      <i className="ri-heart-line text-7xl text-gray-400 mb-4"></i>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        Your Wishlist is Empty
      </h2>
      <p className="text-gray-500 max-w-md mb-6">
        Looks like you haven’t added anything to your wishlist yet. Browse and add your favorites!
      </p>

      <Link
        to="/"
        className="px-8 py-3 bg-red-500 text-white rounded-full font-medium shadow-md hover:bg-red-600 transition-all duration-300"
      >
        Browse Products
      </Link>
    </div>
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {wishlist.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
        >
          {/* Product Image */}
          <Link to={`/product/${item.product._id}`}>
            <div className="h-48 sm:h-56 w-full overflow-hidden relative">
              <img
                src={item.product.images?.[0]}
                alt={item.product.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>

          {/* Product Details */}
          <div className="p-3 flex flex-col justify-between h-32">
            <Link to={`/product/${item.product._id}`}>
              <h2 className="text-sm sm:text-md font-medium text-gray-800 line-clamp-2 hover:underline">
                {item.product.name}
              </h2>
            </Link>

            <div className="flex items-center gap-2 mt-2">
              <p className="text-lg font-bold text-red-600">
                ₹{item.product.variants[0]?.newPrice}
              </p>

              <p className="text-sm line-through text-gray-500">
                ₹{item.product.variants[0]?.oldPrice}
              </p>

              <p className="text-sm text-green-600 font-semibold">
                {Math.floor(
                  ((item.product.variants[0].oldPrice -
                    item.product.variants[0].newPrice) /
                    item.product.variants[0].oldPrice) *
                    100
                )}
                % off
              </p>
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => removeFromWishlist(item.product._id)}
            className="w-full py-3 text-center border-t border-gray-300 text-red-600 font-bold hover:bg-red-600 hover:text-white transition-all"
          >
            REMOVE
          </button>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default Wishlist;
