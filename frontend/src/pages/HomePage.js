import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, CircularProgress, Snackbar, Alert, Typography } from "@mui/material";
import { FaPaw } from "react-icons/fa";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import PetsIcon from "@mui/icons-material/Pets";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import Categories from "../components/common/Categories";
import HomeProductCard from "../components/home/HomeProductCard";
import { API_URL } from "../config/api";
import { useLanguage } from "../i18n/LanguageContext";

const PINK = "#ff6b81";
const INK = "#2b2d42";

const FEATURES = [
  { key: "shipping", icon: <LocalShippingOutlinedIcon /> },
  { key: "genuine", icon: <VerifiedUserOutlinedIcon /> },
  { key: "vet", icon: <MedicalServicesOutlinedIcon /> },
  { key: "support", icon: <FavoriteIcon /> },
];

// Tiêu đề giữa trang có đường kẻ hai bên: —— 🐾 Danh mục sản phẩm 🐾 ——
const CenterTitle = ({ children }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
    <Box sx={{ flex: 1, height: 2, background: `linear-gradient(90deg, transparent, ${PINK})` }} />
    <FaPaw size={20} color={PINK} />
    <Typography component="h2" sx={{ color: PINK, fontWeight: 800, fontSize: { xs: 20, md: 26 }, textAlign: "center" }}>
      {children}
    </Typography>
    <FaPaw size={20} color={PINK} />
    <Box sx={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${PINK}, transparent)` }} />
  </Box>
);

// Tiêu đề trái + "Xem tất cả" bên phải, có gạch chân hồng
const SectionHeader = ({ title, viewAllLabel }) => (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2, pb: 1, borderBottom: "2px solid #ffd6de" }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <StarRoundedIcon sx={{ color: "#ffb02e", fontSize: 28 }} />
      <Typography component="h2" sx={{ color: PINK, fontWeight: 800, fontSize: { xs: 18, md: 22 } }}>{title}</Typography>
    </Box>
    <Box component={Link} to="/productlist" sx={{ color: PINK, fontWeight: 700, fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 0.5, whiteSpace: "nowrap" }}>
      {viewAllLabel} <ArrowForwardIcon sx={{ fontSize: 16 }} />
    </Box>
  </Box>
);

const pillBtn = {
  borderRadius: "999px",
  textTransform: "none",
  fontWeight: 700,
  px: 3,
  py: 1.2,
  fontSize: 15,
};

const Homepage = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Lấy 1 lần rồi chia làm 2 nhóm (nổi bật / gợi ý) để không trùng sản phẩm giữa hai mục
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/product.ctr/get_all`, { method: "POST", headers: { "Content-Type": "application/json" } });
        const result = await res.json();
        if (result.status === 200 && Array.isArray(result.data)) {
          const available = result.data.filter((p) => p.status === "Còn hàng" && Number(p.price) > 0);
          setProducts([...available].sort(() => Math.random() - 0.5));
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const featured = products.slice(0, 4);
  const picks = products.slice(4, 8);
  const onAdded = (product) => setToast(t("home.added", { name: product.name }));

  const productGrid = (list, compact) => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress sx={{ color: PINK }} />
        </Box>
      );
    }
    if (!list.length) {
      return <Typography sx={{ textAlign: "center", color: "#999", py: 4 }}>{t("home.empty")}</Typography>;
    }
    return (
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" }, gap: 2 }}>
        {list.map((p) => <HomeProductCard key={p._id || p.id} product={p} compact={compact} onAdded={onAdded} />)}
      </Box>
    );
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: { xs: "20px", md: "28px" },
          minHeight: { xs: 340, md: 400 },
          display: "flex",
          alignItems: "center",
          backgroundImage: "url(/homepage.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center 65%",
          boxShadow: "0 12px 32px rgba(255, 107, 129, 0.18)",
        }}
      >
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(20,12,16,0.72) 0%, rgba(20,12,16,0.45) 45%, rgba(20,12,16,0.05) 80%)" }} />
        <Box sx={{ position: "relative", zIndex: 1, px: { xs: 3, md: 7 }, py: 5, maxWidth: 640 }}>
          <Typography
            component="h1"
            sx={{ color: "#fff", fontWeight: 800, fontSize: { xs: 34, sm: 44, md: 54 }, lineHeight: 1.1, textShadow: "0 2px 12px rgba(0,0,0,0.35)", display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}
          >
            Nhân's Pet Haven <FaPaw color={PINK} size={40} />
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.95)", fontWeight: 600, fontSize: { xs: 16, md: 20 }, mt: 2, mb: 4, lineHeight: 1.5 }}>
            {t("home.tagline")}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            <Button
              component={Link}
              to="/productlist"
              startIcon={<ShoppingCartOutlinedIcon />}
              endIcon={<ArrowForwardIcon />}
              sx={{ ...pillBtn, bgcolor: PINK, color: "#fff", boxShadow: "0 6px 18px rgba(255,107,129,0.45)", "&:hover": { bgcolor: "#ff4757" } }}
            >
              {t("home.shopNow")}
            </Button>
            <Button
              component={Link}
              to="/cats"
              startIcon={<PetsIcon />}
              sx={{ ...pillBtn, color: "#fff", border: "2px solid #fff", "&:hover": { bgcolor: "rgba(255,255,255,0.15)" } }}
            >
              {t("home.exploreBreeds")}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Cam kết dịch vụ */}
      <Box
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
          bgcolor: "#fff5f7",
          border: "1px solid #ffe1e7",
          borderRadius: "18px",
          py: 2,
          rowGap: 2,
        }}
      >
        {FEATURES.map((f, i) => {
          const [title, sub] = t(`home.features.${f.key}`);
          return (
            <Box
              key={f.key}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                px: 2,
                borderLeft: { md: i ? "1px solid #ffd6de" : "none" },
              }}
            >
              <Box sx={{ color: PINK, display: "flex", "& svg": { fontSize: 34 } }}>{f.icon}</Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 14, color: INK }}>{title}</Typography>
                <Typography sx={{ fontSize: 12, color: "#888" }}>{sub}</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Danh mục */}
      <Box sx={{ mt: 5 }}>
        <CenterTitle>{t("home.categoriesTitle")}</CenterTitle>
        <Categories />
      </Box>

      {/* Sản phẩm nổi bật */}
      <Box sx={{ mt: 5 }}>
        <SectionHeader title={t("home.featured")} viewAllLabel={t("home.viewAll")} />
        {productGrid(featured, false)}
      </Box>

      {/* Banner Thú y thông minh */}
      <Box
        sx={{
          mt: 5,
          position: "relative",
          overflow: "hidden",
          borderRadius: "24px",
          background: "linear-gradient(110deg, #ffe3ea 0%, #ffd0db 55%, #ffc2d1 100%)",
          display: "flex",
          alignItems: "center",
          gap: { xs: 2, md: 4 },
          px: { xs: 3, md: 4 },
          py: { xs: 3, md: 3.5 },
          flexWrap: { xs: "wrap", md: "nowrap" },
        }}
      >
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "flex-end", flexShrink: 0, fontSize: { sm: 52, md: 64 }, lineHeight: 1 }}>
          <span role="img" aria-hidden="true">👩‍⚕️</span>
          <span role="img" aria-hidden="true" style={{ marginLeft: -10 }}>🐶</span>
          <span role="img" aria-hidden="true" style={{ fontSize: "0.75em", marginLeft: -8 }}>🐱</span>
        </Box>
        <Box sx={{ flex: 1, minWidth: 240 }}>
          <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, bgcolor: PINK, color: "#fff", fontWeight: 700, fontSize: 14, px: 2, py: 0.6, borderRadius: "999px" }}>
            <FaPaw size={14} /> {t("home.vet.badge")}
          </Box>
          <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 22, md: 26 }, color: INK, mt: 1.5 }}>
            {t("home.vet.title")}
          </Typography>
          <Typography sx={{ color: "#6b6570", fontSize: 14, mt: 0.75, mb: 2 }}>{t("home.vet.text")}</Typography>
          <Button
            component={Link}
            to="/pet-care/ai-consultation"
            startIcon={<MedicalServicesOutlinedIcon />}
            endIcon={<ArrowForwardIcon />}
            sx={{ ...pillBtn, py: 0.9, fontSize: 14, bgcolor: PINK, color: "#fff", "&:hover": { bgcolor: "#ff4757" } }}
          >
            {t("home.vet.cta")}
          </Button>
        </Box>
        <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 1.5, flexShrink: 0 }}>
          {[<MonitorHeartOutlinedIcon />, <VaccinesOutlinedIcon />, <PetsIcon />].map((icon, i) => (
            <Box
              key={i}
              sx={{
                width: 68,
                height: 68,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.75)",
                border: "3px solid #fff",
                boxShadow: "0 8px 20px rgba(255,107,129,0.2)",
                display: "grid",
                placeItems: "center",
                color: PINK,
                mt: i === 1 ? -3 : 0,
                "& svg": { fontSize: 32 },
              }}
            >
              {icon}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Gợi ý hôm nay */}
      <Box sx={{ mt: 5 }}>
        <SectionHeader title={t("home.todayPicks")} viewAllLabel={t("home.viewAll")} />
        {productGrid(picks, true)}
      </Box>

      <Snackbar open={Boolean(toast)} autoHideDuration={2500} onClose={() => setToast(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        {toast ? <Alert severity="success" variant="filled" onClose={() => setToast(null)} sx={{ borderRadius: "12px" }}>{toast}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
};

export default Homepage;
