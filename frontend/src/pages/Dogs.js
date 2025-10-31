import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, CardMedia, CircularProgress, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; 

const Dogs = () => {
  const [dogBreeds, setDogBreeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchDogBreeds = async () => {
      setLoading(true);

      try {
        const response = await fetch("/dogs.json"); 
        const data = await response.json();

        if (data.length === 0) {
          setHasMore(false);
        } else {
          // Chỉ lấy dữ liệu cho trang hiện tại
          const newBreeds = data.slice((page - 1) * 12, page * 12);

          // Thêm giá ngẫu nhiên và loại bỏ trùng lặp
          const breedsWithPrice = newBreeds.map((dog) => ({
            ...dog,
            price: Math.floor(Math.random() * (10000000 - 1000000 + 1)) + 1000000,
          }));

          setDogBreeds((prevBreeds) => {
            // Loại bỏ các mục trùng lặp dựa trên `id`
            const uniqueBreeds = breedsWithPrice.filter(
              (dog) => !prevBreeds.some((prevDog) => prevDog.id === dog.id)
            );
            return [...prevBreeds, ...uniqueBreeds];
          });

          if (breedsWithPrice.length === 0) {
            setHasMore(false);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dog breeds from JSON:", error);
        setLoading(false);
      }
    };

    fetchDogBreeds();
  }, [page]);

  const loadMoreDogs = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleClick = (dog) => {
    navigate(`/petdetails`, {
      state: {
        petData: dog,
        petType: 'dog', 
      },
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Danh mục chó</h1>
      {loading && page === 1 ? (
        <div style={{ textAlign: "center" }}>
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {dogBreeds.map((dog) => (
            <Grid item key={dog.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                style={{ height: "100%", cursor: "pointer" }}
                onClick={() => handleClick(dog)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={dog.image}
                  alt={dog.name}
                  style={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="h6">{dog.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {dog.breed_group ? dog.breed_group : "Chưa có thông tin nhóm giống"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Nguồn gốc: {dog.origin || "Chưa có thông tin"}
                  </Typography>
                  <Typography variant="body1" color="primary" sx={{ marginTop: "8px" }}>
                    {dog.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {hasMore && !loading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button variant="outlined" color="primary" onClick={loadMoreDogs}>
            Xem thêm
          </Button>
        </div>
      )}

      {loading && page > 1 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default Dogs;
