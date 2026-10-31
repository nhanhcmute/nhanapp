import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useLanguage } from '../i18n/LanguageContext';

const ErrorPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 10, p: 4, borderRadius: 2, bgcolor: "#f8f9fa", boxShadow: 3 }}>
      <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main" }} />
      <Typography variant="h1" color="error" fontWeight="bold" mt={2}>
        404
      </Typography>
      <Typography variant="h4" mt={2} fontWeight="medium" color="text.primary">
        {t('account.error.title')}
      </Typography>
      <Typography variant="body1" color="textSecondary" mt={1}>
        {t('account.error.text')}
      </Typography>
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/")}
          sx={{ borderRadius: 2, textTransform: "none", fontSize: "1rem", px: 4, py: 1.5 }}
        >
          {t('account.error.home')}
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;
