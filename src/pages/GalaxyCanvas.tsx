/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Stars as DreiStars, Sparkles, useCursor } from "@react-three/drei";
import { TextureLoader, Vector3, AdditiveBlending, Sprite } from "three";
import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import confetti from "canvas-confetti";
import { Fireworks } from "fireworks-js";
import song from "../assets/song.mp3";

import Star from "../assets/star.png";
import Sun from "../assets/sun.png";
import P1 from "../assets/p1.png";
import P2 from "../assets/p2.png";
import P3 from "../assets/p3.png";
import P4 from "../assets/p4.png";
import P5 from "../assets/p5.png";
import P6 from "../assets/p6.png";
import P7 from "../assets/p7.png";
import P8 from "../assets/p8.png";

const PulsingSprite: React.FC<{
  position: Vector3;
  textureUrl: string;
  isClickable?: boolean;
  onClick?: () => void;
  isStar?: boolean;
}> = ({
  position,
  textureUrl,
  isClickable = false,
  onClick,
  isStar = false,
}) => {
  const ref = useRef<Sprite>(null);
  const texture = useLoader(TextureLoader, textureUrl);
  const pulse = useRef(0);
  useCursor(isClickable);

  useFrame((state, delta) => {
    if (!ref.current) return;
    pulse.current += delta;

    const baseScale = isStar ? 1.5 : 1.2;
    const scale = isStar
      ? baseScale + 0.4 * Math.sin(pulse.current * 3)
      : baseScale;

    ref.current.scale.set(scale, scale, scale);

    if (ref.current.material && isStar) {
      ref.current.material.color.setStyle(
        `hsl(${Math.sin(pulse.current * 2) * 50 + 50}, 100%, 75%)`
      );
    }

    if (!isStar) {
      const t = state.clock.getElapsedTime();
      ref.current.position.y = position.y + Math.sin(t + position.x) * 0.1;
      ref.current.rotation.z += 0.001;
    }
  });

  return (
    <sprite
      ref={ref}
      position={position}
      onPointerDown={isClickable ? onClick : undefined}
      frustumCulled={false}
    >
      <spriteMaterial
        attach="material"
        map={texture}
        blending={AdditiveBlending}
        transparent
      />
    </sprite>
  );
};

const RotatingGalaxy: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const groupRef = useRef<any>(null);
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.005;
      groupRef.current.rotation.x += delta * 0.002;
    }
  });
  return <group ref={groupRef}>{children}</group>;
};

const GalaxyExperience = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [showMessage, setShowMessage] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(new Audio(song));
  const audio = audioRef.current;
  audio.volume = 0.2;

  const fireworksContainerRef = useRef<HTMLDivElement>(null);
  const fireworksInstanceRef = useRef<Fireworks | null>(null);
  const intervalRef = useRef<any | null>(null);

  const tryPlayAudio = () => {
    audio.play().catch((e) => console.warn("Autoplay failed", e));
    document.removeEventListener("click", tryPlayAudio);
    document.removeEventListener("touchstart", tryPlayAudio);
    document.removeEventListener("keydown", tryPlayAudio);
  };

  const handleSaturnClick = () => setStep(2);

  const handleStarClick = () => {
    if (fireworksContainerRef.current && !fireworksInstanceRef.current) {
      fireworksInstanceRef.current = new Fireworks(
        fireworksContainerRef.current,
        {
          hue: { min: 0, max: 360 },
          delay: { min: 15, max: 30 },
          acceleration: 1.05,
          friction: 0.95,
          gravity: 1.5,
          particles: 100,
          explosion: 5,
          autoresize: true,
        }
      );
      fireworksInstanceRef.current.start();
    }

    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, 2000);
    }

    setShowMessage(true);
  };

  useEffect(() => {
    return () => {
      if (fireworksInstanceRef.current) fireworksInstanceRef.current.stop();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const planetData = [
    { name: "Sun", url: Sun, pos: new Vector3(-10, 5, -12) },
    { name: "Mercury", url: P1, pos: new Vector3(-7, -2, -9) },
    { name: "Venus", url: P2, pos: new Vector3(-4, 4, -8) },
    { name: "Earth", url: P3, pos: new Vector3(0, -5, -10) },
    { name: "Mars", url: P4, pos: new Vector3(4, 2, -9) },
    { name: "Saturn", url: P5, pos: new Vector3(9, -3, -8), clickable: true },
    { name: "Jupiter", url: P6, pos: new Vector3(6, 6, -10), clickable: true },
    { name: "Uranus", url: P7, pos: new Vector3(-9, -5, -10), clickable: true },
    { name: "Neptune", url: P8, pos: new Vector3(10, 4, -9), clickable: true },
    { name: "Pluto", url: P3, pos: new Vector3(3, -7, -8), clickable: true },
  ];

  const starPositions = [
    new Vector3(5, 8, -10),
    new Vector3(0, -6, -7),
    new Vector3(10, 5, -8),
    new Vector3(12, -8, -5),
    new Vector3(-7, -7, -6),
    new Vector3(-10, 8, -7),
    new Vector3(8, -10, -7),
    new Vector3(-12, 6, -10),
    new Vector3(4, 10, -6),
    new Vector3(-5, 4, -7),
    new Vector3(-8, 10, -5),
  ];

  return (
    <Box sx={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Box
        ref={fireworksContainerRef}
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 0.3 }}
      >
        <Typography
          variant="h3"
          sx={{
            position: "absolute",
            top: 40,
            width: "100%",
            textAlign: "center",
            fontSize: "2.8rem",
            fontWeight: "bold",
            color: "white",
            background: "linear-gradient(90deg, #ff66cc, #66ffff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "Delius, cursive",
            pointerEvents: "none",
            zIndex: 3,
          }}
        >
          You're a sky full of stars
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 0.8 }}
      >
        <Typography
          variant="h3"
          sx={{
            position: "absolute",
            top: 100,
            width: "100%",
            textAlign: "center",
            fontSize: "2.8rem",
            fontWeight: "bold",
            color: "white",
            background: "linear-gradient(90deg, #ff66cc, #66ffff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "Delius, cursive",
            pointerEvents: "none",
            zIndex: 3,
          }}
        >
          Such a heavenly view
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 150,
            width: "100%",
            textAlign: "center",
            zIndex: 3,
          }}
        >
          <button
            onClick={tryPlayAudio}
            style={{
              fontSize: "1.6rem",
              fontWeight: "bold",
              background: "linear-gradient(90deg, #ff00cc, #00eaff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              textShadow: "0 0 10px rgba(255,255,255,0.3)",
              fontFamily: "Delius, cursive",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              boxShadow: "0 0 10px rgba(255,255,255,0.2)",
            }}
          >
            ▶️ Play Coldplay Vibes
          </button>
        </Box>
      </motion.div>

      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <RotatingGalaxy>
          <Sparkles
            count={1000}
            speed={1.5}
            opacity={0.85}
            scale={100}
            size={12}
            color="#ffeeee"
          />
          <Sparkles
            count={200}
            speed={1}
            opacity={0.4}
            scale={90}
            size={40}
            color="#ff007f"
          />
          <Sparkles
            count={100}
            speed={0.8}
            opacity={0.3}
            scale={120}
            size={30}
            color="#00ffff"
          />
          <Sparkles
            count={50}
            speed={0.6}
            opacity={0.9}
            scale={110}
            size={80}
            color="#ffff99"
          />
          <DreiStars
            radius={300}
            depth={200}
            count={4000}
            factor={10}
            fade
            saturation={0.5}
          />

          {step === 1 &&
            planetData.map((planet, index) => (
              <PulsingSprite
                key={index}
                position={planet.pos}
                textureUrl={planet.url}
                isClickable={planet.clickable}
                onClick={planet.clickable ? handleSaturnClick : undefined}
                isStar={false}
              />
            ))}

          {step === 2 &&
            starPositions.map((pos, index) => (
              <PulsingSprite
                key={index}
                position={pos}
                textureUrl={Star}
                isClickable={index === 3}
                onClick={index === 3 ? handleStarClick : undefined}
                isStar={true}
              />
            ))}
        </RotatingGalaxy>
      </Canvas>

      {showMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          style={{
            position: "absolute",
            bottom: "40%",
            width: "100%",
            textAlign: "center",
            fontSize: "3rem",
            fontWeight: "bold",
            color: "#fff",
            textShadow: "0 0 20px #fff",
            fontFamily: "Pacifico, cursive",
            zIndex: 10,
          }}
        >
          Have fun at the concert ✨🎶
        </motion.div>
      )}
    </Box>
  );
};

export default GalaxyExperience;
