import React, { useState, useEffect, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { DataContext } from "../../context/DataProvider";
import ProductCard from "./ProductCard.jsx";

const ProductList = () => {
  const { data, addToWishlist, removeFromWishlist, wishlist, fetchWishlist } =
    useContext(DataContext);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLiked, setIsLiked] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [dropBrand, setDropBrand] = useState(false);
  const [dropSubCat, setDropSubCat] = useState(false);
  const [dropSizes, setDropSizes] = useState(false);
  const [dropPrice, setDropPrice] = useState(false);
  const [filters, setFilters] = useState({
    brand: [],
    size: [],
    subcategory: [],
    minPrice: "",
    maxPrice: "",
  });
  const [sortBy, setSortBy] = useState("relevance");
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);
  const subcategoryLimit = 5;
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 28;

  const uniqueBrand = [...new Set(searchedProducts?.map((p) => p.brand))];
  const uniqueSizes = [
    ...new Set(searchedProducts?.flatMap((p) => p.variants.map((v) => v.size))),
  ];
  const uniqueSubcategories = [
    ...new Set(searchedProducts?.map((p) => p.subCategory)),
  ];
  const allPrices = searchedProducts?.flatMap((p) =>
    p.variants.map((v) => v.newPrice)
  );
  const minPrice = allPrices?.length ? Math.min(...allPrices) : 0;
  const maxPrice = allPrices?.length ? Math.max(...allPrices) : 0;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    if (query) {
      let results = data?.filter((product) => {
        return (
          product.category.name?.toLowerCase().includes(query.toLowerCase()) ||
          product.subCategory?.toLowerCase().includes(query.toLowerCase()) ||
          product.name?.toLowerCase().includes(query.toLowerCase())
        );
      });
      // console.log(results);
      setSearchedProducts(results);
      setFilteredProducts(results);

      // Apply filters
      let filteredResults = results;
      if (filters) {
        filteredResults =
          results?.filter((product) => {
            return (
              (!filters.brand.length ||
                filters.brand.includes(product.brand)) &&
              (!filters.size.length ||
                product.variants.some((variant) =>
                  filters.size.includes(variant.size)
                )) &&
              (!filters.subcategory.length ||
                filters.subcategory.includes(product.subCategory)) &&
              (!filters.minPrice ||
                product.variants.some(
                  (variant) => variant.newPrice >= filters.minPrice
                )) &&
              (!filters.maxPrice ||
                product.variants.some(
                  (variant) => variant.newPrice <= filters.maxPrice
                ))
            );
          }) || [];
        // setFilteredProducts(filteredResults)
      }

      // Apply sorting logic
      let sortedResults = Array.isArray(filteredResults)
        ? [...filteredResults]
        : []; // Copy array before sorting
      if (sortBy === "price_low_to_high") {
        sortedResults.sort(
          (a, b) => a.variants[0]?.newPrice - b.variants[0]?.newPrice
        );
      } else if (sortBy === "price_high_to_low") {
        sortedResults.sort(
          (a, b) => b.variants[0]?.newPrice - a.variants[0]?.newPrice
        );
      }
      // If "relevance", keep default order (no sorting)

      setFilteredProducts(sortedResults);
    } else {
      setFilteredProducts(data);
      setSearchedProducts(data);
    }
  }, [query, data, filters, sortBy]);

  useEffect(() => {
    if (query)
      setFilters({
        brand: [],
        size: [],
        subcategory: [],
        minPrice: "",
        maxPrice: "",
      });
  }, [query]);
  useEffect(() => {
    fetchWishlist();
  }, []);
  useEffect(() => {
    if (Array.isArray(wishlist)) {
      setIsLiked(
        wishlist.some((item) => item.product?._id === filteredProducts?._id)
      );
    }
  }, [wishlist, filteredProducts]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      // Ensure the current filter is treated as an array
      const currentFilter = Array.isArray(prev[filterType])
        ? prev[filterType]
        : [];

      return {
        ...prev,
        [filterType]: currentFilter.includes(value)
          ? currentFilter.filter((item) => item !== value) // Remove if already selected
          : [...currentFilter, value], // Add if not selected
      };
    });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleWishlist = async () => {
    if (isLiked) {
      await removeFromWishlist(product._id);
    } else if (!wishlist.some((item) => item.product._id === product._id)) {
      await addToWishlist(product._id);
    }
    await fetchWishlist();
  };
  // console.log(filteredProducts)
  const toalItemCount = searchedProducts?.length;

  return (
   <>
  <div className="h-16"></div>

  <div className="w-full min-h-screen bg-gray-300">

    {/* PAGE TITLE */}
    <div className="flex flex-wrap items-center px-6 pt-4 pb-2 gap-1">
      <p className="text-lg font-normal">Search Results for</p>
      <p className="text-lg font-semibold">{query}</p>
      <p className="text-lg font-normal text-gray-600">- {toalItemCount} items</p>
    </div>

    <div className="belowNavbar w-full flex flex-col lg:flex-row px-4 gap-3">

      {/* ---------- MOBILE FILTER BAR ---------- */}
      <div className="lg:hidden w-full bg-white p-3 rounded-md shadow">
        <button
          className="w-full flex justify-between items-center font-semibold text-gray-700"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          Filters
          <span className="text-xl">{showMobileFilters ? "▲" : "▼"}</span>
        </button>

        {/* MOBILE FILTER DROPDOWN */}
        {showMobileFilters && (
          <div className="mt-3 space-y-4 max-h-[60vh] overflow-y-auto pr-1">

            {/* BRAND */}
            <div>
              <p 
                className="font-medium text-base mb-2 cursor-pointer flex justify-between"
                onClick={() => setDropBrand(!dropBrand)}
              >
                BRAND <span>{dropBrand ? "▲" : "▼"}</span>
              </p>

              {dropBrand && (
                <div className="space-y-1">
                  {(showAllBrands ? uniqueBrand : uniqueBrand.slice(0, 5)).map((brand) => (
                    <div key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.brand.includes(brand)}
                        onChange={() => handleFilterChange("brand", brand)}
                        className="w-4 h-4 accent-pink-500"
                      />
                      <label className="pl-2">{brand.toUpperCase()}</label>
                    </div>
                  ))}

                  {uniqueBrand.length > 5 && (
                    <button
                      onClick={() => setShowAllBrands(!showAllBrands)}
                      className="text-sm text-pink-500 font-medium mt-1"
                    >
                      {showAllBrands ? "Show Less ▲" : "Show More ▼"}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* SUBCATEGORIES */}
            <div>
              <p 
                onClick={() => setDropSubCat(!dropSubCat)}
                className="font-medium text-base mb-2 cursor-pointer flex justify-between"
              >
                SUB-CATEGORY <span>{dropSubCat ? "▲" : "▼"}</span>
              </p>

              {dropSubCat && (
                <div className="space-y-1">
                  {(showAllSubcategories ? uniqueSubcategories : uniqueSubcategories.slice(0, subcategoryLimit))
                    .map((subcategory) => (
                      <div key={subcategory} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.subcategory.includes(subcategory)}
                          onChange={() => handleFilterChange("subcategory", subcategory)}
                          className="w-4 h-4 accent-pink-500"
                        />
                        <label className="pl-2">{subcategory.toUpperCase()}</label>
                      </div>
                    ))}

                  {uniqueSubcategories.length > subcategoryLimit && (
                    <button
                      onClick={() => setShowAllSubcategories(!showAllSubcategories)}
                      className="text-sm text-pink-500 font-medium mt-1"
                    >
                      {showAllSubcategories ? "Show Less ▲" : "Show More ▼"}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* SIZES */}
            <div>
              <p 
                className="font-medium text-base mb-2 cursor-pointer flex justify-between"
                onClick={() => setDropSizes(!dropSizes)}
              >
                SIZES <span>{dropSizes ? "▲" : "▼"}</span>
              </p>

              {dropSizes && (
                <div className="space-y-1">
                  {uniqueSizes.map((size) => (
                    <div key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.size.includes(size)}
                        onChange={() => handleFilterChange("size", size)}
                        className="w-4 h-4 accent-pink-500"
                      />
                      <label className="pl-2">{size.toUpperCase()}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PRICE RANGE */}
            <div>
              <p 
                className="font-medium text-base mb-2 cursor-pointer flex justify-between"
                onClick={() => setDropPrice(!dropPrice)}
              >
                PRICE RANGE <span>{dropPrice ? "▲" : "▼"}</span>
              </p>

              {dropPrice && (
                <div>
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={filters.maxPrice || maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                    className="w-full accent-pink-500"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                      className="w-20 p-1 border rounded"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                      className="w-20 p-1 border rounded"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* ---------- DESKTOP SIDEBAR ---------- */}
      <div className="hidden lg:block w-1/6 bg-white flex flex-col shadow-xl rounded-md p-4">
        {/* ← your entire sidebar stays same here */}
        {/* just paste the desktop sidebar content here */}
      </div>

      {/* ---------- PRODUCTS SECTION ---------- */}
      <div className="flex-1 bg-white shadow-xl rounded-md">
        <div className="flex justify-between items-center h-14 px-3 border-b">
          <p className="text-xl font-semibold">Products</p>
          <select
            className="text-sm border px-2 py-1"
            onChange={handleSortChange}
          >
            <option value="Relevance">Sort by: Relevance</option>
            <option value="price_low_to_high">Low to High</option>
            <option value="price_high_to_low">High to Low</option>
          </select>
        </div>

        {/* PRODUCT GRID — MOBILE 2 COL, DESKTOP 4 COL */}
        <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentItems?.map((product) => (
            /* paste your product card component */
            <ProductCard product={product} />
          ))}
        </div>

        {/* Pagination stays same */}
      </div>
    </div>
  </div>
</>

  );
};

export default ProductList;
