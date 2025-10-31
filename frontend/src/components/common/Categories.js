import React from "react";
import { Box, Typography, CardContent, CardMedia, Card } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import hook điều hướng

// Import hình ảnh thực
import fashionImage from '../../assets/images/sp40.jpg';
import phoneImage from '../../assets/images/sp40.jpg';
import computerImage from '../../assets/images/sp40.jpg';
import homeImage from '../../assets/images/sp40.jpg';
import petImage from '../../assets/images/sp40.jpg';
import bookImage from '../../assets/images/sp40.jpg';

// Danh sách danh mục với hình ảnh thật
const categories = [
  { name: "Chó", image: fashionImage, path: "/dogs" },
  { name: "Mèo", image: phoneImage, path: "/cats" },
  { name: "Thú cưng khác", image: computerImage, path: "/otherpets" },
  { name: "Phụ kiện", image: homeImage, path: "/petsupplies" },
  { name: "Cát vệ sinh", image: petImage, path: "/catlitter" },
  { name: "Khác", image: bookImage, path: "/others" },
];

const Categories = () => {
  const navigate = useNavigate(); // Khởi tạo hook điều hướng

  const handleClick = (path) => {
    navigate(path); // Điều hướng đến đường dẫn tương ứng
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: "16px 0",
        overflowX: "auto",
        gap: 2,
      }}
    >
      {categories.map((category, index) => (
        <Card
          key={index}
          onClick={() => handleClick(category.path)} // Thêm sự kiện click
          sx={{
            width: 120, // Đặt chiều rộng của Card
            height: 150, // Đặt chiều cao Card
            position: "relative",
            cursor: "pointer",
            overflow: "hidden",
            transition: "transform 0.3s", // Hiệu ứng khi hover
            "&:hover": {
              transform: "scale(1.05)", // Phóng to khi hover
            },
          }}
        >
          {/* Hình ảnh bao phủ toàn bộ Card */}
          <CardMedia
            component="img"
            image={category.image}
            alt={category.name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute", // Để đặt nội dung lên trên hình
              top: 0,
              left: 0,
            }}
          />
          {/* Nội dung hiển thị trên hình */}
          <CardContent
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "rgba(0, 0, 0, 0.5)", // Nền mờ ở phần text
              color: "white",
              textAlign: "center",
              padding: "4px 0",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              {category.name}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Categories;
