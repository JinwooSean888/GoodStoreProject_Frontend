import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="app">
      <div className="hero-section">
        <div className="background-overlay"></div>

        <div className="content-container">
          <h1 className="main-title">제주도 혼자 옵서예~</h1>
          <p className="subtitle">
            제주도의 서쪽부에 있는 착한 모인 음식점을 간편히 찾아보세요.
          </p>

          <div className="search-container">
            <div className="search-input-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="맛집 이름 혹은 음식을 입력해주세요"
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="filter-toggle-btn"
            >
              <span className="filter-icon">🔽</span>
              필터 {showFilters ? "숨기기" : "보기"}
            </button>

            {showFilters && (
              <div className="filters-container">
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="filter-select"
                >
                  <option value="">모든 음식 종류</option>
                  <option value="한식">한식</option>
                  <option value="해산물">해산물</option>
                  <option value="고기구이">고기구이</option>
                  <option value="카페">카페</option>
                  <option value="제과점">제과점</option>
                  <option value="퓨전">퓨전</option>
                  <option value="전통음식">전통음식</option>
                </select>

                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="filter-select"
                >
                  <option value="">모든 가격대</option>
                  <option value="저렴함">저렴함</option>
                  <option value="보통">보통</option>
                  <option value="비쌈">비쌈</option>
                </select>

                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="filter-select"
                >
                  <option value="">모든 지역</option>
                  <option value="제주시">제주시</option>
                  <option value="서귀포시">서귀포시</option>
                  <option value="한림">한림</option>
                  <option value="성산">성산</option>
                  <option value="중문">중문</option>
                  <option value="오른">오른</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
