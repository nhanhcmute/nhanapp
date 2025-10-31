import React from "react";
import { Grid, Box, Typography, Card, CardContent, CardMedia } from "@mui/material";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom

// Import ảnh từ thư mục
const images = require
  .context("../../assets/images/products", false, /\.(png|jpe?g|svg)$/)
  .keys()
  .reduce((acc, path) => {
    const name = path.replace("./", ""); // Lấy tên ảnh
    acc[name] = require(`../../assets/images/products/${name}`); 
    return acc;
  }, {});

// Dữ liệu sản phẩm
const products = [
  { id: 0, imageName: "sp1.jpg", name: "Poodle", description: "Chó Poodle thông minh và dễ thương.", status: "Hết hàng", price: "500k" },
  { id: 1, imageName: "sp2.jpg", name: "Persian Cat", description: "Mèo Ba Tư lông dài quý phái.", status: "Còn hàng", price: "600k" },
  { id: 2, imageName: "sp3.jpg", name: "Bulldog", description: "Chó Bulldog mạnh mẽ và đáng yêu.", status: "Ngừng kinh doanh", price: "600k" },
  { id: 3, imageName: "sp4.jpg", name: "Maine Coon", description: "Mèo Maine Coon to lớn và hiền lành.", status: "Còn hàng", price: "700k" },
  { id: 4, imageName: "sp5.jpg", name: "Golden Retriever", description: "Chó Golden thân thiện và thông minh.", status: "Còn hàng", price: "800k" },
  { id: 5, imageName: "sp6.jpg", name: "Siberian Cat", description: "Mèo Siberian lông dài thích nghi tốt với lạnh.", status: "Hết hàng", price: "450k" },
  { id: 6, imageName: "sp7.jpg", name: "German Shepherd", description: "Chó Becgie Đức trung thành và mạnh mẽ.", status: "Còn hàng", price: "550k" },
  { id: 7, imageName: "sp8.jpg", name: "British Shorthair", description: "Mèo Anh lông ngắn dễ thương.", status: "Ngừng kinh doanh", price: "650k" },
  { id: 8, imageName: "sp9.jpg", name: "Beagle", description: "Chó Beagle hiếu động và trung thành.", status: "Còn hàng", price: "750k" },
  { id: 9, imageName: "sp10.jpg", name: "Ragdoll", description: "Mèo Ragdoll ngoan ngoãn và ôn hòa.", status: "Còn hàng", price: "850k" },
  { id: 10, imageName: "sp11.jpg", name: "Shiba Inu", description: "Chó Shiba Inu nổi tiếng từ Nhật Bản.", status: "Hết hàng", price: "950k" },
  { id: 11, imageName: "sp12.jpg", name: "Bengal Cat", description: "Mèo Bengal hoang dã và năng động.", status: "Còn hàng", price: "1050k" },
  { id: 12, imageName: "sp13.jpg", name: "Chihuahua", description: "Chó Chihuahua nhỏ bé và nhanh nhẹn.", status: "Còn hàng", price: "1150k" },
  { id: 13, imageName: "sp14.jpg", name: "Scottish Fold", description: "Mèo Scottish Fold tai cụp đáng yêu.", status: "Ngừng kinh doanh", price: "1250k" },
  { id: 14, imageName: "sp15.jpg", name: "Labrador Retriever", description: "Chó Labrador thân thiện và hiền lành.", status: "Còn hàng", price: "1350k" },
  { id: 15, imageName: "sp16.jpg", name: "Sphynx", description: "Mèo Sphynx không lông độc đáo.", status: "Hết hàng", price: "1450k" },
  { id: 16, imageName: "sp17.jpg", name: "Doberman", description: "Chó Doberman cảnh giác và thông minh.", status: "Còn hàng", price: "1550k" },
  { id: 17, imageName: "sp18.jpg", name: "Birman", description: "Mèo Birman đẹp và ôn hòa.", status: "Ngừng kinh doanh", price: "1650k" },
  { id: 18, imageName: "sp19.jpg", name: "Corgi", description: "Chó Corgi chân ngắn siêu đáng yêu.", status: "Còn hàng", price: "1750k" },
  { id: 19, imageName: "sp20.jpg", name: "Turkish Van", description: "Mèo Turkish Van hiếu động và bơi giỏi.", status: "Hết hàng", price: "1850k" },
  { id: 20, imageName: "sp21.jpg", name: "Pomeranian", description: "Chó Pomeranian nhỏ bé và quyến rũ.", status: "Còn hàng", price: "1950k" },
  { id: 21, imageName: "sp22.jpg", name: "Abyssinian", description: "Mèo Abyssinian tò mò và thông minh.", status: "Còn hàng", price: "2050k" },
  { id: 22, imageName: "sp23.jpg", name: "Husky", description: "Chó Husky tràn đầy năng lượng.", status: "Ngừng kinh doanh", price: "2150k" },
  { id: 23, imageName: "sp24.jpg", name: "Russian Blue", description: "Mèo Russian Blue lông xám đẹp.", status: "Còn hàng", price: "2250k" },
  { id: 24, imageName: "sp25.jpg", name: "Akita", description: "Chó Akita trung thành từ Nhật Bản.", status: "Còn hàng", price: "2350k" },
  { id: 25, imageName: "sp26.jpg", name: "Oriental Shorthair", description: "Mèo Oriental Shorthair thanh lịch.", status: "Hết hàng", price: "2450k" },
  { id: 26, imageName: "sp27.jpg", name: "Dalmatian", description: "Chó Dalmatian nổi tiếng với đốm đen.", status: "Còn hàng", price: "2550k" },
  { id: 27, imageName: "sp28.jpg", name: "Norwegian Forest", description: "Mèo Norwegian Forest mạnh mẽ.", status: "Ngừng kinh doanh", price: "2650k" },
  { id: 28, imageName: "sp29.jpg", name: "Yorkshire Terrier", description: "Chó Yorkshire Terrier đáng yêu.", status: "Còn hàng", price: "2750k" },
  { id: 29, imageName: "sp30.jpg", name: "Himalayan", description: "Mèo Himalayan đẹp và sang trọng.", status: "Còn hàng", price: "2850k" },
  { id: 30, imageName: "sp31.jpg", name: "Pug", description: "Chó Pug nhỏ bé và ngộ nghĩnh.", status: "Hết hàng", price: "2950k" },
  { id: 31, imageName: "sp32.jpg", name: "American Shorthair", description: "Mèo American Shorthair thân thiện.", status: "Còn hàng", price: "3050k" },
  { id: 32, imageName: "sp33.jpg", name: "Maltese", description: "Chó Maltese nhỏ nhắn và thanh lịch.", status: "Ngừng kinh doanh", price: "3150k" },
  { id: 33, imageName: "sp34.jpg", name: "Ragamuffin", description: "Mèo Ragamuffin lớn và hiền lành.", status: "Còn hàng", price: "3250k" },
  { id: 34, imageName: "sp35.jpg", name: "Samoyed", description: "Chó Samoyed lông trắng tuyệt đẹp.", status: "Còn hàng", price: "3350k" },
  { id: 35, imageName: "sp36.jpg", name: "Balinese", description: "Mèo Balinese mảnh khảnh và đẹp.", status: "Hết hàng", price: "3450k" },
  { id: 36, imageName: "sp37.jpg", name: "Whippet", description: "Chó Whippet nhanh nhẹn và nhẹ nhàng.", status: "Còn hàng", price: "3550k" },
  { id: 37, imageName: "sp38.jpg", name: "Egyptian Mau", description: "Mèo Egyptian Mau quý phái.", status: "Ngừng kinh doanh", price: "3650k" },
  { id: 38, imageName: "sp39.jpg", name: "Alaskan Malamute", description: "Chó Alaskan Malamute mạnh mẽ.", status: "Còn hàng", price: "3750k" },
  { id: 39, imageName: "sp40.jpg", name: "Exotic Shorthair", description: "Mèo Exotic Shorthair đáng yêu.", status: "Còn hàng", price: "3850k" },
  { id: 40, imageName: "sp41.jpg", name: "Bichon Frise", description: "Chó Bichon Frise lông xoăn nhỏ bé.", status: "Hết hàng", price: "3950k" },
  { id: 41, imageName: "sp42.jpg", name: "Tonkinese", description: "Mèo Tonkinese mượt mà và năng động.", status: "Còn hàng", price: "4050k" },
  { id: 42, imageName: "sp43.jpg", name: "Collie", description: "Chó Collie thân thiện và thông minh.", status: "Ngừng kinh doanh", price: "4150k" },
  { id: 43, imageName: "sp44.jpg", name: "Manx", description: "Mèo Manx không đuôi độc đáo.", status: "Còn hàng", price: "4250k" },
  { id: 44, imageName: "sp45.jpg", name: "Great Dane", description: "Chó Great Dane to lớn và hiền lành.", status: "Còn hàng", price: "4350k" },
  { id: 45, imageName: "sp46.jpg", name: "Burmese", description: "Mèo Burmese dịu dàng và dễ mến.", status: "Hết hàng", price: "4450k" },
  { id: 46, imageName: "sp47.jpg", name: "Boxer", description: "Chó Boxer vui tươi và năng động.", status: "Còn hàng", price: "4550k" },
  { id: 47, imageName: "sp48.jpg", name: "Japanese Bobtail", description: "Mèo Japanese Bobtail hiếu động.", status: "Ngừng kinh doanh", price: "4650k" },
  { id: 48, imageName: "sp49.jpg", name: "Chow Chow", description: "Chó Chow Chow lông bờm sư tử.", status: "Còn hàng", price: "4750k" },
  { id: 49, imageName: "sp50.jpg", name: "Devon Rex", description: "Mèo Devon Rex dễ thương và nghịch ngợm.", status: "Còn hàng", price: "4850k" }
];

const ProductsGrid = ({ title }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            {/* Bao quanh Card với Link */}
            <Link to={`/productdetail/${product.id}`} style={{ textDecoration: "none" }}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={images[product.imageName]} // Lấy ảnh từ `images` dựa trên `imageName`
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="body2">{product.name}</Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductsGrid;
