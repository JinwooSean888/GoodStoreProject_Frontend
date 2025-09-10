import React, { useState, useEffect } from "react";
import "./App.css";
import { Search } from "lucide-react";

// Sample restaurant data
const sampleRestaurants = [
  {
    id: 1,
    name: "가지회신",
    description: "바다와 해녀사이의 달큰한 유혹",
    category: "한식",
    priceRange: "저렴함",
    location: "제주시",
    rating: 4.5,
    price: "5,000원",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=300&h=200&fit=crop",
    coordinates: [33.4996, 126.5312],
    address: "제주시 애월읍 고성리 123-45"
  },
  {
    id: 2,
    name: "공터하우스",
    description: "제주의 맛있는 로컬 카페",
    category: "카페",
    priceRange: "보통",
    location: "제주시",
    rating: 4.2,
    price: "8,000원",
    image: "https://images.unsplash.com/photo-1661366394743-fe30fe478ef7?w=300&h=200&fit=crop",
    coordinates: [33.5102, 126.5211],
    address: "제주시 한림읍 한림로 456-78"
  },
  {
    id: 3,
    name: "해녀의 집",
    description: "신선한 해산물과 전통 해녀 요리",
    category: "해산물",
    priceRange: "보통",
    location: "서귀포시",
    rating: 4.7,
    price: "25,000원",
    image: "https://images.unsplash.com/photo-1671522636199-3af72349c2e5?w=300&h=200&fit=crop",
    coordinates: [33.2541, 126.5601],
    address: "서귀포시 성산읍 일출로 789-12"
  },
  {
    id: 4,
    name: "제주 흑돼지 맛집",
    description: "정통 제주 흑돼지 구이 전문점",
    category: "고기구이",
    priceRange: "비쌈",
    location: "제주시",
    rating: 4.6,
    price: "35,000원",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=300&h=200&fit=crop",
    coordinates: [33.4890, 126.4983],
    address: "제주시 중앙로 321-65"
  },
  {
    id: 5,
    name: "성산 일출 베이커리",
    description: "신선한 빵과 제주 감귤 디저트",
    category: "제과점",
    priceRange: "저렴함",
    location: "서귀포시",
    rating: 4.4,
    price: "6,000원",
    image: "https://images.unsplash.com/photo-1661366394743-fe30fe478ef7?w=300&h=200&fit=crop",
    coordinates: [33.4611, 126.9276],
    address: "서귀포시 성산읍 성산로 147-89"
  },
  {
    id: 6,
    name: "올레길 국수집",
    description: "제주 전통 멸치국수 맛집",
    category: "한식",
    priceRange: "저렴함",
    location: "제주시",
    rating: 4.8,
    price: "7,000원",
    image: "https://images.unsplash.com/photo-1671522636199-3af72349c2e5?w=300&h=200&fit=crop",
    coordinates: [33.5126, 126.5219],
    address: "제주시 조천읍 올레길 258-36"
  },
  {
    id: 7,
    name: "중식당 홍콩반점",
    description: "중식 전문점",
    category: "해산물",
    priceRange: "보통",
    location: "제주시",
    rating: 4.1,
    price: "12,000원",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=300&h=200&fit=crop",
    coordinates: [33.5010, 126.5310],
    address: "제주시 연동 11-22"
  },
  {
    id: 8,
    name: "스시 도쿄",
    description: "신선한 초밥과 일식 요리",
    category: "고기구이",
    priceRange: "비쌈",
    location: "서귀포시",
    rating: 4.5,
    price: "30,000원",
    image: "https://images.unsplash.com/photo-1603078379273-8c6b5f29df6c?w=300&h=200&fit=crop",
    coordinates: [33.2550, 126.5600],
    address: "서귀포시 대천동 33-45"
  },
  {
    id: 9,
    name: "양식 레스토랑",
    description: "서양식 요리 전문점",
    category: "카페",
    priceRange: "비쌈",
    location: "제주시",
    rating: 4.3,
    price: "28,000원",
    image: "https://images.unsplash.com/photo-1598514982442-6eb9a2b773e0?w=300&h=200&fit=crop",
    coordinates: [33.5100, 126.5200],
    address: "제주시 한경면 55-66"
  },
  {
    id: 10,
    name: "분식 천국",
    description: "분식 전문점",
    category: "제과점",
    priceRange: "저렴함",
    location: "제주시",
    rating: 4.0,
    price: "4,500원",
    image: "https://images.unsplash.com/photo-1617196032583-5fc3c98c2f16?w=300&h=200&fit=crop",
    coordinates: [33.5200, 126.5300],
    address: "제주시 조천읍 123-45"
  },
  {
    id: 11,
    name: "미용실 헤어스타",
    description: "미용실",
    category: "이미용업",
    priceRange: "보통",
    location: "제주시",
    rating: 4.2,
    price: "20,000원",
    image: "https://images.unsplash.com/photo-1588776814546-dbd7d0d2a3be?w=300&h=200&fit=crop",
    coordinates: [33.5000, 126.5250],
    address: "제주시 연동 10-11"
  }
];

function App() {
  const [restaurants, setRestaurants] = useState(sampleRestaurants);
  const [filteredRestaurants, setFilteredRestaurants] = useState(sampleRestaurants);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    priceRange: "",
    location: ""
  });

  useEffect(() => {
    let filtered = restaurants;

    if (filters.search) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(restaurant => restaurant.category === filters.category);
    }

    if (filters.priceRange) {
      filtered = filtered.filter(restaurant => restaurant.priceRange === filters.priceRange);
    }

    if (filters.location) {
      filtered = filtered.filter(restaurant => restaurant.location === filters.location);
    }

    setFilteredRestaurants(filtered);
  }, [filters, restaurants]);

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };

  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const getPriceRangeColor = (priceRange) => {
    switch (priceRange) {
      case "저렴함": return "price-tag-green";
      case "보통": return "price-tag-yellow";
      case "비쌈": return "price-tag-red";
      default: return "price-tag-gray";
    }
  };

  return (
    <div className="app">
      <div className="main-container">
        <div className="left-panel">
          <div className="search-section">
            <div className="title-section">
              <h1 className="main-title">제주시 혼자 옵서예~</h1>
              <p className="subtitle">제주시에 있는 착한 업소을 간편히 찾아보세요.</p>
            </div>

            <div className="search-bar">
              <div className="search-input-container">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="찾으시는 업소를 입력해주세요"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="filters-container">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="filter-select"
              >
                <option value="">지역</option><option value="건입동">건입동</option>
                <option value="구좌읍">구좌읍</option>
                <option value="노형동">노형동</option>
                <option value="도두동">도두동</option>
                <option value="봉개동">봉개동</option>
                <option value="삼도1동">삼도1동</option>
                <option value="삼도2동">삼도2동</option>
                <option value="삼양동">삼양동</option>
                <option value="아라동">아라동</option>
                <option value="애월읍">애월읍</option>
                <option value="연동">연동</option>
                <option value="오라동">오라동</option>
                <option value="외도동">외도동</option>
                <option value="용담1동">용담1동</option>
                <option value="용담2동">용담2동</option>
                <option value="이도1동">이도1동</option>
                <option value="이도2동">이도2동</option>
                <option value="이호동">이호동</option>
                <option value="일도1동">일도1동</option>
                <option value="일도2동">일도2동</option>
                <option value="조천읍">조천읍</option>
                <option value="추자면">추자면</option>
                <option value="한림읍">한림읍</option>
                <option value="화북동">화북동</option>
                <option value="한경면">한경면</option>
              </select>

              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange("priceRange", e.target.value)}
                className="filter-select"
              >
                <option value="">업종</option>
               <option value="한식">한식</option>
                <option value="중식">중식</option>
                <option value="일식">일식</option>
                <option value="양식">양식</option>
                <option value="분식">분식</option>
                <option value="제과">제과</option>
                <option value="카페">카페</option>
                <option value="음식점업">음식점업</option>
                <option value="기타요식업">기타요식업</option>
                <option value="세탁업">세탁업</option>
                <option value="기타서비스">기타서비스</option>
                <option value="숙박">숙박</option>
                <option value="숙박업">숙박업</option>
                <option value="기타">기타</option>
                <option value="미용">미용</option>
                <option value="이미용업">이미용업</option>
                <option value="기타비요">기타비요</option>
                <option value="기타비요식">기타비요식</option>
              </select>

              <select
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="filter-select"
              >
                <option value="">다른 지역</option>
                <option value="내용없음">내용없음</option>
              </select>
            </div>
          </div>
          
          <div className="results-section">
            <div className="list-header">
              <h2 className="list-title">검색 결과 ({filteredRestaurants.length}개)</h2>
            </div>
            
            <div className="list-container">
              {filteredRestaurants.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🍽️</div>
                  <h3 className="empty-title">검색 결과가 없습니다</h3>
                  <p className="empty-text">다른 검색어나 필터를 시도해보세요.</p>
                </div>
              ) : (
                filteredRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className={`restaurant-card ${selectedRestaurant?.id === restaurant.id ? 'selected' : ''}`}
                    onClick={() => handleRestaurantSelect(restaurant)}
                  >
                    <div className="card-image">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="restaurant-image"
                      />
                      <div className={`price-badge ${getPriceRangeColor(restaurant.priceRange)}`}>
                        {restaurant.priceRange}
                      </div>
                    </div>
                    
                    <div className="card-content">
                      <div className="card-header">
                        <h3 className="restaurant-name">{restaurant.name}</h3>
                        <div className="rating">
                          <span className="star-icon">⭐</span>
                          <span className="rating-text">{restaurant.rating}</span>
                        </div>
                      </div>
                      
                      <p className="restaurant-description">{restaurant.description}</p>
                      
                      <div className="card-footer">
                        <div className="location-info">
                          <span className="location-icon">📍</span>
                          <span className="location-text">{restaurant.location}</span>
                        </div>
                        <div className="price-info">
                          <span className="price-text">{restaurant.price}</span>
                        </div>
                      </div>
                      
                      <div className="category-tag">
                        {restaurant.category}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="map-container">
            <div className="map-placeholder">
              <h2 className="map-title">지도</h2>
              <p className="map-subtitle">업소 위치가 여기에 표시됩니다</p>
              {selectedRestaurant && (
                <div className="selected-info">
                  <p><strong>선택된 맛집:</strong> {selectedRestaurant.name}</p>
                  <p>{selectedRestaurant.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
