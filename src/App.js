import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { Search, Map, List, Maximize2, Minimize2, Filter, Star, MapPin, Phone, Navigation, Clock } from "lucide-react";
import axios from "axios";

const sampleRestaurants = [];

function App() {
  const [restaurants, setRestaurants] = useState(sampleRestaurants);
  const [filteredRestaurants, setFilteredRestaurants] = useState(sampleRestaurants);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [filters, setFilters] = useState({ search: "", category: "", location: "" });
  const [history, setHistory] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // 새로운 UI 상태들
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState("balanced"); // "map-focused", "balanced", "list-focused"
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortBy, setSortBy] = useState("distance");

  const chatContainerRef = useRef(null);

  const categoryOptions = [
    { value: "11", label: "한식" }, { value: "12", label: "중식" },
    { value: "13", label: "일식" }, { value: "14", label: "양식" },
    { value: "15", label: "분식" }, { value: "16", label: "제과" },
    { value: "17", label: "카페" }, { value: "18", label: "음식점업" },
    { value: "19", label: "기타요식업" }, { value: "20", label: "세탁업" },
    { value: "21", label: "기타서비스" }, { value: "22", label: "숙박" },
    { value: "23", label: "숙박업" }, { value: "24", label: "기타" },
    { value: "25", label: "미용" }, { value: "26", label: "미용업" },
    { value: "27", label: "이미용업" }, { value: "28", label: "기타비요" },
    { value: "29", label: "기타비요식" },
  ];

  const regionOptions = [
    { value: "101", label: "건입동" }, { value: "102", label: "구좌읍" },
    { value: "103", label: "노형동" }, { value: "104", label: "도두동" },
    { value: "105", label: "봉개동" }, { value: "106", label: "삼도1동" },
    { value: "107", label: "삼도2동" }, { value: "108", label: "삼양동" },
    { value: "109", label: "아라동" }, { value: "110", label: "애월읍" },
    { value: "111", label: "연동" }, { value: "112", label: "오라동" },
    { value: "113", label: "외도동" }, { value: "114", label: "용담1동" },
    { value: "115", label: "용담2동" }, { value: "116", label: "이도1동" },
    { value: "117", label: "이도2동" }, { value: "118", label: "이호동" },
    { value: "119", label: "일도1동" }, { value: "120", label: "일도2동" },
    { value: "121", label: "조천읍" }, { value: "122", label: "추자면" },
    { value: "123", label: "한림읍" }, { value: "124", label: "화북동" },
    { value: "125", label: "한경면" },
  ];

  // 퀵 필터 옵션들
  const quickFilters = [
    { id: "open", label: "영업중", color: "#10b981" },
    { id: "nearby", label: "가까운곳", color: "#3b82f6" },
    { id: "cheap", label: "저렴한", color: "#f59e0b" },
    { id: "rating", label: "평점높은", color: "#8b5cf6" }
  ];

  // 레스토랑 필터 적용
  useEffect(() => {
    let filtered = restaurants;

    if (filters.category) {
      const catLabel = categoryOptions.find(opt => opt.value === filters.category)?.label;
      if (catLabel) filtered = filtered.filter(r => r.category === catLabel);
    }

    if (filters.location) {
      const locLabel = regionOptions.find(opt => opt.value === filters.location)?.label;
      if (locLabel) filtered = filtered.filter(r => r.location === locLabel);
    }

    if (filters.search) {
      filtered = filtered.filter(r =>
        r.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredRestaurants(filtered);
  }, [filters, restaurants]);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleRestaurantSelect = (restaurant) => setSelectedRestaurant(restaurant);

  // 퀵 필터 토글
  const toggleQuickFilter = (filterId) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  // 전체 필터 해제
  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  // 뷰 모드에 따른 높이 계산
  const getViewHeights = () => {
    switch (viewMode) {
      case "map-focused":
        return { mapHeight: "75%", listHeight: "25%" };
      case "list-focused":
        return { mapHeight: "25%", listHeight: "75%" };
      default:
        return { mapHeight: "40%", listHeight: "60%" };
    }
  };

  const formatTime = (date) => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour >= 12 ? '오후' : '오전';
    const displayHour = hour % 12 || 12;
    return `${ampm} ${displayHour}:${minute.toString().padStart(2, '0')}`;
  };

  const handleSubmitAI = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !filters.category || !filters.location) {
      alert("업종, 지역, 질문을 모두 입력해주세요.");
      return;
    }

    const payload = {
      question: inputText,
      filters: { indutyType: filters.category, emdType: filters.location },
    };

    setIsLoading(true);
    try {
      const res = await axios.post("http://192.168.0.45:8000/ask", payload);
      const answer = res.data.answer || "답변을 받을 수 없습니다.";
      
      const now = new Date();
      setHistory(prev => [
        ...prev,
        { user: inputText, time: now },
        { ai: answer, time: now }
      ]);
    } catch (err) {
      const now = new Date();
      setHistory(prev => [
        ...prev,
        { user: inputText, time: now },
        { ai: "서버 연결 실패. 다시 시도해 주세요.", time: now }
      ]);
    } finally {
      setIsLoading(false);
      setInputText("");
    }
  };

  // 자동 스크롤 맨 아래
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  const { mapHeight, listHeight } = getViewHeights();

  return (
    <div className="app">
      <div className="main-container">
        {/* LEFT PANEL */}
        <div className={`left-panel ${sidebarCollapsed ? 'collapsed' : ''}`}>
          {!sidebarCollapsed && (
            <>
              {/* 검색 + 필터 */}
              <div className="search-section">
                <div className="title-section">
                  <h1 className="main-title">제주시 혼자 옵서예~</h1>
                  <p className="subtitle">제주시에 있는 착한 업소를 간편히 찾아보세요.</p>
                </div>

                <form className="search-bar" onSubmit={handleSubmitAI}>
                  <div className="search-input-container">
                    <Search className="search-icon" size={20} />
                    <input
                      type="text"
                      placeholder="AI에게 물어볼 질문 입력"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="search-input"
                    />
                  </div>

                  <div className="filters-container">
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange("category", e.target.value)}
                      className="filter-select"
                    >
                      <option value="">업종</option>
                      {categoryOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>

                    <select
                      value={filters.location}
                      onChange={(e) => handleFilterChange("location", e.target.value)}
                      className="filter-select"
                    >
                      <option value="">지역</option>
                      {regionOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>

                    <button type="submit" className="search-button" disabled={isLoading}>
                      {isLoading ? "전송 중..." : "질문 전송"}
                    </button>
                  </div>
                </form>
              </div>

              {/* AI 상담 기록 */}
              <div className="results-section">
                <div className="list-header">
                  <h2 className="list-title">AI 상담 기록 ({history.length}개)</h2>
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </div>
                <div className="list-container">
                  {history.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">🤖</div>
                      <h3 className="empty-title">아직 질문이 없습니다</h3>
                      <p className="empty-text">질문을 입력하고 전송해보세요.</p>
                    </div>
                  ) : (
                    <div className="chat-container" ref={chatContainerRef}>
                      {history.map((item, idx) => (
                        <React.Fragment key={idx}>
                          {/* 사용자 메시지 */}
                          {item.user && (
                            <>
                              <div className="chat-message user">
                                <div className="message-content user-message">{item.user}</div>
                              </div>
                              <div className="message-time user-time">{formatTime(item.time)}</div>
                            </>
                          )}

                          {/* AI 메시지 */}
                          {item.ai && item.ai.trim() !== "" && (
                            <>
                              <div className="chat-message ai">
                                <div className="ai-avatar">
                                  <span>🤖</span>
                                </div>
                                <div className="message-content ai-message">{item.ai}</div>
                              </div>
                              <div className="message-time ai-time">{formatTime(item.time)}</div>
                            </>
                          )}
                        </React.Fragment>
                      ))}

                      {/* 타이핑 중 표시 */}
                      {isLoading && (
                        <>
                          <div className="chat-message ai">
                            <div className="ai-avatar">
                              <span>🤖</span>
                            </div>
                            <div className="message-content ai-message typing-effect">
                              답변 생성 중...
                            </div>
                          </div>
                          <div className="message-time ai-time">지금</div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* 사이드바 토글 버튼 */}
          <div className="sidebar-toggle">
            <button 
              className="toggle-button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          {/* 뷰 컨트롤 헤더 */}
          <div className="view-controls">
            <div className="view-buttons">
              <button 
                className={`view-button ${viewMode === 'map-focused' ? 'active' : ''}`}
                onClick={() => setViewMode('map-focused')}
              >
                <Map size={16} />
                지도 중심
              </button>
              <button 
                className={`view-button ${viewMode === 'balanced' ? 'active' : ''}`}
                onClick={() => setViewMode('balanced')}
              >
                균등 보기
              </button>
              <button 
                className={`view-button ${viewMode === 'list-focused' ? 'active' : ''}`}
                onClick={() => setViewMode('list-focused')}
              >
                <List size={16} />
                목록 중심
              </button>
            </div>
            
            {selectedRestaurant && (
              <div className="selected-badge">
                선택된 업소: {selectedRestaurant.name}
              </div>
            )}
          </div>

          {/* 지도 영역 */}
          <div className="map-container" style={{ height: mapHeight }}>
            <div className="map-placeholder">
              <h2 className="map-title">지도</h2>
              <p className="map-subtitle">업소 위치가 여기에 표시됩니다</p>
              {selectedRestaurant && (
                <div className="selected-info">
                  <p><strong>선택된 업소:</strong> {selectedRestaurant.name}</p>
                  <p>{selectedRestaurant.address}</p>
                </div>
              )}
            </div>

            {/* 지도 컨트롤 */}
            <div className="map-controls">
              <button className="map-control-button">+</button>
              <button className="map-control-button">-</button>
            </div>
          </div>

          {/* 필터 툴바 + 리스트 영역 */}
          <div className="list-area" style={{ height: listHeight }}>
            {/* 필터 툴바 */}
            <div className="filter-toolbar">
              <div className="toolbar-header">
                <div className="filter-info">
                  <h3 className="result-count">검색결과 {filteredRestaurants.length}개</h3>
                  {activeFilters.length > 0 && (
                    <button className="clear-filters" onClick={clearAllFilters}>
                      전체해제
                    </button>
                  )}
                </div>
                
                <div className="sort-controls">
                  <Filter size={16} />
                  <select 
                    className="sort-select" 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="distance">가까운순</option>
                    <option value="rating">평점순</option>
                    <option value="price">가격순</option>
                    <option value="popular">인기순</option>
                  </select>
                </div>
              </div>
              
              <div className="quick-filters">
                {quickFilters.map(filter => (
                  <button 
                    key={filter.id}
                    className={`filter-chip ${activeFilters.includes(filter.id) ? 'active' : ''}`}
                    onClick={() => toggleQuickFilter(filter.id)}
                    style={{ 
                      '--filter-color': filter.color,
                      backgroundColor: activeFilters.includes(filter.id) ? filter.color : 'transparent',
                      color: activeFilters.includes(filter.id) ? 'white' : filter.color,
                      borderColor: filter.color
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 리스트 컨테이너 */}
            <div className="restaurant-list">
              {filteredRestaurants.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🍽️</div>
                  <h3 className="empty-title">검색 결과가 없습니다</h3>
                  <p className="empty-text">다른 조건으로 검색해보세요.</p>
                </div>
              ) : (
                filteredRestaurants.map((restaurant, idx) => (
                  <div 
                    key={idx} 
                    className={`restaurant-card modern ${selectedRestaurant === restaurant ? 'selected' : ''}`}
                    onClick={() => handleRestaurantSelect(restaurant)}
                  >
                    <div className="card-image">
                      <img src={restaurant.image || '/placeholder-food.jpg'} alt={restaurant.name} className="restaurant-image" />
                      <div className="status-badges">
                        <span className="distance-badge">{restaurant.distance || '1.2km'}</span>
                        {restaurant.isOpen === false && (
                          <span className="closed-badge">마감</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="card-content">
                      <div className="card-header">
                        <h3 className="restaurant-name">{restaurant.name}</h3>
                        <span className="price-range">{restaurant.priceRange || '$$'}</span>
                      </div>
                      
                      <p className="restaurant-description">{restaurant.description}</p>
                      
                      <div className="rating-info">
                        <div className="rating">
                          <Star className="star-icon" size={14} fill="#fbbf24" />
                          <span className="rating-text">{restaurant.rating || '4.5'}</span>
                        </div>
                        {restaurant.reviewCount && (
                          <span className="review-count">({restaurant.reviewCount}개 리뷰)</span>
                        )}
                        <div className="status-indicator">
                          {restaurant.isOpen !== false && (
                            <span className="open-badge">영업중</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="location-info">
                        <MapPin size={12} />
                        <span className="location-text">{restaurant.location}</span>
                        {restaurant.category && (
                          <>
                            <span className="separator">•</span>
                            <span className="category-text">{restaurant.category}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="card-footer">
                        <span className="price-info">{restaurant.price || '가격 문의'}</span>
                        <div className="action-buttons">
                          <button className="action-button">
                            <Navigation size={12} />
                            길찾기
                          </button>
                          <button className="action-button">
                            <Phone size={12} />
                            전화
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;