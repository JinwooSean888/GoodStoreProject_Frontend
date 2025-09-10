import logo from "../logo.svg";

const Home = () => {
  return (
    <div id="main-container">
      <div id="left-column">
        <header id="header">
          <h1>제주도 혼자 옵서예~</h1>
          <p>제주도와 서귀포에 있는 착한 모범 음식점 간편히 찾아보세요.</p>
        </header>

        <form id="search-form" method="post" action="#">
          <input
            type="text"
            name="query"
            id="query"
            placeholder="메뉴 혹은 업소 이름을 입력해주세요"
          />
          <input type="submit" value="전송" />
        </form>

        <div id="map-area">
          <div class="placeholder-text">검색 결과</div>
        </div>

        <footer id="footer">
          <ul class="icons">
            <li>
              <a href="#" class="icon brands fa-twitter">
                <span class="label">Twitter</span>
              </a>
            </li>
            <li>
              <a href="#" class="icon brands fa-instagram">
                <span class="label">Instagram</span>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/JinwooSean888/GoodStoreProject_Frontend"
                class="icon brands fa-github"
              >
                <span class="label">GitHub</span>
              </a>
            </li>
            <li>
              <a href="#" class="icon fa-envelope">
                <span class="label">Email</span>
              </a>
            </li>
          </ul>
          <ul class="copyright">
            <li>&copy; Untitled.</li>
            <li>
              Credits: <a href="http://html5up.net"></a>
            </li>
          </ul>
        </footer>
      </div>
      <div id="right-column">
        <h2>지도</h2>
        <div id="results-area"></div>
      </div>
    </div>
  );
};

export default Home;
