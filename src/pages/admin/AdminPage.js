import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import PetsIcon from "@mui/icons-material/Pets";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GroupIcon from "@mui/icons-material/Group";

const AdminPage = () => {
  const navigate = useNavigate(); 

  const handleNavigation = (section) => {
    navigate(section);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div className="homepage">
        <Box
          sx={{
            position: "relative",
            minHeight: "100vh",
            color: "#fff",
            padding: "20px",
            textAlign: "center",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <Box sx={{ pt: 6 }}>
            <Typography variant="h2" sx={{ mb: 3, fontWeight: "bold", color: "#FFD700" }}>
              Welcome to <span style={{ color: "#FFD700" }}>Nhân's Pet Haven</span>
            </Typography>
            <Typography variant="h6" sx={{ mb: 4 }}>
              Manage your pet supplies, track orders, update customer details, and ensure the best service for your furry friends!
            </Typography>

            {/* Quick Actions */}
            <Button
              variant="contained"
              color="primary"
              sx={{ mx: 1 }}
              onClick={() => handleNavigation("products")}
            >
              Manage Products
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mx: 1 }}
              onClick={() => handleNavigation("ordermanagement")}
            >
              View Orders
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={{ mx: 1 }}
              onClick={() => handleNavigation("customers")}
            >
              Manage Customers
            </Button>
          </Box>

          {/* Quick Stats Section */}
          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" sx={{ mb: 4, color: "#FFD700" }}>
              Quick Stats
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {/* Products Card */}
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    backgroundColor: "#FFD700",
                    color: "#000",
                    textAlign: "center",
                    boxShadow: 3,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                      <PetsIcon sx={{ fontSize: 40, color: "#000" }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      Products
                    </Typography>
                    <Typography variant="h4">120</Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Orders Card */}
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    backgroundColor: "#90CAF9",
                    color: "#000",
                    textAlign: "center",
                    boxShadow: 3,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                      <ShoppingCartIcon sx={{ fontSize: 40, color: "#000" }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      Orders
                    </Typography>
                    <Typography variant="h4">80</Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Customers Card */}
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    backgroundColor: "#66BB6A",
                    color: "#000",
                    textAlign: "center",
                    boxShadow: 3,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                      <GroupIcon sx={{ fontSize: 40, color: "#000" }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      Customers
                    </Typography>
                    <Typography variant="h4">35</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default AdminPage;
