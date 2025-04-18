import React, { useEffect, useState } from "react";

const FloatingSparkle: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        fontSize: "20px",
        opacity: 1,
        transition: "top 0.08s ease-out, left 0.08s ease-out",
        zIndex: 9999,
      }}
    >
      ✨
    </div>
  );
};

export default FloatingSparkle;
