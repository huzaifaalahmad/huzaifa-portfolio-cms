import { useEffect, useState } from 'react';

export default function MouseGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY });
    }

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div
      className="mouse-glow"
      style={{
        left: pos.x,
        top: pos.y,
      }}
    />
  );
}