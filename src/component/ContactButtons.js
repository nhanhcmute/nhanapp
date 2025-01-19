import React, { useState } from "react";
import { Button, Stack } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import FacebookIcon from "@mui/icons-material/Facebook";
import PhoneIcon from "@mui/icons-material/Phone";
import Draggable from "react-draggable";

const ContactButtons = () => {
  const headerHeight = 60; // Chiều cao của header
  const [position, setPosition] = useState({
    x: 10,
    y: window.innerHeight - 150,
  });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragThreshold = 5;

  const handleStart = (e, data) => {
    setStartPosition({ x: data.x, y: data.y });
    setIsDragging(false);
  };

  const handleDrag = (e, data) => {
    const distance = Math.sqrt(
      Math.pow(data.x - startPosition.x, 2) + Math.pow(data.y - startPosition.y, 2)
    );
    if (distance > dragThreshold) {
      setIsDragging(true);
    }
  };

  const handleStop = (e, data) => {
    setIsDragging(false);
    const { innerWidth, innerHeight } = window;
    const btnWidth = 250;
    const btnHeight = 150;

    let newX = data.x;
    let newY = data.y;

    if (data.x + btnWidth / 2 < innerWidth / 2) {
      newX = 10;
    } else {
      newX = innerWidth - btnWidth;
    }

    if (data.y < headerHeight) {
      newY = headerHeight; 
    } else if (data.y + btnHeight > innerHeight) {
      newY = innerHeight - btnHeight;
    }

    setPosition({ x: newX, y: newY });
  };

  const handleClick = (callback) => {
    if (!isDragging) {
      callback();
    }
  };

  return (
    <div>
      <Draggable
        position={position}
        onStart={handleStart}
        onDrag={handleDrag}
        onStop={handleStop}
        bounds={{
          top: headerHeight + 20,
          left: 10,
          right: window.innerWidth -250, 
          bottom: window.innerHeight - 150, 
        }}
      >
        <div style={{ position: "fixed", zIndex: 1000 }}>
          <Stack spacing={1} direction="column">
            <Button
              variant="contained"
              color="primary"
              startIcon={<ChatIcon />}
              sx={{ backgroundColor: "#0078FF" }}
              onClick={() => handleClick(() => window.open("https://zalo.me", "_blank"))}
            >
              Chat Zalo
            </Button>

            <Button
              variant="contained"
              startIcon={<FacebookIcon />}
              sx={{ backgroundColor: "#4267B2", color: "#fff" }}
              onClick={() =>
                handleClick(() => window.open("https://m.me/YOUR_FACEBOOK_PAGE_ID", "_blank"))
              }
            >
              Chat Facebook
            </Button>

            <Button
              variant="contained"
              startIcon={<PhoneIcon />}
              sx={{ backgroundColor: "#FF3B30", color: "#fff" }}
              onClick={() => handleClick(() => (window.location.href = "tel:0396922376"))}
            >
              Hotline : 0396922376
            </Button>
          </Stack>
        </div>
      </Draggable>
    </div>
  );
};

export default ContactButtons;
