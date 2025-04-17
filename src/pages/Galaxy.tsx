import { useRef } from "react";
import { Box } from "@mui/material";
import GalaxyCanvas from "./GalaxyCanvas";

const Galaxy = () => {
  const fireworksRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "black",
        position: "relative",
        overflow: "hidden",
        width: "100vw",
      }}
    >
      <Box
        ref={fireworksRef}
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none", // ✨ lets clicks pass through
        }}
      />
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          background:
            "radial-gradient(ellipse at center, #1a002a 0%, #000000 100%)",
          backgroundImage: `
            linear-gradient(145deg, #0a0015, #180035, #000011),
            radial-gradient(circle at 20% 30%, rgba(200, 100, 200, 0.15), transparent),
            radial-gradient(circle at 80% 60%, rgba(0, 120, 255, 0.08), transparent)
          `,
          backgroundBlendMode: "screen",
        }}
      >
        <GalaxyCanvas />
      </Box>
    </Box>
  );
};

export default Galaxy;
