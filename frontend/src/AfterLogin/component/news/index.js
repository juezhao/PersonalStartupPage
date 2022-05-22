import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { notification } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { RotatingLines } from "react-loader-spinner";

export default function News() {
  //initialize the state
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(4);
  const leftArrow = useRef();
  const arrowContainer = useRef();
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(null);
  const [newsSource, setNewsSource] = useState("bbc-news");

  //swap the api key if one can not get the news properly
  const apiKey = "b22c3fab7d9548f2a91e2a08506393b4";
  const apikey2 = "0e8d5bb433794c7fba2e7f990ec42e27";
  const apikey3 = "305c8809eab042e29aa3f27301837350";

  // fetching data from the News api and setting it to the state, start the animation
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://newsapi.org/v2/top-headlines?sources=${newsSource}&apiKey=${apiKey||apikey2||apikey3}`
      )
      .then((res) => {
        setNews(res.data.articles);
        setLoading(false);
        // console.log(res.data.articles);
        setError(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        setError(true);
        notification.error({
          message: "Error",
          description: "Error, can not connect to server",
          placement: "bottomRight",
        });
      });
    clearInterval(timer);
    setTimer(
      setInterval(() => {
        leftArrow.current && leftArrow.current.click();
      }, 4000)
    );
  }, [newsSource]);

//handle change value of the news source
  const handleSourceChange = (e) => {
    console.log(e.target.value);
    setNewsSource(e.target.value);
  };

  //go to the next slide, if the current slide is the last one, go to the first one
  const next = () => {
    if (activeSlide < news.length - 1) {
      setActiveSlide(activeSlide + 1);
    }
    if (activeSlide === news.length - 1) {
      setActiveSlide(0);
    }
  };
  //go to the previous slide, if the current slide is the first one, go to the last one
  const prev = () => {
    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    }
    if (activeSlide === 0) {
      setActiveSlide(news.length - 1);
    }
  };

  //stop the animation and clear the interval
  const pauseAnimation = () => {
    clearInterval(timer);
    setTimer(clearInterval(timer));
    arrowContainer.current && (arrowContainer.current.style.opacity = 1);
  };
  //restart the animation and reset the interval
  const restartAnimation = () => {
    clearInterval(timer);
    setTimer(
      setInterval(() => {
        leftArrow.current && leftArrow.current.click();
      }, 4000)
    );
    arrowContainer.current && (arrowContainer.current.style.opacity = 0);
  };

  //apply the css style to different slides depending on the current slide
  const getStyles = (index) => {
    if (activeSlide === index)
      return {
        opacity: 1,
        transform: "translateX(0px) translateZ(0px) rotateY(0deg)",
        zIndex: 10,
      };
    else if (activeSlide - 1 === index)
      return {
        opacity: 1,
        transform: "translateX(-240px) translateZ(-400px) rotateY(35deg)",
        zIndex: 9,
      };
    else if (activeSlide + 1 === index)
      return {
        opacity: 1,
        transform: "translateX(240px) translateZ(-400px) rotateY(-35deg)",
        zIndex: 9,
      };
    else if (activeSlide - 2 === index)
      return {
        opacity: 1,
        transform: "translateX(-480px) translateZ(-500px) rotateY(35deg)",
        zIndex: 8,
      };
    else if (activeSlide + 2 === index)
      return {
        opacity: 1,
        transform: "translateX(480px) translateZ(-500px) rotateY(-35deg)",
        zIndex: 8,
      };
    else if (index < activeSlide - 2)
      return {
        opacity: 0,
        transform: "translateX(-480px) translateZ(-500px) rotateY(35deg)",
        zIndex: 7,
      };
    else if (index > activeSlide + 2)
      return {
        opacity: 0,
        transform: "translateX(480px) translateZ(-500px) rotateY(-35deg)",
        zIndex: 7,
      };
  };
  //Add news page to bookmarks
  const addToBookmark = (url, title) => {
    console.log(url, title);
    axios
      .post("/api/bookmark/createBookmark", {
        tabName: newsSource.toUpperCase(),
        urlName: title,
        url: url,
      })
      .then((res) => {
        // console.log(res)
        notification.success({
          message: "Success",
          description: "Added to Bookmarks Successfully",
          placement: "bottomRight",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: "Error",
          description: "Error! Can not add to bookmarks",
          placement: "bottomRight",
        });
      });
  };

  return (
    <div
      className="article-container"
      onMouseEnter={pauseAnimation}
      onMouseLeave={restartAnimation}
    >
      {loading ? (
        <h1>
          Loading...
          <br />
          <RotatingLines width="100" strokeColor="#FF5733" />
        </h1>
      ) : error ? (
        <div>Error cannot load the news</div>
      ) : (
        news.map((article, i) => {
          article.urlToImage =
            article.urlToImage ||
            "https://via.placeholder.com/400/000000/FFFFFF/?text=Photo_unavailable";
          return (
            <React.Fragment key={i}>
              <div className="article-panel" style={{ ...getStyles(i) }}>
                <a href={article.url} target="_blank" rel="noreferrer">
                  <h3 className="article-title">{article.title}</h3>
                </a>
                <img src={article.urlToImage} alt="news" />
                <h5 className="published-date">
                  {article.publishedAt.substring(0, 10)}
                </h5>
                <span className="article-author">{article.source?article.source.name:null }</span>
                <button
                  title="Add to Bookmarks"
                  className="favorites"
                  onClick={() => addToBookmark(article.url, article.title)}
                >
                  <box-icon
                    name="bookmark-plus"
                    animation="tada"
                    color="#f71007"
                    alt="add to book mark"
                    style={{ backgroundColor:'transparent' }}
                  ></box-icon>
                </button>
                <p className="article-body">{article.description?article.description:article.title}</p>
              </div>
              <div
                className="reflection"
                style={{
                  background: `linear-gradient(to bottom, rgba(247, 237, 237, 0.95)40, transparent)`,
                  ...getStyles(i),
                }}
              />
            </React.Fragment>
          );
        })
      )}
      {loading ? null : (
        <div
          className="arrow-container"
          ref={arrowContainer}
          style={{ opacity: 0 }}
        >
          <box-icon
            name="chevrons-left"
            animation="tada"
            color="#1B65DD"
            onClick={prev}
            ref={leftArrow}
            style={{
              marginRight: "30px",
              borderRadius: "50%",
              backgroundColor: "rgba(252, 250, 250, 0.3)",
              cursor: "pointer",
              width: "3vh",
              height: "3vh",
              lineHeight: "3vh",
            }}
          ></box-icon>
          <select
            className="custom-select"
            style={{ padding: 0, fontSize: "2.5vh" }}
            onChange={handleSourceChange}
            value={newsSource}
          >
            <option value="bbc-news">BBC News</option>
            <option value="cnn">CNN</option>
            <option value="business-insider">Business Insider</option>
            <option value="the-washington-post">The Washington Post</option>
            <option value="techcrunch">TechCrunch</option>
          </select>
          <box-icon
            name="chevrons-right"
            animation="tada"
            color="#1B65DD"
            onClick={next}
            style={{
              marginLeft: "30px",
              borderRadius: "50%",
              backgroundColor: "rgba(252, 250, 250, 0.3)",
              cursor: "pointer",
              width: "3vh",
              height: "3vh",
              lineHeight: "3vh",
            }}
          ></box-icon>
        </div>
      )}
    </div>
  );
}
