import React from "react";
import { Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; 
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay } from "swiper/modules"; 

// Tự động import tất cả ảnh từ thư mục banner
const importBannerImages = () => {
  const context = require.context("../asset/images/banner", false, /\.(png|jpe?g|svg)$/);
  const images = [];
  context.keys().forEach((key) => {
    images.push(context(key));
  });
  return images;
};

const bannerImages = importBannerImages();

const Banner = () => {
  return (
    <Box sx={{ marginTop: 1 }}>
      <Swiper
        spaceBetween={10} 
        slidesPerView={1} 
        pagination={{ clickable: true }} 
        loop={true} 
        autoplay={{ delay: 3000, disableOnInteraction: false }} 
        modules={[Pagination, Autoplay]} 
      >
        {bannerImages.map((image, index) => (
          <SwiperSlide key={index}>
            <Box
              component="img"
              src={image}
              alt={`Banner ${index + 1}`}
              sx={{
                width: "100%", 
                height: "315px", 
                objectFit: "cover", 
                display: "block", 
                margin: "0 auto", 
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default Banner;
