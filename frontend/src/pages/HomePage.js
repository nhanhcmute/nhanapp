import React from "react";
import { Link } from "react-router-dom";
import Banner from "../components/common/Banner";
import Categories from "../components/common/Categories";
import ProductsGrid from "../components/product/ProductsGrid";
import { Container, Box, Typography, Button } from "@mui/material";
import { FaPaw } from "react-icons/fa";
import Footer from "../components/layout/Footer";

const SectionTitle = ({ children }) => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mb: 4 }}>
    <FaPaw size={28} color="#ff6b81" />
    <Typography variant="h3" sx={{ color: "#ff6b81", fontWeight: 700, textAlign: "center", fontSize: { xs: "1.6rem", md: "2.4rem" } }}>
      {children}
    </Typography>
    <FaPaw size={28} color="#ff6b81" />
  </Box>
);

const Homepage = () => {
  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "48vh", sm: "55vh", md: "68vh" },
          minHeight: 360,
          backgroundImage: "url(/homepage.jpg)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        <Container
          sx={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            color: "white",
            px: 2,
          }}
        >
          <Typography
            variant="h2"
            sx={{ color: "white", fontWeight: 800, fontSize: { xs: "2rem", sm: "2.8rem", md: "3.5rem" }, textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
          >
            🐾 Nhân's Pet Haven
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 400, mt: 2, mb: 4, maxWidth: 600, fontSize: { xs: "1rem", md: "1.25rem" } }}
          >
            Thức ăn, phụ kiện và mọi điều tốt đẹp nhất cho thú cưng của bạn
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2 }}>
            <Button
              component={Link}
              to="/productlist"
              variant="contained"
              sx={{
                backgroundColor: "#ff6b81",
                borderRadius: "16px",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: "16px",
                boxShadow: "0 4px 16px rgba(255, 107, 129, 0.4)",
                "&:hover": { backgroundColor: "#ff4757" },
              }}
            >
              🛍️ Mua sắm ngay
            </Button>
            <Button
              component={Link}
              to="/cats"
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "white",
                borderWidth: 2,
                borderRadius: "16px",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: "16px",
                "&:hover": { borderColor: "white", borderWidth: 2, backgroundColor: "rgba(255,255,255,0.15)" },
              }}
            >
              🐾 Khám phá giống thú cưng
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Nội dung trang */}
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 7 } }}>
        {/* Banner khuyến mãi */}
        <Box
          sx={{
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(255, 107, 129, 0.15)",
            mb: { xs: 6, md: 8 },
          }}
        >
          <Banner />
        </Box>

        {/* Danh mục sản phẩm */}
        <Box sx={{ mb: { xs: 6, md: 8 } }}>
          <SectionTitle>Danh Mục Sản Phẩm</SectionTitle>
          <Categories />
        </Box>

        {/* Sản phẩm nổi bật */}
        <ProductsGrid title="🔥 Flash Sale" mode="cheapest" />
        <ProductsGrid title="✨ Gợi Ý Hôm Nay" mode="random" />
      </Container>

      <Footer />
    </Box>
  );
};

export default Homepage;
