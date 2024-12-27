import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function getNews() {
      try {
        const res = await fetch(
          "https://newsapi.org/v2/top-headlines?country=us&apiKey=a73c46879e5a49d2ad08a3d7f292d061"
        );
        if (!res.ok) {
          throw new Error("Failed to fetch news");
        }
        const data = await res.json();
        setNews((prev) => [...prev, ...data.articles]);
      } catch (error) {
        setError(error.message);
      }
    }
    getNews();
  }, [page]);
  const handleInfiniteScroll = () => {
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        setPage((prev) => prev + 1);
      }
    } catch (error) {}
  };
  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
  });

  return (
    <div className="App">
      <Header />
      {error ? (
        <div className="error">Error: {error}</div>
      ) : (
        <Main news={news} />
      )}
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <div className="logo">NEWS APP</div>
      <div className="search">
        <input type="text" placeholder="Search news..." />
        <button>Search</button>
      </div>
    </header>
  );
}

function Main({ news }) {
  // Filter out any articles with missing data
  const filteredNews = news.filter(
    (data) => data.title && data.description && data.urlToImage
  );

  return (
    <div className="main">
      {filteredNews.length > 0 ? (
        filteredNews.map((data, index) => (
          <NewsSection key={data.url || index} data={data} />
        ))
      ) : (
        <div className="loading">No articles available</div>
      )}
    </div>
  );
}

function NewsSection({ data }) {
  return (
    <div className="section">
      <div className="image">
        <img
          src={data.urlToImage || "https://via.placeholder.com/150"}
          alt={data.title || "News"}
        />
      </div>
      <div className="details">
        <div className="title">{data.title || "No Title Available"}</div>
        <div className="description">
          {data.description || "No Description Available"}
        </div>
      </div>
    </div>
  );
}

export default App;
