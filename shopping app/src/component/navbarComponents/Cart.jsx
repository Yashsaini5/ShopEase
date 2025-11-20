import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../../context/DataProvider";
import { useNavigate, useLocation } from "react-router-dom";

const Cart = () => {
  const { cart, user, fetchCart, updatedCartQuantity, removeFromCart } =
    useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [userLoading, setUserLoading] = useState(false);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.variant?.oldPrice * item.quantity,
    0
  );
  const discountedPrice = cart.reduce(
    (acc, item) =>
      acc + (item.variant?.oldPrice - item.variant?.newPrice) * item.quantity,
    0
  );
  const totalAmount = cart.reduce(
    (acc, item) => acc + item.variant?.newPrice * item.quantity,
    0
  );

  useEffect(() => {
    if(user === null) return;
      if(user === undefined) return;

      setUserLoading(true)

      if(!user){
        localStorage.setItem("redirectAfterLogin", location.pathname);
        navigate("/login", { replace: true });
        return;
      }
       fetchCart(user)
    
  }, [user, navigate, location]);

  return (
    <>
      {user && (
        <div className="flex flex-col min-h-screen bg-stone-100">
          <div className="h-16"></div>
          <div className=" lg:flex-row flex-grow flex flex-col items-center justify-center w-full px-4 py-10">
            {/* Cart Items */}
            <div className="cartItem px-2 w-full max-w-4xl mx-auto">
              <p className="text-3xl font-bold mb-8 text-center border-b-4 border-gray-400 pb-2">
                Your Cart
              </p>
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                  <i className="ri-shopping-cart-2-line text-6xl text-gray-400 mb-4"></i>
                  <p className="text-lg mb-6">Your cart is empty</p>
                  <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all duration-300 shadow-md"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item._id}
                    className="w-full border rounded-lg p-4 mb-6 shadow-sm hover:shadow-md transition-all bg-white flex gap-6"
                  >
                    <Link
                      to={`/product/${item?.product?._id}`}
                      className="w-28 h-28 flex-shrink-0 overflow-hidden border border-gray-300 rounded-md"
                    >
                      {item.product?.images?.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                          No Image
                        </div>
                      )}
                    </Link>
                    <div className="flex flex-col flex-grow justify-between">
                      <div>
                        <Link to={`/product/${item?.product?._id}`}>
                          <p className="text-lg font-semibold hover:underline">
                            {item.product?.name || "Product Not Found"}
                          </p>
                        </Link>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <p className="text-xl font-bold text-black">
                              ₹{item.variant?.newPrice}
                            </p>
                            <p className="line-through text-gray-400">
                              ₹{item.variant?.oldPrice}
                            </p>
                            <p className="text-green-600">
                              {Math.floor(
                                ((item.variant?.oldPrice -
                                  item.variant?.newPrice) /
                                  item.variant?.oldPrice) *
                                  100
                              )}
                              % off
                            </p>
                          </div>
                          <div className="bg-gray-100 px-3 py-1 rounded-md font-medium">
                            Size: {item.variant?.size}
                          </div>
                        </div>
                      </div>
                      <div className="flex mt-4 items-center gap-5">
                        <div className="flex border rounded overflow-hidden">
                          <button
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300"
                            onClick={() =>
                              updatedCartQuantity(
                                item.product._id,
                                item.quantity - 1,
                                item.variant.size
                              )
                            }
                          >
                            -
                          </button>
                          <div className="w-10 h-8 flex items-center justify-center bg-gray-100 font-medium">
                            {item.quantity}
                          </div>
                          <button
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300"
                            onClick={() =>
                              updatedCartQuantity(
                                item.product._id,
                                item.quantity + 1,
                                item.variant.size
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            removeFromCart(item.product._id, item.variant.size)
                          }
                          className="text-red-500 hover:text-red-600"
                        >
                          <i className="ri-delete-bin-6-line text-xl"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Total */}
            {cartItemCount > 0 && (
              <div className="cartTotal bg-white shadow-md rounded-lg p-6 w-full md:w-2/3 lg:w-1/3 sticky top-32 h-fit">
                <p className="text-2xl font-bold mb-4 text-center border-b pb-2">
                  Cart Summary
                </p>

                <div className="space-y-4 text-gray-700 text-base">
                  <div className="flex justify-between">
                    <p>Subtotal ({cartItemCount} items)</p>
                    <p>₹{subtotal}.00</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Discount</p>
                    <p className="text-green-600">- ₹{discountedPrice}.00</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Delivery Fee</p>
                    <p>₹40.00</p>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold text-lg">
                    <p>Total</p>
                    <p>₹{totalAmount + 40}.00</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/orderPlace")}
                  className="mt-6 w-full py-3 bg-orange-500 text-white text-lg font-semibold rounded-full hover:bg-orange-600 transition-all"
                >
                  Proceed to Buy
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
