// RouteTransition.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";
import Sparkle from "../assets/sparkle.png";

const shimmer = keyframes`
  0% { background-position: -300% 0; }
  100% { background-position: 300% 0; }
`;

const RouteTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="route-transition"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        {/* Sparkle Pulse Background */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${Sparkle})`,
            backgroundRepeat: "repeat",
            backgroundSize: "80px",
            animation: `${shimmer} 8s linear infinite`,
            opacity: 0.07,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Flying Sparkle from Left */}
        <motion.div
          initial={{ x: -150, y: 0, rotate: -30, opacity: 0 }}
          animate={{ x: "100vw", opacity: 0.8 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "30%",
            width: "60px",
            height: "60px",
            background: `url(${Sparkle}) no-repeat center/contain`,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Flying Sparkle from Right */}
        <motion.div
          initial={{ x: "100vw", y: 0, rotate: 30, opacity: 0 }}
          animate={{ x: "-150px", opacity: 0.8 }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
          style={{
            position: "absolute",
            top: "60%",
            width: "60px",
            height: "60px",
            background: `url(${Sparkle}) no-repeat center/contain`,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Page Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 10,
            height: "100%",
            width: "100%",
          }}
        >
          {children}
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default RouteTransition;
