import React, { useRef, useState, useEffect, useContext } from "react";
import gsap from "gsap";
import { NavLink } from "react-router-dom";
import { DataContext } from "../../context/DataProvider";
import SearchComponent from "./SearchComponent";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";

const Navbar = ({}) => {
  const { user, setUser, cart, fetchCart} = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);
  const [userIcon, setUserIcon] = useState("");
  const [cartItemCount, setCartItemCount] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setUserIcon(user.username?.toUpperCase().substring(0, 1) || "");
      fetchCart(); // will now run only once per login
    }
  }, [user]);

    useEffect(() => {
    if (cart && cart.length > 0) {
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(count);
    } else {
      setCartItemCount(0);
    }
  }, [cart]);

  const gsapLogoOpacity = useRef();
  const gsapHomeOpacity = useRef();
  const gsapCategoryOpacity = useRef();
  const gsapAboutOpacity = useRef();
  const gsapicon1Opacity = useRef();
  const gsapicon2Opacity = useRef();
  const gsapicon3Opacity = useRef();
  const gsapicon4Opacity = useRef();

  const navList = [
    {
      Name: "Home",
      path: "/",
      ref: gsapHomeOpacity
    },{
      Name: "Categories",
      path: "/Categories",
      ref: gsapCategoryOpacity
    },{
      Name: "About Us",
      path: "/About",
      ref: gsapAboutOpacity
    }]

  useEffect(() => {
    // Create a GSAP timeline
    const tl = gsap.timeline({
      defaults: { duration: 0.3, opacity: 1, ease: "power1.inOut" },
    });

    // Add animations to the timeline in sequence
    tl.to(gsapLogoOpacity.current, { opacity: 1, duration: 0.6 })
      .to(gsapHomeOpacity.current, { opacity: 1, duration: 0.2 })
      .to(gsapCategoryOpacity.current, { opacity: 1, duration: 0.2 })
      .to(gsapAboutOpacity.current, { opacity: 1, duration: 0.2 })
      .to(gsapicon1Opacity.current, { x: -45, duration: 0.2 })
      .to(gsapicon2Opacity.current, { x: -45, duration: 0.2 })
      .to(gsapicon3Opacity.current, { x: -45, duration: 0.2 })
      .to(gsapicon4Opacity.current, { x: -45, duration: 0.2 });
  }, []);

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
  setCartItemCount(0);
  navigate("/");
};

  return (
   <header className="text-white fixed z-50 w-full">
  <div className="w-full h-16 bg-black flex items-center justify-between px-6 md:px-10">

    {/* Logo */}
    <div ref={gsapLogoOpacity} className="font-bold text-3xl opacity-0">
      <NavLink to="/">ShopEase</NavLink>
    </div>

    {/* Hamburger for Mobile */}
    <div className="md:hidden flex items-center gap-4">
      <SearchComponent isMobile={true} />
      <i
        className={`text-3xl cursor-pointer transition-transform ${
          menuOpen ? "ri-close-line" : "ri-menu-line"
        }`}
        onClick={() => setMenuOpen(!menuOpen)}
      ></i>
    </div>

    {/* Desktop Nav */}
    <div className="hidden md:flex gap-8">
      {navList.map((list, index) => (
        <div key={index} ref={list.ref} className="font-medium opacity-0">
          <NavLink to={list.path}>{list.Name}</NavLink>
        </div>
      ))}
    </div>

    {/* Icons */}
    <div className="hidden md:flex h-full max-w-48 items-center gap-6">

      {/* Search Icon */}
      <div
        ref={gsapicon1Opacity}
        className="cursor-pointer flex items-center justify-center h-full w-10 opacity-0 pl-4"
      >
        <div className="transition-transform hover:scale-110">
          <SearchComponent isMobile={false} />
        </div>
      </div>

      {/* Wishlist */}
      <div
        ref={gsapicon2Opacity}
        className="flex items-center justify-center h-full w-10 opacity-0 pl-4"
      >
        <NavLink to="/Wishlist" className="transition-transform hover:scale-110">
          <i className="ri-heart-fill text-xl"></i>
        </NavLink>
      </div>

      {/* Cart */}
      <div
        ref={gsapicon3Opacity}
        className="flex items-center justify-center h-full w-10 opacity-0 relative pl-4"
      >
        <NavLink
          to="/Cart"
          className="transition-transform hover:scale-110 relative"
        >
          <i className="ri-shopping-cart-2-fill text-xl"></i>
          {cartItemCount > 0 && (
            <span className="absolute -right-2 -top-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </NavLink>
      </div>

      {/* User Profile */}
      <div
        ref={gsapicon4Opacity}
        className="flex items-center justify-center h-full w-14 opacity-0 relative pl-4"
      >
        {user ? (
          <>
            <div
              className="w-9 h-9 bg-indigo-400 rounded-full flex justify-center items-center transition-transform hover:scale-110 cursor-pointer"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              {userIcon}
            </div>

            {isOpen && (
              <div
                className="dropdown absolute top-12 right-0 w-40 bg-gray-200 rounded-lg shadow-2xl z-50"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
              >
                <NavLink to="/MyProfile">
                  <div className="px-3 py-3 border-b border-gray-400 hover:bg-gray-300 flex items-center gap-3 text-black">
                    <i className="ri-user-line"></i> My Profile
                  </div>
                </NavLink>

                <NavLink to="/Orders">
                  <div className="px-3 py-3 border-b border-gray-400 hover:bg-gray-300 flex items-center gap-3 text-black">
                    <i className="ri-box-3-line"></i> Orders
                  </div>
                </NavLink>

                <div
                  className="px-3 py-3 hover:bg-gray-300 flex items-center gap-3 text-black cursor-pointer"
                  onClick={handleLogout}
                >
                  <i className="ri-logout-box-r-line"></i> Logout
                </div>
              </div>
            )}
          </>
        ) : (
          <NavLink
            to="/LogIn"
            className="transition-transform hover:scale-110"
          >
            <i className="ri-user-fill text-xl"></i>
          </NavLink>
        )}
      </div>
    </div>
  </div>

  {/* Mobile Menu */}
  {menuOpen && (
    <>
      {/* FULL PAGE BACKDROP — clicks close menu */}
      <div
        className="fixed inset-0 z-999"
        onClick={() => setMenuOpen(false)}
      ></div>

      {/* MENU PANEL */}
      <div className="md:hidden bg-black w-full px-6 pb-5 flex flex-col gap-4 text-lg z-50 relative">

        {navList.map((list, index) => (
          <NavLink
            to={list.path}
            key={index}
            onClick={() => setMenuOpen(false)}
            className="border-b border-gray-700 py-2"
          >
            {list.Name}
          </NavLink>
        ))}

        {/* Icons */}
        <div className="flex items-center justify-between mt-4">

          <NavLink to="/Wishlist">
            <i className="ri-heart-fill text-2xl" onClick={() => setMenuOpen(false)}></i>
          </NavLink>

          <NavLink to="/Cart" className="relative">
            <i className="ri-shopping-cart-2-fill text-2xl" onClick={() => setMenuOpen(false)}></i>
            {cartItemCount > 0 && (
              <span className="absolute -right-1 -top-2 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </NavLink>

          {user ? (
            <NavLink to="/MyProfile">
              <i className="ri-user-fill text-2xl" onClick={() => setMenuOpen(false)}></i>
            </NavLink>
          ) : (
            <NavLink to="/LogIn">
              <i className="ri-user-fill text-2xl" onClick={() => setMenuOpen(false)}></i>
            </NavLink>
          )}
        </div>
      </div>
    </>
  )}
</header>

  );
  // }
};

export default Navbar;
