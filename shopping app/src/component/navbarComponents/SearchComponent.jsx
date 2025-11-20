import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const SearchComponent = ({ isMobile }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const searchIconRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search?query=${search}`);
  };

  // Desktop animation only
  useEffect(() => {
    if (isMobile) return;

    if (showSearch) {
      gsap.to(searchIconRef.current, {
        x: -350,
        duration: 1,
        ease: "expo.inOut",
        color: "#000000"
      });

      gsap.to(searchInputRef.current, {
        width: "380px",
        opacity: 1,
        duration: 1,
        ease: "expo.inOut"
      });
    } else {
      gsap.to(searchIconRef.current, { x: 0, duration: 0.6, color: "#ffffff" });
      gsap.to(searchInputRef.current, { width: "0px", opacity: 0, duration: 0.6 });
    }
  }, [showSearch, isMobile]);

  // ------------------------------
  // MOBILE VERSION (icon outside)
  // ------------------------------
  if (isMobile) {
    return (
      <div className="relative w-auto">
        {/* The search icon beside burger */}
        <i
          className="ri-search-line text-2xl"
          onClick={() => setShowSearch(!showSearch)}
        ></i>

        {/* Dropdown search bar */}
        {showSearch && (
          <div className="absolute left-1/2 -translate-x-[80%] top-10 w-screen px-4 z-50">
            <div className="flex items-center gap-3 bg-white text-black px-3 py-2 rounded-lg shadow-lg">
              <form onSubmit={handleSearch} className="flex-1">
                <input
                  type="text"
                  placeholder="Search for Products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white text-black outline-none"
                />
              </form>

              <i
                className="ri-close-line text-2xl"
                onClick={() => setShowSearch(false)}
              ></i>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ------------------------------
  // DESKTOP VERSION (GSAP)
  // ------------------------------
  return (
    <div className="relative flex items-center cursor-pointer">
      <div
        ref={searchIconRef}
        onClick={() => setShowSearch(true)}
        className="cursor-pointer z-30"
      >
        <i className="ri-search-line"></i>
      </div>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          ref={searchInputRef}
          placeholder="Search for Products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="absolute -top-2 right-0 px-10 py-2 rounded-lg text-black border w-0 opacity-0"
        />
      </form>

      <div
        className={`font-semibold absolute right-4 text-black ${
          showSearch ? "visible" : "hidden"
        }`}
        onClick={() => setShowSearch(false)}
      >
        X
      </div>
    </div>
  );
};

export default SearchComponent;
