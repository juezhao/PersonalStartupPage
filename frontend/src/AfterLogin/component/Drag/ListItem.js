import { Draggable } from "react-beautiful-dnd";
import React from "react";
import styled from "styled-components";
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

const CardHeader = styled.div`
  font-weight: 500;
`;

const DragItem = styled.div`
  padding: 24px 10px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  background: #f5ff00;
  margin: 0 0 8px 0;
  display: grid;
  grid-gap: 20px;
  flex-direction: column;
  position: relative;
  color: #fff;
`;

const ListItem = ({ item, index, onDelete, onEdit }) => {
  return (
    <Draggable draggableId={item._id} index={index}>
      {(provided, snapshot) => {
        return (
          <DragItem
            ref={provided.innerRef}
            snapshot={snapshot}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className="operate">
              <Tooltip title="Edit">
                <Button
                  style={{ marginRight: 8 }}
                  onClick={() => onEdit(item._id, item.content)}
                  type="primary"
                  size="small"
                  shape="circle"
                  icon={<EditOutlined />}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  style={{ marginRight: 8 }}
                  onClick={() => onDelete(item._id)}
                  type="primary"
                  size="small"
                  shape="circle"
                  icon={<CloseOutlined />}
                />
              </Tooltip>
            </div>
            <div style={{ color: "#333" }}>
              <div className="desc">{item.content}</div>
            </div>
          </DragItem>
        );
      }}
    </Draggable>
  );
};

export default ListItem;
