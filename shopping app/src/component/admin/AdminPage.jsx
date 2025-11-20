import React, { useContext, useEffect } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataProvider";
import AddItem from "./pages/AddItem";
import ItemList from "./pages/ItemList";
import Order from "./pages/Order";
import AddCategory from "./pages/AddCategory";
import EditProduct from "./pages/EditProduct";

const AdminPage = () => {
  const { user, setUser } = useContext(DataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== "admin") navigate("/");
  }, [user]);

  const sidebarLinks = [
    { name: "Add Item", path: "" },
    { name: "Item List", path: "list" },
    { name: "Order", path: "order" },
  ];

  const handleLogout = async () => { 
    try { 
    // 1️⃣ Firebase logout 
    await signOut(auth); 
  } catch (error)
   { console.warn("Firebase sign-out skipped or failed:", error.message); } 
   try { 
    // 2️⃣ Clear JWT token (from cookies) 
    document.cookie = "token=; path=/; max-age=0; secure; samesite=strict"; 
    // 3️⃣ Optional: Tell backend to invalidate token (if you store sessions) 
    await fetch('${import.meta.env.VITE_BACKEND_URL}/api/user/logout', { method: "POST", credentials: "include" }); 
    } catch (err) {
       console.warn("Server logout failed:", err.message); } 
       // 4️⃣ Clear user state and navigate 
       setUser(null); navigate("/"); };

  return (
    <div className="h-screen w-screen overflow-hidden">

     {/* TOP NAVBAR */}
<div className="fixed top-0 left-0 right-0 h-16 bg-black flex items-center justify-between px-4 md:px-8 z-50">

  {/* LEFT SECTION — LOGO + ADMIN TITLE */}
  <div className="flex flex-col md:flex-row md:items-center text-white">

    <div className="font-bold text-2xl md:text-3xl leading-tight">
      ShopEase's
    </div>

    <div className="font-medium text-sm md:text-base md:pl-2 md:pt-1 leading-tight">
      Admin Panel
    </div>
  </div>

  {/* RIGHT SECTION — BUTTONS */}
  <div className="flex gap-2 md:gap-3">

    <button
      className="text-white text-sm md:text-lg bg-stone-600 rounded-full py-1 px-3 md:px-6 cursor-pointer whitespace-nowrap"
      onClick={() => navigate("/")}
    >
      Home
    </button>

    <button
      className="text-white text-sm md:text-lg bg-gray-700 rounded-full py-1 px-3 md:px-6 cursor-pointer whitespace-nowrap"
      onClick={handleLogout}
    >
      Logout
    </button>

  </div>
</div>

      {/* ============= SIDEBAR DESKTOP + TOPBAR MOBILE ============= */}

      {/* MOBILE → Horizontal top menu */}
      <div className="md:hidden fixed top-16 left-0 right-0 bg-stone-800 flex justify-around py-3 z-40">
        {sidebarLinks.map(({ name, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `text-white font-semibold px-3 py-1 rounded 
              ${isActive ? "bg-amber-600" : "bg-stone-700"}`
            }
          >
            {name}
          </NavLink>
        ))}
      </div>

      {/* DESKTOP → Vertical sidebar */}
      <div className="hidden md:flex fixed top-16 left-0 h-[calc(100%-4rem)] w-1/5 bg-stone-800 flex-col items-end z-40">
        {sidebarLinks.map(({ name, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `w-2/3 text-white border-2 border-amber-900 bg-amber-700 py-2 pr-2 
              font-semibold text-lg my-5 text-end rounded-l-lg
              ${isActive ? "bg-amber-600" : ""}`
            }
          >
            {name}
          </NavLink>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="md:ml-[20%] mt-16 md:mt-16 h-[calc(100%-4rem)] overflow-y-auto bg-slate-100 p-8">
        <Routes>
          <Route path="" element={<AddItem />} />
          <Route path="list" element={<ItemList />} />
          <Route path="order" element={<Order />} />
          <Route path="addCategory" element={<AddCategory />} />
          <Route path="/products/:id" element={<EditProduct />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage

