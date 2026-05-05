import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const hoverOn = () => setHover(true);
    const hoverOff = () => setHover(false);

    window.addEventListener('mousemove', move);

    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('mouseenter', hoverOn);
      el.addEventListener('mouseleave', hoverOff);
    });

    return () => {
      window.removeEventListener('mousemove', move);
    };
  }, []);

  return (
    <div
      className={`cursor ${hover ? 'cursor-hover' : ''}`}
      style={{
        left: pos.x,
        top: pos.y,
      }}
    />
  );
}