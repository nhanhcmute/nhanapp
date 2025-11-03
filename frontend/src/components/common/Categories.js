import React from "react";
import { Box, Typography, CardContent, CardMedia, Card, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaPaw } from 'react-icons/fa';



const categories = [
  { name: "Chó", emoji: "🐶", path: "/dogs" },
  { name: "Mèo", emoji: "🐱",  path: "/cats" },
  { name: "Thú cưng khác", emoji: "🐰", path: "/otherpets" },
  { name: "Phụ kiện", emoji: "🎀",  path: "/petsupplies" },
  { name: "Cát vệ sinh", emoji: "🧹",  path: "/catlitter" },
  { name: "Khác", emoji: "✨", path: "/others" },
];

const Categories = () => {
  const navigate = useNavigate(); 

  const handleClick = (path) => {
    navigate(path); 
  };

  return (
    <Grid container spacing={3}>
      {categories.map((category, index) => (
        <Grid item xs={6} sm={4} md={2} key={index}>
          <Card
  onClick={() => handleClick(category.path)}
  sx={{
    cursor: "pointer",
    borderRadius: '20px',
    backgroundColor: 'rgba(255,255,255,0.9)',
    border: '2px solid rgba(255,107,129,0.2)',
    boxShadow: '0 4px 12px rgba(255,107,129,0.2)',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    py: 3,
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 20px rgba(255,107,129,0.3)',
      borderColor: 'rgba(255,107,129,0.5)',
    },
  }}
>
  <Typography sx={{ fontSize: 48, mb: 1 }}>{category.emoji}</Typography>
  <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#ff6b81' }}>
    {category.name}
  </Typography>
</Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Categories;
