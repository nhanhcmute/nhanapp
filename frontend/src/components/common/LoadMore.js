import React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const LoadMore = ({ isLoading, onClick }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      size="small"
      style={{
        marginTop: "20px",
        padding: "10px 16px",
        fontSize: "16px",
        minWidth: "300px",
        fontWeight: "bold",
        background: "linear-gradient(45deg, #2196F3, #21CBF3)", 
        color: "#fff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        textTransform: "none",
        borderRadius: "2px", 
      }}
      startIcon={!isLoading && <ExpandMoreIcon />} 
      disabled={isLoading} 
    >
      {isLoading ? (
        <CircularProgress size={24} style={{ color: "#fff" }} />
      ) : (
        "Load More"
      )}
    </Button>
  );
};

export default LoadMore;
