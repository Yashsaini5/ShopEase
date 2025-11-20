import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});

     const apiUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
  apiUrl + '/api/order/orderList',
  { withCredentials: true } 
);
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdates(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const updateOrderStatus = async (orderId) => {
    const newStatus = statusUpdates[orderId];
    if (!newStatus) return;

    try {
      const res = await axios.post( apiUrl + '/api/order/status', {
        orderId,
        status: newStatus,
      },{withCredentials:true});

      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      alert('Order status updated!');
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg w-[95%]">
  <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Orders</h1>

  {/* DESKTOP TABLE */}
  <div className="hidden md:block overflow-x-auto">
    <table className="min-w-full border border-gray-300 text-sm text-center">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="p-3 border">#</th>
          <th className="p-3 border">User</th>
          <th className="p-3 border">Products</th>
          <th className="p-3 border">Total</th>
          <th className="p-3 border">Payment</th>
          <th className="p-3 border">Status</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order, index) => (
          <tr key={order._id} className="bg-white border-b hover:bg-gray-50">
            <td className="px-4 py-3">{index + 1}</td>

            <td className="px-4 py-3">{order.user?.username || "Unknown"}</td>

            <td className="px-4 py-3">
              {order.products.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center gap-2 mb-2"
                >
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="text-left">
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-600">
                      Size: {item.size}
                    </div>
                    <div className="text-xs">
                      ₹{item.price} × {item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </td>

            <td className="px-4 py-3 font-semibold">
              ₹{order.totalAmount}
            </td>

            <td className="px-4 py-3">
              <div>{order.paymentDetails.method}</div>
              <div
                className={`text-sm font-medium ${
                  order.paymentDetails.status === "paid"
                    ? "text-green-600"
                    : order.paymentDetails.status === "failed"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {order.paymentDetails.status}
              </div>
            </td>

            <td className="px-4 py-3">
              <select
                value={statusUpdates[order._id] || order.status}
                onChange={(e) =>
                  handleStatusChange(order._id, e.target.value)
                }
                className="bg-gray-100 px-2 py-1 rounded text-sm mb-2"
              >
                <option>Order Placed</option>
                <option>Packing</option>
                <option>Shipped</option>
                <option>Out For Delivery</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>

              <button
                onClick={() => updateOrderStatus(order._id)}
                className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              >
                Save
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* MOBILE CARD VIEW */}
  <div className="md:hidden space-y-4">
    {orders.map((order, i) => (
      <div
        key={order._id}
        className="bg-white shadow-lg rounded-lg p-4 border"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg">Order #{i + 1}</h2>
          <span className="text-sm text-gray-600">
            {order.user?.username || "Unknown"}
          </span>
        </div>

        {/* Products */}
        <div className="space-y-3 mb-3">
          {order.products.map((item, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <img
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                className="w-14 h-14 rounded object-cover"
              />

              <div>
                <div className="font-medium text-gray-800">{item.name}</div>
                <div className="text-xs text-gray-500">
                  Size: {item.size}
                </div>
                <div className="text-xs">
                  ₹{item.price} × {item.quantity}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="text-right font-semibold text-lg mb-3">
          ₹{order.totalAmount}
        </div>

        {/* Payment */}
        <div className="mb-3">
          <div className="text-sm text-gray-600">
            Method: {order.paymentDetails.method}
          </div>
          <div
            className={`text-sm font-medium ${
              order.paymentDetails.status === "paid"
                ? "text-green-600"
                : order.paymentDetails.status === "failed"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {order.paymentDetails.status}
          </div>
        </div>

        {/* Status & Button */}
        <div className="flex flex-col gap-3">
          <select
            value={statusUpdates[order._id] || order.status}
            onChange={(e) =>
              handleStatusChange(order._id, e.target.value)
            }
            className="bg-gray-100 px-3 py-2 rounded text-sm"
          >
            <option>Order Placed</option>
            <option>Packing</option>
            <option>Shipped</option>
            <option>Out For Delivery</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>

          <button
            onClick={() => updateOrderStatus(order._id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold self-end"
          >
            Save
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default Order;
