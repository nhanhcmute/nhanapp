import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, CardMedia, CircularProgress, Typography, Box, Pagination, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { API_URL } from '../config/api';
import { useLanguage } from '../i18n/LanguageContext';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 'all'];
const ALL_PAGE_SIZE = 100000; // đủ lớn để chắc chắn lấy hết khi chọn "All"

const Dogs = () => {
  const { t } = useLanguage();
  const [dogBreeds, setDogBreeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDogBreeds = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${API_URL}/dog.ctr/get_paged`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                page,
                page_size: pageSize === 'all' ? ALL_PAGE_SIZE : pageSize,
            }),
        });
        const result = await response.json();

        if (result.status === 200 && result.data) {
          const data = result.data.data || [];

          // Thêm giá ngẫu nhiên và map fields
          const breedsWithPrice = data.map((dog) => ({
            ...dog,
            price: dog.price || Math.floor(Math.random() * (10000000 - 1000000 + 1)) + 1000000,
            breed_group: dog.breedGroup || dog.breed_group,
            origin: dog.origin,
            image: dog.image || dog.Image || '/logo.png'
          }));

          setDogBreeds(breedsWithPrice);
          setTotalPages(result.data.totalPages || 1);
          setTotalCount(result.data.totalCount || 0);
        }
      } catch (error) {
        console.error("Error fetching dog breeds from API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDogBreeds();
  }, [page, pageSize]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
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
      <h1 style={{ textAlign: "center" }}>{t('content.pets.dogsTitle')}</h1>
      {loading ? (
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
                  image={dog.image || '/logo.png'}
                  alt={dog.name}
                  style={{ objectFit: "cover" }}
                  onError={(e) => { e.target.src = '/logo.png'; }}
                />
                <CardContent>
                  <Typography variant="h6">{dog.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {dog.breed_group ? dog.breed_group : t('content.pets.noBreedGroup')}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {t('content.pets.originLine', { value: dog.origin || t('content.pets.noInfo') })}
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

      {/* Phân trang + chọn số lượng/trang */}
      {!loading && (
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="center"
          alignItems="center"
          gap={2}
          sx={{ marginTop: 4, marginBottom: 2 }}
        >
          <Pagination count={totalPages} page={page} onChange={handlePageChange} shape="rounded" />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="dogs-page-size-label">{t('shop.show')}</InputLabel>
            <Select
              labelId="dogs-page-size-label"
              label={t('shop.show')}
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              {PAGE_SIZE_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt === 'all' ? t('shop.allCount', { n: totalCount }) : t('shop.perPage', { n: opt })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
    </div>
  );
};

export default Dogs;
