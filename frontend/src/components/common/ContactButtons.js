import React, { useState, useRef } from "react";
import { Button, Stack, Box } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import FacebookIcon from "@mui/icons-material/Facebook";
import PhoneIcon from "@mui/icons-material/Phone";
import Draggable from "react-draggable";

const ContactButtons = () => {
  const headerHeight = 60; // Chiều cao của header
  const containerRef = useRef(null);
  // Neo mặc định ở góc trên bên PHẢI, ngay dưới header: Sidebar tài khoản và
  // nhiều layout khác luôn nằm bên trái nên neo trái/đáy khiến widget này đè
  // lên menu hoặc các dòng cuối của danh sách (giỏ hàng, đơn hàng, ...) vốn
  // thường kéo dài xuống gần đáy viewport. Vùng ngay dưới header, sát lề phải
  // là nơi ít bị nội dung chính (thường căn giữa hoặc căn trái) chiếm chỗ nhất.
  const [position, setPosition] = useState({
    // Trên mobile/tablet widget co lại chỉ còn icon (~56px) nên không cần
    // chừa nhiều chỗ như bản đầy đủ nhãn chữ (~220px) chỉ dùng ở desktop.
    x: Math.max(10, window.innerWidth - (window.innerWidth < 900 ? 70 : 220)),
    y: headerHeight + 20,
  });
  // Nhãn chữ chỉ hiện từ md (900px) trở lên; dưới mức đó (mobile + tablet) chỉ
  // hiện icon để thu nhỏ widget, tránh che các tiêu đề trang căn giữa (đã xác
  // nhận va chạm thật ở 768px khi còn hiện nhãn chữ từ mốc 600px).
  const compactButtonSx = {
    minWidth: { xs: '44px', md: '64px' },
    px: { xs: 1, md: 2 },
    '& .MuiButton-startIcon': { mr: { xs: 0 } },
  };
  const ButtonLabel = ({ children }) => (
    <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>{children}</Box>
  );
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
    const rect = containerRef.current?.getBoundingClientRect();
    const btnWidth = rect ? rect.width : 220;
    const btnHeight = rect ? rect.height : 150;

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
          right: window.innerWidth - (containerRef.current?.getBoundingClientRect().width || 220),
          bottom: window.innerHeight - 150,
        }}
      >
        <div ref={containerRef} style={{ position: "fixed", zIndex: 1000 }}>
          <Stack spacing={1} direction="column">
            <Button
              variant="contained"
              color="primary"
              startIcon={<ChatIcon />}
              aria-label="Chat Zalo"
              sx={{ backgroundColor: "#0078FF", ...compactButtonSx }}
              onClick={() => handleClick(() => window.open("https://zalo.me", "_blank"))}
            >
              <ButtonLabel>Chat Zalo</ButtonLabel>
            </Button>

            <Button
              variant="contained"
              startIcon={<FacebookIcon />}
              aria-label="Chat Facebook"
              sx={{ backgroundColor: "#4267B2", color: "#fff", ...compactButtonSx }}
              onClick={() =>
                handleClick(() => window.open("https://m.me/YOUR_FACEBOOK_PAGE_ID", "_blank"))
              }
            >
              <ButtonLabel>Chat Facebook</ButtonLabel>
            </Button>

            <Button
              variant="contained"
              startIcon={<PhoneIcon />}
              aria-label="Hotline 0396922376"
              sx={{ backgroundColor: "#FF3B30", color: "#fff", ...compactButtonSx }}
              onClick={() => handleClick(() => (window.location.href = "tel:0396922376"))}
            >
              <ButtonLabel>Hotline : 0396922376</ButtonLabel>
            </Button>
          </Stack>
        </div>
      </Draggable>
    </div>
  );
};

export default ContactButtons;
