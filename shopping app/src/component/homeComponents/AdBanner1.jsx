import React,{ useRef, useEffect , useState} from 'react'
import gsap, { Expo } from 'gsap';
import { useGSAP } from '@gsap/react';
import fashionBanner from '../../assets/images/fashionBanner.jpg'
import fashionBanner2 from '../../assets/images/fashion2Banner.jpg'
import LaptopBanner2 from '../../assets/images/laptop2Banner.jpg'
import phoneBanner from '../../assets/images/phoneBanner2.jpg'

function AdBanner1() {
    // const gsapopacity = useRef()
    const gsapAdbanner1 = useRef()

    // image source
    const images = [
      { src: fashionBanner}, // Duplicate of last slide
      { src: phoneBanner},
      { src: LaptopBanner2},
      { src: fashionBanner2},
      { src: fashionBanner},
      { src: phoneBanner}, // Duplicate of first slide
    ];
  
const [Xvalue, setXvalue] = useState(100);

function nextpage() {
    setXvalue(prev => (prev >= 500 ? 100 : prev + 100));
}
function prepage() {
    setXvalue(prev => (prev <= 0 ? 400 : prev - 100));
}

useGSAP(() => {
    // Trigger gsap animation when `Xvalue` updates
    gsap.to(gsapAdbanner1.current, {
        left: `-${Xvalue}%`, // Use computed `Xvalue` directly
        duration: 0.5,
        ease: "sine.inOut",
        onComplete: () => {
            if (Xvalue === 500) {
                // Reset to start if we go beyond 500 in forward direction
                setXvalue(100);
                gsap.set(gsapAdbanner1.current, { left: "-100%" });
            } else if (Xvalue === 0) {
                // Reset to end if we go below 100 in backward direction
                setXvalue(400);
                gsap.set(gsapAdbanner1.current, { left: "-400%" });
            }
        }
    });
}, [Xvalue]);

  return (
   <>
  <div className='w-full relative overflow-hidden bg-white 
                  h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh]'>

    <button className='bg-gray-900 rounded-md text-white text-3xl h-16 w-8 z-10 
                      absolute right-0 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100'
            onClick={nextpage}>
      <i className="ri-arrow-right-s-fill"></i>
    </button>

    <button className='bg-gray-900 rounded-md text-white text-3xl h-16 w-8 z-10 
                      absolute left-0 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100'
            onClick={prepage}>
      <i className="ri-arrow-left-s-fill"></i>
    </button>

    <div
      ref={gsapAdbanner1}
      className="flex w-[600%] absolute -left-[100%]
                 h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh]"
    >
      {images.map((image, index) => (
        <div key={index} className="w-full h-full">
          <img
            src={image.src}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  </div>
</>
  )}
export default AdBanner1