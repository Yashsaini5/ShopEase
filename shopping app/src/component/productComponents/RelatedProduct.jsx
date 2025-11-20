import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../../context/DataProvider';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const RelatedProduct = ({ category, subCategory }) => {
  const { data } = useContext(DataContext);
  const [relatedProduct, setRelatedProduct] = useState([]);

  useEffect(() => {
    const fetchRelated = () => {
      if (data.length === 0) return;

      const filtered = data
        .filter((item) => item.category?.name === category && item.subCategory === subCategory)
        .slice(0, 10);

      setRelatedProduct(filtered);
    };

    fetchRelated();
  }, [data, category, subCategory]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Related Products</h2>

      {relatedProduct.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={2}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {relatedProduct.map((product) => (
            <SwiperSlide key={product._id}>
              <Link
                to={`/product/${product._id}`}
                className="block border rounded-xl overflow-hidden bg-white shadow hover:shadow-md transition-all"
              >
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-40 sm:h-48 md:h-56 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-700 truncate">{product.name}</h3>
                  <p className="text-lg font-bold text-black">₹{product.variants?.[0]?.newPrice}</p>
                  <p className="text-xs text-gray-400 line-through">
                    ₹{product.variants?.[0]?.oldPrice}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>No related products found</p>
      )}
    </div>
  );
};

export default RelatedProduct;
