import { Droppable } from "react-beautiful-dnd";
import ListItem from "./ListItem";
import React from "react";
import styled from "styled-components";
import { Result } from "antd";
import { SmileOutlined } from "@ant-design/icons";

const ColumnHeader = styled.div`
  text-transform: uppercase;
  padding: 15px 0 20px 0;
  position: relative;
  color: #333;
  font-size: 24px;
`;

const DroppableStyles = styled.div`
  padding: 10px;
  border-radius: 6px;
`;
// background: #c9d5b5;

const DraggableElement = ({
  prefix,
  elements,
  showModal,
  onDelete,
  onEdit,
}) => (
  <DroppableStyles>
    <ColumnHeader>
      {prefix}
      <span className="btn-add" onClick={showModal}>
        Add
      </span>
    </ColumnHeader>
    <Droppable droppableId={`${prefix}`}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {elements.length ? (
            elements.map((item, index) => (
              <ListItem
                key={item._id}
                item={item}
                index={index}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))
          ) : (
            <Result icon={<SmileOutlined />} title="No note, add some now!" />
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DroppableStyles>
);

export default DraggableElement;
