import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import CSS của leaflet

const MapComponent = ({ latitude, longitude }) => {
  const mapRef = useRef(null); // Sử dụng useRef để giữ tham chiếu tới bản đồ

  useEffect(() => {
    if (mapRef.current) {
      // Nếu bản đồ đã được khởi tạo, không khởi tạo lại
      return;
    }

    // Khởi tạo bản đồ chỉ khi chưa khởi tạo
    mapRef.current = L.map('map', {
      center: [latitude, longitude],
      zoom: 13,
    });

    // Thêm lớp tile từ OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    // Thêm marker tại tọa độ
    L.marker([latitude, longitude]).addTo(mapRef.current).bindPopup('Vị trí của bạn').openPopup();

  }, [latitude, longitude]); // Chạy lại khi latitude hoặc longitude thay đổi

  return <div id="map" style={{ height: '400px' }}></div>;
};

export default MapComponent;
