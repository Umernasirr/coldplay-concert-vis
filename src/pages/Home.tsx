import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography, Stack } from "@mui/material";
import { Canvas } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";

// 🔮 Portal Component
const PortalTransition = () => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 50, opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1.3, ease: "easeInOut" }}
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      width: "160px",
      height: "160px",
      transform: "translate(-50%, -50%)",
      borderRadius: "50%",
      background: "radial-gradient(circle,rgb(67, 5, 115) 0%, #000000 80%)",
      zIndex: 9999,
      boxShadow:
        "0 0 60px 20pxrgba(255, 19, 255, 0.96), inset 0 0 40px rgba(191, 0, 255, 0.71)",
      pointerEvents: "none",
    }}
  />
);

// 🌈 Animations
const shimmer = keyframes`
  0% { background-position: -500% 0; }
  100% { background-position: 500% 0; }
`;

const glowPulse = keyframes`
  0%, 100% {
    text-shadow: 0 0 10px #fff, 0 0 20px #ff00cc, 0 0 30px #ff00cc;
  }
  50% {
    text-shadow: 0 0 20px #fff, 0 0 30px #00eaff, 0 0 40px #00eaff;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const [showPortal, setShowPortal] = useState(false);

  const handleEnter = () => {
    setShowPortal(true);
    setTimeout(() => {
      navigate("/galaxy");
    }, 1300); // Match duration of portal
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "black",
        background: `
          linear-gradient(135deg, #0a0015, #180035, #000011),
          radial-gradient(circle at 20% 30%, rgba(255, 183, 255, 0.15), transparent),
          radial-gradient(circle at 80% 60%, rgba(0, 204, 255, 0.08), transparent)
        `,
        backgroundBlendMode: "screen",
      }}
    >
      {/* ✨ Sparkle Stars in 3D */}
      {/* <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <Canvas camera={{ position: [0, 0, 10] }}>
          <ambientLight intensity={0.9} />
          <Sparkles
            count={900}
            scale={80}
            size={10}
            speed={1}
            color={"#ffffff"}
            opacity={0.9}
          />
          <Sparkles
            count={200}
            scale={80}
            size={80}
            speed={1}
            color={"#ff00cc"}
            opacity={0.7}
          />
          <Sparkles
            count={120}
            scale={80}
            size={50}
            speed={0.4}
            color={"#00eaff"}
            opacity={1}
          />
        </Canvas>
      </Box> */}

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none", // optional if you want it non-interactive
        }}
      >
        <Canvas
          style={{
            width: "100vw",
            height: "100vh",
          }}
          camera={{ position: [0, 0, 10] }}
        >
          <ambientLight intensity={0.9} />
          <Sparkles
            count={900}
            scale={100}
            size={10}
            speed={1}
            color={"#ffffff"}
            opacity={0.9}
          />
          <Sparkles
            count={200}
            scale={80}
            size={80}
            speed={1}
            color={"#ff00cc"}
            opacity={0.7}
          />
          <Sparkles
            count={120}
            scale={80}
            size={50}
            speed={0.4}
            color={"#00eaff"}
            opacity={1}
          />
        </Canvas>
      </Box>

      {/* 🌌 Portal Animation Overlay */}
      {showPortal && <PortalTransition />}

      {/* 🌟 Main Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          color: "white",
          px: 4,
        }}
      >
        <Stack
          flexDirection="row"
          gap={2}
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="h2"
            component={motion.h1}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            sx={{
              mb: 4,
              fontWeight: "bold",
              background: `linear-gradient(270deg, #ff00cc, #ffeb3b, #00eaff, #ff00cc)`,
              backgroundSize: "600% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: `${shimmer} 15s linear infinite`,
              fontFamily: "Delius, 'cursive'",
              fontSize: { xs: "2rem", md: "3.5rem" },
              lineHeight: 1.2,
              animationDelay: "0s",
              animationTimingFunction: "ease-in-out",
              animationDirection: "alternate",
              textShadow: "0 0 20px rgba(255,255,255,0.3)",
            }}
          >
            Welcome to the Coldplay HYPE
          </Typography>
          <Typography
            variant="h2"
            sx={{ mb: 3, ml: 4, animation: `${glowPulse} 2s infinite` }}
          >
            🌌
          </Typography>
        </Stack>

        <Button
          variant="contained"
          size="large"
          onClick={handleEnter}
          component={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          sx={{
            background: "linear-gradient(90deg, #ffeb3b, #ff00cc)",
            color: "#000",
            fontWeight: "bold",
            px: 6,
            py: 2,
            mt: 2,
            fontSize: "1.3rem",
            borderRadius: "16px",
            boxShadow: "0 0 25px #ffeb3b99, 0 0 35px #ff00cc66",
            textShadow: "0 1px 2px #fff",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              background: "linear-gradient(90deg, #fff176, #ff80ab)",
              boxShadow: "0 0 35px #fff176aa, 0 0 45px #ff80ab88",
            },
          }}
        >
          ARE YOU READY TO ENTER?
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
