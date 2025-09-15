import axios from "axios";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet"; // leaflet import 추가
import "leaflet/dist/leaflet.css";

// 기본 아이콘 문제 해결 (아이콘 수정)
const defaultIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconSize: [25, 41], // 마커 크기
  iconAnchor: [12, 41], // 마커 앵커 위치
  popupAnchor: [1, -34], // 팝업 앵커 위치
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"), // 그림자 아이콘
  shadowSize: [41, 41], // 그림자 크기
});

const MapView = ({ viewData }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (viewData.length) {
      const temp = viewData.map((item) => ({
        ...item,
        latitude: item.laCrdnt,
        longitude: item.loCrdnt,
        laCrdnt: undefined, // 필요 없으면 제거
        loCrdnt: undefined, // 필요 없으면 제거
      }));
      setLocations(temp);
    }
  }, [viewData]);

  console.log(locations);

  // 기본 지도 중심 좌표 (제주시)
  const defaultCenter = [33.5111, 126.5277];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {locations.map((loc, idx) => (
        <Marker
          key={idx}
          position={[loc.latitude, loc.longitude]}
          icon={defaultIcon}
        >
          <Popup>
            상호명: {loc.bsshNm} <br />
            위도: {loc.latitude}, 경도: {loc.longitude}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;