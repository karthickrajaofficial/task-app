import React from 'react';

const Draggable = ({ id, children, onDragStart }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, id)}
      className="draggable"
    >
      {children}
    </div>
  );
};

export default Draggable;
