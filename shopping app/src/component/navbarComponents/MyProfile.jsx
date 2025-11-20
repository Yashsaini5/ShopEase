import React, { useContext, useState } from "react";
import { DataContext } from "../../context/DataProvider";
import { useNavigate } from "react-router-dom";
import { NavLink, Routes, Route } from "react-router-dom";
import ProfileInfo from "../myProfileComponents/ProfileInfo";
import ManageAddress from "../myProfileComponents/ManageAddress";
import GiftCards from "../myProfileComponents/GiftCards";
import SavedUpi from "../myProfileComponents/SavedUpi";
import SavedCards from "../myProfileComponents/SavedCards";

const MyProfile = () => {
  const { user, setUser } = useContext(DataContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 1️⃣ Firebase logout (if using Firebase Auth)
      await signOut(auth);
    } catch (error) {
      console.warn("Firebase sign-out skipped or failed:", error.message);
    }

    try {
      // 2️⃣ Clear JWT token (from cookies)
      document.cookie = "token=; path=/; max-age=0; secure; samesite=strict";

      // 3️⃣ Optional: Tell backend to invalidate token (if you store sessions)
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`, {
        method: "POST",
        credentials: "include", // ensures cookies are sent
      });
    } catch (err) {
      console.warn("Server logout failed:", err.message);
    }

    // 4️⃣ Clear user state and navigate
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <div className="h-16"></div>

      <div className="bg-gray-100 min-h-screen">
        {/* --- MOBILE NAV TABS --- */}
        <div className="md:hidden bg-white shadow-md px-4 py-3 flex gap-4 overflow-x-auto no-scrollbar">
          {/* ONLY THESE ARE INSIDE PROFILE FLOW */}
          <NavLink
            to="/myProfile"
            end
            className={({ isActive }) =>
              `whitespace-nowrap px-3 py-2 rounded-md text-sm ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`
            }
          >
            Profile
          </NavLink>

          <NavLink
            to="/myProfile/address"
            className={({ isActive }) =>
              `whitespace-nowrap px-3 py-2 rounded-md text-sm ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`
            }
          >
            Addresses
          </NavLink>

          {/* --- THESE ARE GLOBAL ROUTES --- */}
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `whitespace-nowrap px-3 py-2 rounded-md text-sm ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`
            }
          >
            Orders
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `whitespace-nowrap px-3 py-2 rounded-md text-sm ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`
            }
          >
            Cart
          </NavLink>

          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `whitespace-nowrap px-3 py-2 rounded-md text-sm ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`
            }
          >
            Wishlist
          </NavLink>

          {user?.role === "admin" && (
            <span
              onClick={() => navigate("/admin")}
              className="whitespace-nowrap px-3 py-2 rounded-md text-sm bg-gray-200 text-gray-700 cursor-pointer"
            >
              Admin
            </span>
          )}
        </div>

        {/* --- DESKTOP LAYOUT (fixed: sidebar visible again) --- */}
        <div className="hidden md:flex min-h-screen">
          {/* Sidebar */}
          <div className="w-72 bg-white shadow-xl p-6 rounded-lg">
            {/* Profile Block */}{" "}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full mx-auto flex items-center justify-center text-4xl font-semibold">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <h2 className="mt-3 text-lg text-gray-600">Hello,</h2>{" "}
              <p className="text-xl font-semibold text-gray-800">
                {" "}
                {user?.username} {/* {user?.firstName} {user?.lastName} */}{" "}
              </p>{" "}
            </div>{" "}
            {/* Sidebar Sections */}{" "}
            <div className="text-sm text-gray-700">
              {" "}
              {/* Account Settings */}{" "}
              <div className="py-3">
                {" "}
                <p className="font-bold text-gray-900 mb-2 pl-2">
                  {" "}
                  ACCOUNT SETTINGS{" "}
                </p>{" "}
                <ul className="space-y-2 pl-4">
                  {" "}
                  <li>
                    {" "}
                    <NavLink
                      to=""
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-600 font-semibold"
                          : "hover:text-blue-600"
                      }
                    >
                      {" "}
                      Profile Information{" "}
                    </NavLink>{" "}
                  </li>{" "}
                  <li>
                    {" "}
                    <NavLink
                      to="address"
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-600 font-semibold"
                          : "hover:text-blue-600"
                      }
                    >
                      {" "}
                      Manage Addresses{" "}
                    </NavLink>{" "}
                  </li>{" "}
                </ul>{" "}
              </div>{" "}
              {/* Payments */}{" "}
              <div className="py-3">
                {" "}
                <p className="font-bold text-gray-900 mb-2 pl-2">
                  PAYMENTS
                </p>{" "}
                <ul className="space-y-2 pl-4">
                  {" "}
                  <li className="flex justify-between items-center">
                    {" "}
                    <NavLink
                      to="giftcards"
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-600 font-semibold"
                          : "hover:text-blue-600"
                      }
                    >
                      {" "}
                      Gift Cards{" "}
                    </NavLink>{" "}
                    <span className="text-green-600 font-semibold">
                      ₹0
                    </span>{" "}
                  </li>{" "}
                  <li>
                    {" "}
                    <NavLink
                      to="upi"
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-600 font-semibold"
                          : "hover:text-blue-600"
                      }
                    >
                      {" "}
                      Saved UPI{" "}
                    </NavLink>{" "}
                  </li>{" "}
                  <li>
                    {" "}
                    <NavLink
                      to="cards"
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-600 font-semibold"
                          : "hover:text-blue-600"
                      }
                    >
                      {" "}
                      Saved Cards{" "}
                    </NavLink>{" "}
                  </li>{" "}
                </ul>{" "}
              </div>{" "}
              {user?.role === "admin" ? (
                <div>
                  {" "}
                  <p
                    className="py-3 pl-2 font-bold text-gray-900 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/admin")}
                  >
                    {" "}
                    ADMIN PANEL{" "}
                  </p>{" "}
                </div>
              ) : (
                <></>
              )}{" "}
              {/* Orders */}{" "}
              <div>
                {" "}
                <p
                  className="py-3 pl-2 font-bold text-gray-900 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate("/orders")}
                >
                  {" "}
                  MY ORDERS{" "}
                </p>{" "}
              </div>{" "}
              <div>
                {" "}
                <p
                  className="py-3 pl-2 font-bold text-gray-900 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate("/cart")}
                >
                  {" "}
                  MY CART{" "}
                </p>{" "}
              </div>{" "}
              <div>
                {" "}
                <p
                  className="py-3 pl-2 font-bold text-gray-900 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate("/wishlist")}
                >
                  {" "}
                  MY WISHLIST{" "}
                </p>{" "}
              </div>{" "}
              <div>
                {" "}
                <p
                  className="py-3 pl-2 font-bold text-gray-900 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  {" "}
                  LOGOUT{" "}
                </p>{" "}
              </div>{" "}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow bg-gray-100 p-6">
            <Routes>
              <Route path="" element={<ProfileInfo />} />
              <Route path="address" element={<ManageAddress />} />
              <Route path="giftcards" element={<GiftCards />} />
              <Route path="upi" element={<SavedUpi />} />
              <Route path="cards" element={<SavedCards />} />
            </Routes>
          </div>
        </div>

        {/* --- MOBILE MAIN CONTENT --- */}
        <div className="md:hidden p-4">
          <Routes>
            <Route path="" element={<ProfileInfo />} />
            <Route path="address" element={<ManageAddress />} />

            <Route path="giftcards" element={<GiftCards />} />
            <Route path="upi" element={<SavedUpi />} />
            <Route path="cards" element={<SavedCards />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
