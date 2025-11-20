import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../../context/DataProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderPlace = () => {
  const { cart, setCart, user, fetchCart } = useContext(DataContext);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedAddressButton, setSelectedAddressButton] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
    const navigate = useNavigate();
  const totalAmount = cart.reduce(
    (acc, item) => acc + item.variant?.newPrice * item.quantity,
    0
  );

  useEffect(() => {
    if (user) {
      fetchCart(user);
    }
  }, [user]);

  const handleAddressSelection = () => {
    const newButtonState = !selectedAddressButton;
    setSelectedAddressButton(newButtonState)
    newButtonState ? setSelectedAddress(user.addresses[selectedAddressIndex]) : setSelectedAddress(null)
  };
  

  const handlePaymentChange = (e) => {
    setPaymentData( e.target.value );
  };

     const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(selectedAddress == null){
      alert("Please select the address...")
      return
    }

    if(paymentData == null){
      alert("Please select the Payment Method...")
      return
    }

    if (!cart || cart.length === 0) {
      alert("No products in the cart!");
      return;
    }

    const orderProducts = {
      products: cart.map((item) => ({ //as cart.map return array and array of object could be the value of the key
        productId: item.product._id,
        quantity: item.quantity,
        size: item.variant.size,
        price: item.variant.newPrice,
        name: item.product?.name,
        image: item.product?.images[0],
      })),
      shippingAddress: selectedAddress,
      totalAmount,
      paymentMethod: paymentData,
    };

    try {
      const endpoint = apiUrl + `/api/order/placeOrder${paymentData}`;
      const response = await axios.post(endpoint, orderProducts, {
        withCredentials: true,
      });

      // console.log("order placed successfully", response.data);

      if (paymentData === "Stripe") {
        // Redirect to Stripe checkout page
        const sessionUrl = response.data.url;
        // console.log("order placed successfully", response.data);
        // console.log("Session URL:", sessionUrl);
        if (!sessionUrl) {
          console.error("Stripe session URL is missing!");
          return alert("Something went wrong while connecting to Stripe.");
        } else {
          window.location.href = sessionUrl;
        }

        // This comes from session.url in backend
      } else {
        // Reset form & navigate to Orders page (for COD or other methods)
       
        setSelectedAddress(null)
        setSelectedAddressButton(false)
        setPaymentData(null)
        setCart([]);
        navigate("/Orders");
      }
    } catch (err) {
      console.error("Order error:", err);
    }

    // console.log("Order Placed", paymentData);
  };

  return (
   <>
  <div className="flex flex-col items-center min-h-screen bg-gray-100 overflow-x-hidden">
    <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 md:p-8 grid gap-12 mt-24">

      <h2 className="text-2xl font-bold text-center underline">Checkout</h2>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row gap-10 md:gap-12 w-full">

        {/* LEFT — Address List */}
        <div className="flex-1 overflow-y-auto max-h-[600px] pr-1 md:pr-2">
          <h3 className="text-lg font-semibold mb-3">Delivery Information</h3>

          {user?.addresses?.map((addr, i) => (
            <div
              key={i}
              className={`relative w-full rounded-xl border-2 p-6 transition-all duration-300 mb-4
                ${
                  selectedAddressIndex === i
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 bg-white"
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="selectedAddress"
                    checked={selectedAddressIndex === i}
                    onChange={() => setSelectedAddressIndex(i)}
                    className="accent-blue-600 mt-0.5"
                  />

                  <h4 className="text-base font-semibold">
                    {addr.firstName} {addr.lastName}
                  </h4>

                  <span className="ml-2 bg-gray-200 text-xs font-medium px-2 py-0.5 rounded">
                    HOME
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-700 font-semibold mt-2">
                {addr.phone}
              </p>
              <p className="text-sm text-gray-700">{addr.street}</p>
              <p className="text-sm text-gray-700">
                {addr.city}, {addr.state} -
                <span className="font-semibold"> {addr.zipcode}</span>
              </p>
              <p className="text-sm text-gray-700">{addr.country}</p>

              {selectedAddressIndex === i && (
                <button
                  className={`${
                    selectedAddressButton
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-orange-500 hover:bg-orange-600"
                  } mt-4 w-full text-white text-sm py-2 rounded shadow`}
                  onClick={handleAddressSelection}
                >
                  {selectedAddressButton ? "SELECTED ✅" : "DELIVER HERE"}
                </button>
              )}
            </div>
          ))}

          <button
            className="mt-4 w-full bg-blue-400 hover:bg-blue-600 text-white text-sm py-2 rounded shadow"
            onClick={() => navigate("/MyProfile/address")}
          >
            Add New Address
          </button>
        </div>

        {/* RIGHT — Payment and Total */}
        <div className="w-full md:w-[380px] flex-shrink-0 md:pl-2">
          <h3 className="text-lg font-semibold mb-3">Cart Total</h3>

          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between mb-2 border-b-2 border-gray-400 pb-3">
              <p>Subtotal:</p>
              <p>₹ {totalAmount}.00</p>
            </div>

            <div className="flex justify-between mb-2 border-b-2 border-gray-400 pb-3">
              <p>Delivery Fee:</p>
              <p>₹ 40.00</p>
            </div>

            <div className="flex justify-between font-bold">
              <p>Total Amount:</p>
              <p>₹ {totalAmount + 40}.00</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3">Payment Method</h3>

          {/* FIXED RESPONSIVE PAYMENT ROW */}
          <div className="grid grid-cols-3 gap-2 w-full">
            {/* Stripe */}
            <label className="cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="Stripe"
                onChange={handlePaymentChange}
                className="hidden"
              />
              <span
                className={`flex items-center justify-center h-12 border rounded-lg overflow-hidden ${
                  paymentData === "Stripe"
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-300"
                }`}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/1200px-Stripe_Logo%2C_revised_2016.svg.png"
                  className="h-full w-auto object-contain"
                />
              </span>
            </label>

            {/* Razorpay */}
            <label className="cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="Razorpay"
                onChange={handlePaymentChange}
                className="hidden"
              />
              <span
                className={`flex items-center justify-center h-12 border rounded-lg overflow-hidden ${
                  paymentData === "Razorpay"
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-300"
                }`}
              >
                <img
                  src="https://episyche.com/_next/image?url=https%3A%2F%2Fepisyche-blog.s3.ap-south-1.amazonaws.com%2FDjango%2FPayments%2FRazorpay%2FSubscription%2F11%2Fthumbnail_image%2Fe3d32020-0cd6-4bf4-b610-e202be5bf270.png&w=1200&q=75"
                  className="h-full object-contain"
                />
              </span>
            </label>

            {/* COD */}
            <label className="cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                onChange={handlePaymentChange}
                className="hidden"
              />
              <span
                className={`flex items-center justify-center h-12 border rounded-lg font-bold ${
                  paymentData === "COD"
                    ? "border-green-500 bg-green-100"
                    : "border-gray-300"
                }`}
              >
                COD
              </span>
            </label>
          </div>

          <button
            type="button"
            className="mt-6 w-full bg-black text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition"
            onClick={handleSubmit}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  </div>
</>

  );
};

export default OrderPlace;
