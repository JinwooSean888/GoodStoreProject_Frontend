import axios from "axios";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"; // 👈 useMap 추가
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 기본 아이콘
const defaultIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  shadowSize: [41, 41],
});

// 👇 지도 외부 제어 컴포넌트
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
};

const MapView = ({ viewData, selectedLocation }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (viewData.length) {
      const temp = viewData.map((item) => ({
        ...item,
        latitude: item.laCrdnt,
        longitude: item.loCrdnt,
        laCrdnt: undefined,
        loCrdnt: undefined,
      }));
      setLocations(temp);
    }
  }, [viewData]);

  // 기본 중심 좌표
  const defaultCenter = [33.5111, 126.5277];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false} // ✅ 줌 컨트롤 제거
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* 👇 지도 자동 이동 */}
      <MapUpdater center={selectedLocation} zoom={16} />

      {locations.map((loc, idx) => (
        <Marker
          key={idx}
          position={[loc.latitude, loc.longitude]}
          icon={defaultIcon}
        >
          <Popup>
            상호명: {loc.bsshNm} <br />
            주소: {loc.rnAdres} <br />
            전화: {loc.bsshTelno}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;