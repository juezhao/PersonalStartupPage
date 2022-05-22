import React, { useState, useEffect} from "react";
import styled from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";
import DraggableElement from "./DraggableElement";
import { Modal, Input, notification } from "antd";
import "boxicons";
import axios from "axios";

const DragDropContextContainer = styled.div`
  padding: 20px;
  border-radius: 6px;
  width: 100%;
  height: 100%;
  margin-right: 24px;
`;

const ListGrid = styled.div`
  width: 100%;
`;

const removeFromList = (list, index) => {
  const result = Array.from(list);
  const [removed] = result.splice(index, 1);
  return [removed, result];
};

const addToList = (list, index, element) => {
  const result = Array.from(list);
  result.splice(index, 0, element);
  return result;
};

const lists = ["Notes"];

function DragList() {
  //Load NotesIcon Expand Icon or not
  const [showIcon, setShowIcon] = useState(true);
  //Title of the pop-up window
  const [title, setTitle] = useState("Add Notes");
  //Id of note
  const [index, setIndex] = useState();
  //Structure of notes
  const [elements, setElements] = useState({ Notes: [] });

  //Add edit notes pop-up control
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [value, setValue] = useState("");

  //Get all Notes
  const getAllNotes = () => {
    const userId = localStorage.getItem("userId");
    axios
      .get(`/api/note/getNotes?userId=${userId}`)
      .then(function (response) {
        if (response.data[0]) {
          let myNotes = response.data;
          let newNotes = [];
          let localNotes = JSON.parse(localStorage.getItem("notes"));
          if (localNotes && localNotes.Notes) {
            localNotes.Notes.forEach((item) => {
              const findNote = myNotes.find(
                (note) => note._id == item._id && note.user == item.user
              );
              if (findNote && findNote._id) {
                newNotes.push(findNote);
              }
            });
          } else {
            newNotes = myNotes;
          }
          const listCopy = { Notes: newNotes };
          setElements(listCopy);
        } else {
          setElements({ Notes: [] });
        }
      })
      .catch(function (error) {
        console.log(error);
        notification.error({
          message: "Error",
          description: "Error, can not connect to server",
          placement: "bottomRight",
        });
      });
  };

  //Get all Notes for the first time
  useEffect(() => {
    getAllNotes();
  }, []);

  //Modify the value of the input box
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  //Close pop-up window
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //Open pop-up window
  const showModal = () => {
    setTitle("Add Notes");
    setIsModalVisible(true);
    setValue("");
    setIndex("-1");
  };

  //Click on the pop-up window to confirm
  const handleOk = () => {
    if (!value) {
      notification.error({
        message: "Notification",
        description: "please input note",
        placement: "bottomRight",
      });
      return;
    }
    if (index != -1) {
      setIsModalVisible(false);
      axios
        .post("/api/note/updateNote", { id: index, note: value })
        .then(function (response) {
          getAllNotes();
        })
        .catch(function (error) {
          console.log(error);
          notification.error({
            message: "Error",
            description: "Error, can not connect to server",
            placement: "bottomRight",
          });
        });
      return;
    }
    const userId = localStorage.getItem("userId");
    axios
      .post("/api/note/createNote", { userId, note: value })
      .then(function (response) {
        let localNotes = JSON.parse(localStorage.getItem("notes"));
        if (localNotes && localNotes.Notes) {
          localNotes.Notes.unshift({
            content: value,
            createdAt: "",
            updatedAt: "",
            user: userId,
            __v: 0,
            _id: response.data.id,
          });
          localStorage.setItem("notes", JSON.stringify(localNotes));
        } else {
          const newNotes = [
            {
              content: value,
              createdAt: "",
              updatedAt: "",
              user: userId,
              __v: 0,
              _id: response.data.id,
            },
          ];
          localStorage.setItem("notes", JSON.stringify({ Notes: newNotes }));
        }
        getAllNotes();
        setIsModalVisible(false);
        setValue("");
      })
      .catch(function (error) {
        console.log(error);
        notification.error({
          message: "Error",
          description: "Error, can not connect to server",
          placement: "bottomRight",
        });
      });
  };

  //Click to edit
  const onEdit = (id, content) => {
    setTitle("Edit Notes");
    setIsModalVisible(true);
    setValue(content);
    setIndex(id);
  };

  //Click to delete
  const onDelete = (id) => {
    const userId = localStorage.getItem("userId");
    axios
      .post("/api/note/deleteNote", { userId, id })
      .then(function (response) {
        getAllNotes();
        notification.success({
          message: "Notification",
          description: "Delete success",
          duration: 1.5,
          placement: "bottomRight",
        });
      })
      .catch(function (error) {
        console.log(error);
        notification.error({
          message: "Error",
          description: "Error, can not connect to server",
          placement: "bottomRight",
        });
      });
  };

  //When dragging
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const listCopy = { ...elements };

    const sourceList = listCopy[result.source.droppableId];
    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.source.index
    );
    listCopy[result.source.droppableId] = newSourceList;
    const destinationList = listCopy[result.destination.droppableId];
    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination.index,
      removedElement
    );
    setElements(listCopy);
    localStorage.setItem("notes", JSON.stringify(listCopy));
  };

  //Expand notes
  const expand = (e) => {
    e.stopPropagation();
    setShowIcon(!showIcon);
  };

  //Hide notes
  const hidePannel = (e) => {
    e.stopPropagation();
    setShowIcon(true);
  };

  return (
    <>
      {showIcon ? (
        <div className="icon-wrap" onClick={expand}>
          <box-icon
            name="notepad"
            animation="tada-hover"
            color="#d2f63c"
          ></box-icon>
        </div>
      ) : (
        <div className="drag-list">
          <div onClick={(e) => hidePannel(e)} className="close">
            <box-icon
              name="x-circle"
              type="solid"
              animation="tada"
              color="#d2f63c"
              className="close-btn"
            ></box-icon>
          </div>
          <DragDropContextContainer>
            <DragDropContext onDragEnd={onDragEnd}>
              <ListGrid>
                {lists.map((listKey) => (
                  <DraggableElement
                    elements={elements[listKey]}
                    key={listKey}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    prefix={listKey}
                    showModal={showModal}
                  />
                ))}
              </ListGrid>
            </DragDropContext>
          </DragDropContextContainer>

          <Modal
            title={title}
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Input
              placeholder="please input note"
              value={value}
              onChange={handleChange}
            />
          </Modal>
        </div>
      )}
    </>
  );
}

export default DragList;
