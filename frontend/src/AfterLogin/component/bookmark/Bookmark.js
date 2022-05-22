import React from "react";

//Mapping Bookmark (one bookmark card include image, title, and remove button)
// The special blank bookmark will be hidden and occupied data for showing tab

const Bookmark = (props) => {
  const mapData = props.newbm.map((bm, i) => {
    if (bm.bookmarkTitle === " " && bm.url === " ") {
      return <div></div>;
    } else {
      return (
        <div key={i} className="bmList">
          <div
            className="bmholder"
            onClick={() =>
              bm.url.indexOf("http") !== -1 || bm.url.indexOf("https") !== -1
                ? window.open(bm.url, "_blank")
                : window.open(`//` + bm.url, "_blank")
            }
          >
            <div className="bmListImage">
              {" "}
              <img
                src={
                  "https://www.google.com/s2/favicons?sz=64&domain_url=" +
                  bm.url
                }
                alt={bm.bookmarkTitle}
                title={bm.bookmarkTitle}
              />
            </div>
            <div className="bmListName">
              <p>{bm.bookmarkTitle}</p>
            </div>
          </div>
          <button
            onClick={() => props.onRemove(bm.id, bm.tabTitle, bm.bookmarkTitle)}
            className="button-28"
            role="button"
          >
            <span className="label"></span>
          </button>
        </div>
      );
    }
  });

  return <>{mapData}</>;
};

export default Bookmark;
