import React from "react";
import { Tabs, Modal, Input, notification } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import "../.././less/bookmark.less";
import BookmarkList from "./bookmarkList";
import axios from "axios";
import { customAlphabet } from "nanoid";
import { RotatingLines } from "react-loader-spinner";

//initial bookmarks value for new user
const initialbm1 = [
  {
    tabTitle: "Social media",
    bookmarkTitle: "Google",
    url: "www.google.com",
  },

  {
    tabTitle: "Social media",
    bookmarkTitle: "Youtube",
    url: "www.youtube.com/",
  },

  {
    tabTitle: "Social media",
    bookmarkTitle: "Facebook",
    url: "www.facebook.com",
  },

  {
    tabTitle: "Social media",
    bookmarkTitle: "Twitter",
    url: "twitter.com",
  },

  {
    tabTitle: "Social media",
    bookmarkTitle: "TikTok",
    url: "www.tiktok.com",
  },

  {
    tabTitle: "Social media",
    bookmarkTitle: "Instagram",
    url: "www.instagram.com",
  },
];
const initialbm2 = [
  {
    tabTitle: "Shopping",
    bookmarkTitle: "ASOS",
    url: "www.asos.com/",
  },

  { tabTitle: "Shopping", bookmarkTitle: "Zara", url: "www.zara.com/" },

  { tabTitle: "Shopping", bookmarkTitle: "H&M", url: "www.hm.com/" },

  { tabTitle: "Shopping", bookmarkTitle: "Nike", url: "www.nike.com/" },
  { tabTitle: "Shopping", bookmarkTitle: "Adidas", url: "www.adidas.co.nz/" },
  { tabTitle: "Shopping", bookmarkTitle: "Puma", url: "nz.puma.com/" },
];

const initialbm3 = [
  { tabTitle: "News", bookmarkTitle: "Stuff", url: "www.stuff.co.nz/" },

  {
    tabTitle: "News",
    bookmarkTitle: "NZ Herald",
    url: "www.nzherald.co.nz/",
  },

  { tabTitle: "News", bookmarkTitle: "RNZ", url: "www.rnz.co.nz/" },

  { tabTitle: "News", bookmarkTitle: "1News", url: "www.1news.co.nz/" },
];

const { TabPane } = Tabs;

//initialPanes for new user
const initialPanes = [
  {
    title: initialbm1[0].tabTitle,
    content: <BookmarkList inbm={initialbm1} />,
    key: "1",
  },
  {
    title: initialbm2[0].tabTitle,
    content: <BookmarkList inbm={initialbm2} />,
    key: "2",
  },
  {
    title: initialbm3[0].tabTitle,
    content: <BookmarkList inbm={initialbm3} />,
    key: "3",
  },
];

//Groupby the bookmarks array get from database by tabtitle
const groupBy = (array, f) => {
  const groups = {};
  array.forEach(function (o) {
    const group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return Object.keys(groups).map(function (group) {
    return groups[group];
  });
};

const arrayGroupBy = (list, groupId) => {
  const sorted = groupBy(list, function (item) {
    return [item[groupId]];
  });
  return sorted;
};

// After Groupby, transfer bookmarks array to bookmarkPanes array
const getbmPanes = (mergeList) => {
  let bm2 = [];
  let bmPanes2 = [];

  mergeList.forEach((listPanes, i) => {
    listPanes.forEach((list) => {
      bm2.push({
        tabTitle: list.tabTitle,
        bookmarkTitle: list.bookmarkTitle,
        url: list.url,
        id: list._id,
      });
    });

    bmPanes2.push({
      title: bm2[0].tabTitle,
      content: <BookmarkList inbm={bm2} />,
      key: i.toString(),
    });

    bm2 = [];
  });

  return bmPanes2;
};

const userId = localStorage.getItem("userId");

class BookmarkComponent extends React.Component {
  newTabIndex = 0;

  state = {
    activeKey: "",
    panes: [],
    isModalVisible: false,
    inputValue: "",
    isLoading: false,
    error: false,
  };

  componentDidMount() {
    // get the bookmark data from db (handle the bookmark data)
    this.setState({ ...this.state, isLoading: true });
    axios
      .get(`/api/bookmark/getBookmark?userId=${userId}`)

      .then((res) => {
        // console.log(res.data);

        if (res.data.length > 0) {
          const myBookmarks = res.data;

          const mergeList = arrayGroupBy(myBookmarks, "tabTitle");

          const bmPanes = getbmPanes(mergeList);

          this.setState({
            activeKey: bmPanes[0].key,
            panes: bmPanes,
            isModalVisible: false,
            isLoading: false,
            error: false,
          });
        } else {
          // if new user, import the initial data
          this.setState({
            activeKey: initialPanes[0].key,
            panes: initialPanes,
            isModalVisible: false,
            isLoading: false,
            error: false,
          });

          initialbm1.forEach((bm1) => {
            axios
              .post("/api/bookmark/createBookmark", {
                tabName: bm1.tabTitle,
                urlName: bm1.bookmarkTitle,
                url: bm1.url,
                userId,
              })
              .then((res) => console.log("success"))
              .catch((error) => console.log(error));
          });
          initialbm2.forEach((bm2) => {
            axios
              .post("/api/bookmark/createBookmark", {
                tabName: bm2.tabTitle,
                urlName: bm2.bookmarkTitle,
                url: bm2.url,
                userId,
              })
              .then((res) => console.log("success"))
              .catch((error) => console.log(error));
          });
          initialbm3.forEach((bm3) => {
            axios
              .post("/api/bookmark/createBookmark", {
                tabName: bm3.tabTitle,
                urlName: bm3.bookmarkTitle,
                url: bm3.url,
                userId,
              })
              .then((res) => console.log("success"))
              .catch((error) => console.log(error));
          });
        }
      })
      .catch(function (error) {
        console.log(error);
        this.setState({ ...this.state, isLoading: false, error: true });
        notification.error({
          message: "Error",
          description: "Error, can not connect to server",
          placement: "bottomRight",
        });
      });
  }

  //Double click the Active Tab, Change tab Name, Show Modal

  showModal = () => {
    this.setState({
      isModalVisible: true,
    });
  };

  handleOk = () => {
    this.setState({
      isModalVisible: false,
      inputValue: "",
    });

    axios
      .get(`/api/bookmark/getBookmark?userId=${userId}`)

      .then((res) => {
        if (res.data.length > 0) {
          const myBookmarks = res.data;
          const mergeList = arrayGroupBy(myBookmarks, "tabTitle");
          const bmPanes = getbmPanes(mergeList);

          this.setState({
            ...this.state,
            activeKey: bmPanes[0].key,
            panes: bmPanes,
            isModalVisible: false,
            isLoading: false,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
        this.setState({ ...this.state, isLoading: false, error: true });
        notification.error({
          message: "Error",
          description: "Error, can not connect to server",
          placement: "bottomRight",
        });
      });
  };

  handleCancel = () => {
    this.setState({
      ...this.state,
      isModalVisible: false,
    });
  };

  // Control the Tab, Add, Remove
  onChange = (activeKey) => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    const { panes } = this.state;
    const activeKey = `newTab${this.newTabIndex++}`;
    const newPanes = [...panes];

    //const uniqueName =`NewTab${Date.now()+Math.random()}`;

    //random a unique number for new bookmark tabtitle
    const nanoid = customAlphabet("ABCDEF1234567890", 4);

    const uniqueID = nanoid();
    const uniqueName = `NewTab${uniqueID}`;

    const userId = localStorage.getItem("userId");

    // Default Setting: Add a new tab with a google bookmark under it
    axios
      .post("/api/bookmark/createBookmark", {
        tabName: uniqueName,
        urlName: "Google",
        url: "www.google.com",
        userId,
      })
      .then((res) => {
        // console.log(res.data)
        const newId = res.data._id;
        newPanes.push({
          title: uniqueName,
          content: (
            <BookmarkList
              inbm={[
                {
                  tabTitle: uniqueName,
                  bookmarkTitle: "Google",
                  url: "www.google.com",
                  id: newId,
                },
              ]}
            />
          ),
          key: activeKey,
        });
        this.setState({
          panes: newPanes,
          activeKey,
        });
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

  remove = (targetKey) => {
    const { panes, activeKey } = this.state;
    let newActiveKey = activeKey;
    let lastIndex;
    let targetTabTitle;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
        targetTabTitle = pane.title;
      }
    });
    const newPanes = panes.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    this.setState({
      panes: newPanes,
      activeKey: newActiveKey,
    });

    //removed the target Tab, delete all the bookmarks with target tabTitle
    axios
      .post("/api/bookmark/deleteBookmarksByTabName", {
        tabName: targetTabTitle,
      })
      .then((res) => console.log(res.data))
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "Error",
          description: "Error, can not connect to server",
          placement: "bottomRight",
        });
      });
  };

  //Doubleclick: Show modal, Edit the tab Name, tabTitle need to be unique, update all the bookmarks with old tabTitle to the new tabTitle
  setTabName = (event) => {
    const { panes, activeKey } = this.state;
    let isRepeat = false;
    let oldTabTitle;

    const openNotification = () => {
      notification.open({
        message: "Duplicate Tab Name",
        description: "Please enter a unique tab name...",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });
    };

    panes.forEach((pane) => {
      if (event.target.value === pane.title) {
        isRepeat = true;
        openNotification();
      }
    });
    const newPanes = [...panes];
    newPanes.forEach((pane) => {
      if (pane.key === activeKey && !isRepeat) {
        oldTabTitle = pane.title;
        pane.title = event.target.value;
      }
    });
    this.setState({
      panes: newPanes,
      inputValue: event.target.value,
    });

    axios
      .post("/api/bookmark/updateBookmarksTabName", {
        oldTabName: oldTabTitle,
        newTabName: event.target.value,
      })
      .then((res) => console.log(res.data))
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "Error",
          description: "Error, can not connect to server",
          placement: "bottomRight",
        });
      });
  };

  render() {
    const { panes, activeKey, isModalVisible, inputValue, isLoading, error } =
      this.state;

    return (
      <div className="tabs">
        {isLoading ? <RotatingLines width="100" strokeColor="#FF5733" /> : null}
        {error ? <div>Error! Can not load the bookmarks</div> : null}
        <div className="card-container">
          <Tabs
            type="editable-card"
            size="large"
            onChange={this.onChange}
            activeKey={activeKey}
            onEdit={this.onEdit}
            centered
            animated
          >
            {panes.map((pane) => (
              <TabPane
                tab={<span onDoubleClick={this.showModal}>{pane.title}</span>}
                key={pane.key}
              >
                {pane.content}
              </TabPane>
            ))}
          </Tabs>

          <Modal
            title="Change Tab Title"
            visible={isModalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Input
              type="text"
              placeholder="Enter a unique tab name"
              value={inputValue}
              onChange={(event) => {
                this.setTabName(event);
              }}
            />
          </Modal>
        </div>
      </div>
    );
  }
}

export default BookmarkComponent;
