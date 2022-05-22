import React from "react";
import Bookmark from "./Bookmark";
import { useState } from "react";
import { Modal, notification } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import axios from "axios";

const userId = localStorage.getItem("userId");

// List all the bookmarks

const BookmarkList = (props) => {
  const [bmData, setBmData] = useState(props.inbm);

  const [newBookMark, setNewBookmark] = useState({
    tabTitle: props.inbm[0].tabTitle,
    bookmarkTitle: "",
    url: "",
    id: "",
  });

  const createBookmark = (n) => {
    //create a new bookmark with the value of newBookMark (newBookMark.id is '' now)
    axios
      .post("/api/bookmark/createBookmark", {
        tabName: n.tabTitle,
        urlName: n.bookmarkTitle,
        url: n.url,
        userId,
      })
      .then((res) => {
        //console.log(res.data)
        // get the new bookmark _id and set NewBookmark.id equal to _id
        n.id = res.data._id;
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "Error",
          description: "Error, can not connect to server",
          placement: "bottomRight",
        });
      });

    let oldArray = bmData;
    let newArray = [...oldArray, n];

    // Add new bookmark to bmData
    setBmData(newArray);
    setNewBookmark({
      tabTitle: props.inbm[0].tabTitle,
      bookmarkTitle: "",
      url: "",
      id: "",
    });
  };

  const handleRemove = (idRemoved, tabTitleRemoved, bookmarkTitleRemoved) => {
    //delete one bookmark by id

    const newArray = bmData.filter((bmData) => bmData.id !== idRemoved);

    setBmData(newArray);

    axios
      .post("/api/bookmark/deleteBookmark", { id: idRemoved })
      .then((res) => console.log(res.data))
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "Error",
          description: "Error, can not connect to server",
          placement: "bottomRight",
        });
      });

    //check if this bookmark is the last one under the tab, if yes,create a special blank bookmark to occupied a data to showing the tab
    axios
      .get(
        `/api/bookmark/isTheLastBookmark?tabName=${tabTitleRemoved}&bookmarkTitle=${bookmarkTitleRemoved}`
      )

      .then((res) => {
        console.log(res.data);

        if (res.data) {
          axios
            .post("/api/bookmark/createBookmark", {
              tabName: tabTitleRemoved,
              urlName: " ",
              url: " ",
              userId,
            })
            .then((res) => console.log(res.data))
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "Error",
          description: "Error, can not connect to server",
          placement: "bottomRight",
        });
      });
  };

  const openNotification2 = () => {
    notification.open({
      message: "Invalid URL",
      description: "Please enter a valid URL...",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };

  //Control add bookmark model, show & close, handleOk create a new bookmark
  const [visible, setVisible] = React.useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    if (newBookMark.url === "") {
      openNotification2();
    } else {
      createBookmark(newBookMark);
      setVisible(false);
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };

  return (
    <>
      <div className="myBookmark">
        <Bookmark newbm={bmData} onRemove={handleRemove} />

        <div className="AddButton" onClick={showModal}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/OOjs_UI_icon_add.svg/1024px-OOjs_UI_icon_add.svg.png" />
        </div>

        <Modal
          title="Add Bookmark"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div className="addBookmark">
            <form onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="bookmarkTitle" className="formLabel">
                  Bookmark Name
                </label>

                <input
                  value={newBookMark.bookmarkTitle}
                  onChange={(e) =>
                    setNewBookmark({
                      ...newBookMark,
                      bookmarkTitle: e.currentTarget.value,
                    })
                  }
                  type="text"
                  name="bookmarkTitle"
                  minLength="1"
                  maxLength="25"
                />
              </div>
              <div>
                <label htmlFor="url" className="formLabel">
                  URL
                </label>

                <input
                  value={newBookMark.url}
                  onChange={(e) =>
                    setNewBookmark({
                      ...newBookMark,
                      url: e.currentTarget.value,
                    })
                  }
                  type="text"
                  name="url"
                  minLength="6"
                />
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default BookmarkList;
