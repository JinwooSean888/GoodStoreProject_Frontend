import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { Search } from "lucide-react";
import axios from "axios";

// 🚫 샘플 데이터 제거됨 - 실제 데이터는 API에서 가져오기
const sampleRestaurants = [];

function App() {
  const [restaurants, setRestaurants] = useState(sampleRestaurants);
  const [filteredRestaurants, setFilteredRestaurants] = useState(sampleRestaurants);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [filters, setFilters] = useState({ search: "", category: "", location: "" });
  const [history, setHistory] = useState([]); // AI 질문-답변 히스토리
  const [inputText, setInputText] = useState(""); // AI 질문 입력창
  const [isLoading, setIsLoading] = useState(false);

  const chatContainerRef = useRef(null); // 스크롤 제어용

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

  const getPriceRangeColor = (priceRange) => {
    switch (priceRange) {
      case "저렴함": return "price-tag-green";
      case "보통": return "price-tag-yellow";
      case "비쌈": return "price-tag-red";
      default: return "price-tag-gray";
    }
  };

  // 🔥 AI 질문 제출
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
      setHistory(prev => [...prev, { user: inputText, ai: answer }]);
    } catch (err) {
      setHistory(prev => [...prev, { user: inputText, ai: "서버 연결 실패. 다시 시도해 주세요." }]);
    } finally {
      setIsLoading(false);
      setInputText("");
    }
  };

  // 스크롤 자동 하단 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  return (
    <div className="app">
      <div className="main-container">
        {/* LEFT PANEL */}
        <div className="left-panel">
          {/* 레스토랑 검색 + 필터 */}
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
                      {/* AI 메시지 */}
                      <div className="chat-message">
                        <div className="message-header">
                          <div className="ai-icon">AI</div>
                          <span>맞춤형 추천 도우미</span>
                        </div>
                        <div className="message-content ai-message">{item.ai}</div>
                      </div>

                      {/* 사용자 메시지 */}
                      <div className="chat-message" style={{ alignSelf: 'flex-end' }}>
                        <div className="message-header">
                          <div className="user-icon">나</div>
                          <span>나</span>
                        </div>
                        <div className="message-content user-message">{item.user}</div>
                      </div>
                    </React.Fragment>
                  ))}

                  {/* 타이핑 중 표시 (옵션) */}
                  {isLoading && (
                    <div className="chat-message">
                      <div className="message-header">
                        <div className="ai-icon">AI</div>
                        <span>맞춤형 추천 도우미</span>
                      </div>
                      <div className="message-content ai-message typing-effect">
                        답변 생성 중
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="map-container">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;