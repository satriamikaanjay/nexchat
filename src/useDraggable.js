import { useState, useRef } from 'react';

export const useDraggable = () => {
  const [position, setPosition] = useState({ x: 24, y: 96 }); // Default pojok kanan atas
  const dragging = useRef(false);

  const handleTouchMove = (e) => {
    if (dragging.current) {
      const touch = e.touches[0];
      setPosition({ x: window.innerWidth - touch.clientX - 55, y: touch.clientY - 80 });
    }
  };

  return { position, handleTouchMove, onMouseDown: () => dragging.current = true, onMouseUp: () => dragging.current = false };
};