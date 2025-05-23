/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Stars as DreiStars, Sparkles, useCursor } from "@react-three/drei";
import { TextureLoader, Vector3, AdditiveBlending, Sprite, Color } from "three";
import { motion } from "framer-motion-3d";
import { keyframes } from "@emotion/react";
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
import P9 from "../assets/p9.png";
import toast from "react-hot-toast";

import confettiMP3 from "../assets/confetti.mp3"; // Adjust the path if needed
const confettiSound = new Audio(confettiMP3);
confettiSound.volume = 0.4;

import crowdMP3 from "../assets/crowd.mp3"; // Adjust the path if needed
const crowdSound = new Audio(crowdMP3);
crowdSound.volume = 0.2;
crowdSound.loop = true;

import fireworks from "../assets/fireworks.mp3"; // Adjust the path if needed
const fireworksSound = new Audio(fireworks);
fireworksSound.volume = 0.2;
fireworksSound.loop = true;

const shimmer = keyframes`
  0% { background-position: -500% 0; }
  100% { background-position: 500% 0; }
`;

const scalar = 2;
const cat1 = confetti.shapeFromText({ text: "😺", scalar });
const cat2 = confetti.shapeFromText({ text: "😼", scalar });

// 🌟 Enhanced Pulsing Sprite
const PulsingSprite: React.FC<{
  position: Vector3;
  textureUrl: string;
  isClickable?: boolean;
  onClick?: () => void;
  shouldPulse?: boolean;
  scaleMultiplier?: number;
}> = ({
  position,
  textureUrl,
  isClickable = false,
  onClick,
  shouldPulse = false,
  scaleMultiplier = 1,
}) => {
  const ref = useRef<Sprite>(null);
  const texture = useLoader(TextureLoader, textureUrl);
  const pulse = useRef(0);

  useCursor(isClickable);

  useFrame((state, delta) => {
    if (!ref.current) return;
    pulse.current += delta;

    const t = state.clock.getElapsedTime();
    const baseScale = 1.5 * scaleMultiplier;
    const scale = shouldPulse
      ? baseScale + 0.1 * Math.sin(pulse.current * 3)
      : baseScale;

    ref.current.scale.set(scale, scale, scale);

    if (shouldPulse && ref.current.material) {
      ref.current.material.color.setStyle(
        `hsl(${Math.sin(pulse.current * 1) * 50 + 50}, 100%, 75%)`
      );
    } else if (ref.current.material) {
      ref.current.material.color = new Color(1, 1, 1); // white
    }

    // Float + rotation = fake 3D feel
    ref.current.rotation.z += 4;
    ref.current.position.y = position.y + Math.sin(t + position.x) * 0.2;
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
      groupRef.current.rotation.y += delta * 0.0;
      groupRef.current.rotation.x += delta * 0.0005;
    }
  });
  return <group ref={groupRef}>{children}</group>;
};

const GalaxyExperience = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [showMessage, setShowMessage] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(new Audio(song));
  const audio = audioRef.current;
  audio.volume = 0.4;

  const fireworksContainerRef = useRef<HTMLDivElement>(null);
  const fireworksInstanceRef = useRef<Fireworks | null>(null);
  const intervalRef = useRef<any | null>(null);

  const tryPlayAudio = () => {
    audio.play().catch((e) => console.warn("Autoplay failed", e));
    document.removeEventListener("click", tryPlayAudio);
    document.removeEventListener("touchstart", tryPlayAudio);
    document.removeEventListener("keydown", tryPlayAudio);
  };

  // const [visibleItems, setVisibleItems] = useState<number>(0);
  const [transitioning, setTransitioning] = useState(false);

  const handleSaturnClick = () => {
    setTransitioning(true);
    setTimeout(() => {
      setStep(2);
      // setVisibleItems(0); // reset for stars
      setTransitioning(false);
    }, 800); // wait for fade-out
  };

  // useEffect(() => {
  //   if (transitioning) return;

  //   let count = 0;
  //   const max = step === 1 ? planetData.length : starPositions.length;

  //   const interval = setInterval(() => {
  //     count++;
  //     setVisibleItems((prev) => Math.min(prev + 1, max));
  //     if (count >= max) clearInterval(interval);
  //   }, 200);

  //   return () => clearInterval(interval);
  // }, [step, transitioning]);

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

    fireworksSound.play().catch(() => {});
    crowdSound.play().catch(() => {});

    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        confettiSound.currentTime = 0; // rewind to start in case it's still playing
        confettiSound.play().catch(() => {});
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        const defaults = {
          spread: 360,
          ticks: 90,
          gravity: 0,
          decay: 0.96,
          startVelocity: 20,
          shapes: [cat1, cat2],
          scalar,
        };

        confetti({
          ...defaults,
          particleCount: 30,
        });

        confetti({
          ...defaults,
          particleCount: 20,
          flat: true,
        });

        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.2 },
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
    { name: "Sun", url: Sun, pos: new Vector3(-8, 5, 1) },
    { name: "Mercury", url: P1, pos: new Vector3(-14, -1, -9) },
    { name: "Venus", url: P2, pos: new Vector3(1, -8, -2) },
    { name: "Earth", url: P5, pos: new Vector3(10, -5, -3) },
    { name: "Mars", url: P4, pos: new Vector3(20, 2, -9) },
    { name: "Saturn", url: P3, pos: new Vector3(2, -3, -5), clickable: true },
    { name: "Jupiter", url: P6, pos: new Vector3(12, 6, -10) },
    { name: "Uranus", url: P7, pos: new Vector3(-9, -2, -10) },
    { name: "Neptune", url: P8, pos: new Vector3(12, 4, 1) },
    { name: "Planert", url: P9, pos: new Vector3(1, 4, -4) },
  ];

  const starPositions = [
    new Vector3(5, 8, -10),
    new Vector3(0, -6, -4),
    new Vector3(3, 2, -8),
    new Vector3(9, -3, -5),
    new Vector3(-7, -7, -6),
    new Vector3(-10, 8, -7),
    new Vector3(8, -10, -7),
    new Vector3(-12, 6, -10),
    new Vector3(13, 8, -6),
    new Vector3(-5, 4, -7),
    new Vector3(-8, 10, -5),
  ];

  useEffect(() => {
    const cleanup = () => {
      if (fireworksInstanceRef.current) {
        fireworksInstanceRef.current.stop();
        fireworksInstanceRef.current = null;
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      audio.pause();
      audio.currentTime = 0;

      document.removeEventListener("click", tryPlayAudio);
      document.removeEventListener("touchstart", tryPlayAudio);
      document.removeEventListener("keydown", tryPlayAudio);
    };

    // In case user leaves / refreshes the tab
    window.addEventListener("beforeunload", cleanup);

    return () => {
      cleanup();
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);

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
            // background: "linear-gradient(90deg, #ff66cc, #66ffff)",
            background: `linear-gradient(270deg, #ff00cc, #ffeb3b, #00eaff, #ff00cc)`,
            backgroundSize: "600% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: `${shimmer} 15s linear infinite`,

            // WebkitBackgroundClip: "text",
            // WebkitTextFillColor: "transparent",
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
            top: 120,
            width: "100%",
            textAlign: "center",
            fontSize: "2rem",
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
          Such a heavenly view ✨
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
            top: 180,
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
            ▶ Play Coldplay Vibes
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
            speed={1.5}
            opacity={0.4}
            scale={90}
            size={80}
            color="#ff007f"
          />
          <Sparkles
            count={100}
            speed={0.8}
            opacity={0.3}
            scale={100}
            size={30}
            color="#00ffff"
          />
          <Sparkles
            count={50}
            speed={0.6}
            opacity={0.9}
            scale={90}
            size={80}
            color="#ffff99"
          />
          <DreiStars
            radius={10}
            depth={100}
            count={400}
            factor={10}
            fade
            saturation={0.5}
          />

          {step === 1 && (
            <motion.group
              initial={{ opacity: 1 }}
              animate={{ opacity: transitioning ? 0 : 1 }}
              transition={{ duration: 0.8 }}
            >
              {planetData.map((planet, index) => (
                <motion.group
                  key={index}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1.1 }}
                  transition={{
                    delay: index * 0.2,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                >
                  <PulsingSprite
                    position={planet.pos}
                    textureUrl={planet.url}
                    isClickable={planet.clickable}
                    onClick={
                      planet.clickable
                        ? handleSaturnClick
                        : () => toast.error("ruh oh, wrong star")
                    }
                    shouldPulse={planet.name === "Saturn"}
                    scaleMultiplier={planet.name === "Saturn" ? 1.1 : 1.3}
                  />
                </motion.group>
              ))}
            </motion.group>
          )}

          {step === 2 && (
            <motion.group
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {starPositions.map((pos, index) => (
                <motion.group
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1.5 }}
                  transition={{
                    delay: index * 0.2,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                >
                  <PulsingSprite
                    position={pos}
                    textureUrl={Star}
                    isClickable={true}
                    onClick={
                      index === 3
                        ? handleStarClick
                        : () =>
                            toast.error("ruh oh, wrong star 🌠", { icon: "❌" })
                    }
                    shouldPulse={index === 3}
                    scaleMultiplier={index === 3 ? 1 : 0.8}
                  />
                </motion.group>
              ))}
            </motion.group>
          )}
        </RotatingGalaxy>
      </Canvas>

      {showMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          style={{
            position: "absolute",
            bottom: "45%",
            width: "100%",
            textAlign: "center",
            fontSize: "4rem",
            fontWeight: "bold",
            color: "#fff",
            textShadow: "0 0 10px #fff",
            fontFamily: "Pacifico, cursive",
            zIndex: 10,
          }}
        >
          Have an amazing concert! ✨🎶
        </motion.div>
      )}

      <Typography
        variant="body1"
        sx={{
          position: "absolute",
          bottom: 20,
          right: 20,
          fontSize: "1.2rem",
          fontFamily: "Delius, cursive",
          background: "linear-gradient(90deg, #ffd6ff, #caffbf, #9bf6ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
          animation: `${shimmer} 10s linear infinite`,
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        ✨ Find your guiding light
      </Typography>
    </Box>
  );
};

export default GalaxyExperience;
