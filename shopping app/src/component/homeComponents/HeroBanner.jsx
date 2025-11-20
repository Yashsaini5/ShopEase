import s24ultra from "../../assets/videos/s24ultra.mp4";
import fashionBanner from "../../assets/videos/fashionBanner.mp4";
import macbook from "../../assets/videos/macbook.mp4";
import ps5 from "../../assets/videos/ps5.mp4";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

function HeroBanner() {

  const videos = [
    {
      src: s24ultra,
      title: "SAMSUNG",
      description: " Galaxy S24 Ultra",
      feature: "Galaxy AI is here",
      offer: "Avail benefits worth ₹12999*",
    },
    {
      src: fashionBanner,
      title: "H&M",
      description: "Mens | Womens | Kids",
      feature: `Fashion and Quality at the Best Price`,
      offer: "Avail benefits worth ₹3000*",
    },
    {
      src: macbook,
      title: "APPLE",
      description: "MacBook Air 13",
      feature: "Designed to go places.",
      offer: "MacBook Air with M2 from ₹99900*",
    },
    {
      src: ps5,
      title: "PlayStation®5",
      description: "Play like never before",
      feature: "The Ultimate Gaming Machine",
      offer: "Avail benefits worth ₹1200*",
    },
  ];


  return (
  <>
  {/* Spacer for fixed header */}
  <div className="h-16"></div>

  <div className="w-full relative overflow-hidden bg-black h-[35vh] sm:h-[45vh] md:h-[60vh] lg:h-[65vh]">

    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      loop={true}
      autoplay={{
        delay: 7000,
        disableOnInteraction: false,
      }}
      className="h-full"
    >

      {videos.map((video, index) => (
        <SwiperSlide key={index}>

          <div className="w-full h-full relative">

            <video
              src={video.src}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover opacity-60"
            />

            {/* Title */}
            <p className="
              absolute text-white font-semibold
              text-xl sm:text-2xl md:text-4xl lg:text-5xl
              top-4 sm:top-6 left-4 sm:left-10
            ">
              {video.title}
            </p>

            {/* Description */}
            <p className="
              absolute text-white font-normal
              text-lg sm:text-xl md:text-3xl lg:text-4xl
              top-14 sm:top-20 left-4 sm:left-10
              max-w-[80%] sm:max-w-[60%]
            ">
              {video.description}
            </p>

            {/* Feature */}
            <p className="
              absolute text-white font-normal
              text-sm sm:text-lg md:text-xl lg:text-2xl
              right-4 sm:right-10 bottom-16
            ">
              {video.feature}
            </p>

            {/* Offer */}
            <p className="
              absolute text-white font-normal
              text-xs sm:text-base md:text-lg lg:text-xl
              right-4 sm:right-10 bottom-8
            ">
              {video.offer}
            </p>

          </div>

        </SwiperSlide>
      ))}

    </Swiper>
  </div>
</>

  );
}
export default HeroBanner;
