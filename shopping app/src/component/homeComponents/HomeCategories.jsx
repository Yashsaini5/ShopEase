import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import fashion from "../../assets/images/fashion.jpeg";
import smartphones from "../../assets/images/smartphones.jpg";
import laptops from "../../assets/images/laptops.jpg";
import games from "../../assets/images/games.jpg";

const HomeCategories = () => {
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
      gsap.to(ref.current, {
        left: "3%",
        scrollTrigger: {
          trigger: ref.current,
          start: "-600% top",
          end: "-380% top", 
          scrub: 1, 
        },
      });
    }, []);

  const Categories = [
    { name: "Clothing", image: fashion },
    { name: "Mobiles", image: smartphones },
    { name: "Laptops", image: laptops },
    { name: "Games", image: games },
  ];

  const handleCategoryClick = (category) => {
    navigate(`/search?query=${encodeURIComponent(category)}`);
  };

  return (
<div className="relative h-auto w-full bg-gradient-to-r from-[#f0f4f8] via-[#e5ecf1] to-[#f7f9fb] overflow-x-hidden">
  {/* Minimal blurred background shapes */}
  <div className="absolute top-0 left-0 w-full h-full z-0">
    <div className="absolute w-72 h-72 bg-[#a5d8ff] rounded-full filter blur-2xl opacity-20 top-16 left-12"></div>
    <div className="absolute w-72 h-72 bg-[#c3fbd8] rounded-full filter blur-2xl opacity-20 bottom-16 right-12"></div>
  </div>

      <div className="w-full h-[16vh] relative z-10">
        <h1 ref={ref}
          className="h-[10vh] w-fit text-2xl md:text-5xl font-bold pt-4 z-10 text-center underline underline-offset-[15px] decoration-4 absolute right-20"
        >
          CATEGORIES
        </h1>
      </div>

      {/* Category Cards */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 pb-16">
        {Categories.map((Category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(Category.name)}
            className="h-[250px] w-full sm:w-[250px] md:w-[280px] lg:w-[300px] cursor-pointer relative overflow-hidden rounded-2xl shadow-2xl bg-white bg-opacity-30 transition-transform duration-300 hover:scale-105 mx-auto"
          >
            <img
              className="h-full w-full object-cover object-bottom"
              src={Category.image}
              alt={Category.name}
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/60 transition duration-300">
              <div className="h-full w-full flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <p className=" text-white text-2xl font-semibold text-center">
                  {Category.name}
                  <hr className="h-1 w-16 bg-white border-0 mt-2 mx-auto" />
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;
