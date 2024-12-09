import React from "react";
import { Typography,Box } from "@mui/material";
import Sidebar from "../../function/Sidebar";

const Pricacy = () => {
    return(
        <Box display="flex"
        sx={{
          height: '100vh',
          backgroundColor: '#f5f5f5',
        }}>
            <Box sx={{ width: '250px', backgroundColor: '#fff' }}>
                <Sidebar/>
            </Box>
        <Typography variant="body1" align="center" style={{ color: '#757575' }}>Page này chẳng có gì</Typography>
        </Box>
    );
}

export default Pricacy;