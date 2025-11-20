import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import iphone from "../../assets/images/iphone.jpeg"; 
import samsung from "../../assets/images/samsung.jpeg";
import oneplus from "../../assets/images/oneplus.jpeg";
import iqoo from "../../assets/images/IQOO.jpeg";

gsap.registerPlugin(ScrollTrigger);

const PhoneCategory = () => {
  const ref = useRef(null);
    const navigate = useNavigate();

   const Images = [
        { name: "IPHONE", image: iphone },
        { name: "SAMSUNG", image: samsung },
        { name: "ONEPLUS", image: oneplus },
        { name: "IQOO", image: iqoo },
      ];

      const handleClick = (Image) => {
    navigate(`/search?query=${encodeURIComponent(Image)}`);
  };

  useEffect(() => {
          gsap.to(ref.current, {
            opacity: 1,
            left: "3%",
            duration: 2,
            scrollTrigger: {
              trigger: ref.current, // Element to trigger the animation
              start: "-600% top", // Start animation when top of element is 80% from the top of the viewport
              end: "-380% top", // End animation when top of element is 30% from the top
              scrub: 1, // Smooth scrubbing, takes 1 second to "catch up" to the scrollbar
              // markers:true
            },
          });
        }, []);

  return (
   <>
  <div className="relative w-full bg-gradient-to-r from-[#f0f4f8] via-[#e5ecf1] to-[#f7f9fb] overflow-hidden py-10">

    {/* Minimal blurred background shapes */}
    <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
      <div className="absolute w-52 h-52 bg-[#a5d8ff] rounded-full filter blur-2xl opacity-20 top-10 left-10"></div>
      <div className="absolute w-52 h-52 bg-[#c3fbd8] rounded-full filter blur-2xl opacity-20 bottom-10 right-10"></div>
    </div>

    {/* Heading */}
    <div className="relative z-10 w-full text-center mb-10">
      <h1
        ref={ref}
        className="text-3xl md:text-5xl font-bold underline underline-offset-[10px] decoration-4"
      >
        Phone By Brand
      </h1>
    </div>

    {/* Category Cards */}
    <div
      className="
        relative z-10 
        grid 
        grid-cols-2 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-4 
        gap-8 
        px-6
      "
    >
      {Images.map((Image, index) => (
        <div
          key={index}
          onClick={() => handleClick(Image.name)}
          className="
            h-[260px] 
            sm:h-[280px] 
            md:h-[300px] 
            w-full 
            cursor-pointer 
            relative 
            overflow-hidden 
            rounded-2xl 
            shadow-xl 
            bg-white 
            bg-opacity-30 
            backdrop-blur-lg 
            transition-transform 
            duration-300 
            hover:scale-105
          "
        >
          <img
            className="h-full w-full object-cover object-top"
            src={Image.image}
            alt={Image.name}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/60 transition duration-300">
            <div className="h-full w-full flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-2xl font-semibold text-center">
                {Image.name}
                <hr className="h-1 w-16 bg-white border-0 mt-2 mx-auto" />
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</>
  );
};

export default PhoneCategory;
