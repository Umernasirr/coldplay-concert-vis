/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";

const galaxyColors = ["#ffffff", "#00ffff", "#ffccff", "#99ccff", "#ffc0cb"];

const SparkleTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const particles: any[] = [];

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const mouse = { x: width / 2, y: height / 2 };
    let throttle = 0;

    document.addEventListener("mousemove", (e) => {
      throttle++;
      if (throttle % 6 !== 0) return; // even fewer particles

      mouse.x = e.clientX;
      mouse.y = e.clientY;

      particles.push({
        x: mouse.x + (Math.random() - 0.5) * 4,
        y: mouse.y + (Math.random() - 0.5) * 4,
        radius: Math.random() * 1.5 + 0.5,
        alpha: 0.15 + Math.random() * 0.1,
        color: galaxyColors[Math.floor(Math.random() * galaxyColors.length)],
        vy: Math.random() * -0.1 - 0.05,
        life: 1,
      });
    });

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        p.y += p.vy;
        p.alpha -= 0.003;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      });
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
};

export default SparkleTrail;
