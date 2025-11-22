import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import CSS của leaflet

const MapComponent = ({ latitude, longitude, addressLabel }) => {
  const mapRef = useRef(null); // Sử dụng useRef để giữ tham chiếu tới bản đồ
  const markerRef = useRef(null); // Sử dụng useRef để giữ tham chiếu tới marker
  const mapIdRef = useRef(`map-${Math.random().toString(36).substr(2, 9)}`); // Tạo ID duy nhất cho mỗi map instance

  useEffect(() => {
    const mapId = mapIdRef.current;
    const mapElement = document.getElementById(mapId);
    
    if (!mapElement) return;

    // Khởi tạo bản đồ chỉ khi chưa khởi tạo
    if (!mapRef.current) {
      mapRef.current = L.map(mapId, {
        center: [latitude, longitude],
        zoom: 13,
      });

      // Thêm lớp tile từ OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    // Xóa marker cũ nếu có
    if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
    }

    // Tạo marker mới với tọa độ mới
    const popupText = addressLabel || 'Vị trí của bạn';
    markerRef.current = L.marker([latitude, longitude])
      .addTo(mapRef.current)
      .bindPopup(popupText)
      .openPopup();

    // Cập nhật view của map đến vị trí mới
    mapRef.current.setView([latitude, longitude], 13);

    // Cleanup function
    return () => {
      if (markerRef.current && mapRef.current) {
        mapRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    };
  }, [latitude, longitude, addressLabel]); // Chạy lại khi latitude, longitude hoặc addressLabel thay đổi

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div id={mapIdRef.current} style={{ height: '400px' }}></div>;
};

export default MapComponent;
