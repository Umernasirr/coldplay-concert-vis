import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Galaxy from "./pages/Galaxy";
import { AnimatePresence } from "framer-motion";
import AnimatedCursor from "react-animated-cursor";
import SparkleTrail from "./SparkleTrail"; // adjust path if needed

const AppRoutes = () => {
  const location = useLocation();

  return (
    <>
      {/* Sparkly cursor setup */}
      <AnimatedCursor
        innerSize={8}
        outerSize={30}
        color="255, 255, 255"
        outerAlpha={0.1}
        innerScale={1}
        outerScale={2}
        outerStyle={{
          boxShadow: "0 0 15px 6px rgba(255, 255, 255, 0.3)",
        }}
        innerStyle={{
          backgroundColor: "white",
          boxShadow: "0 0 8px 4px rgba(255, 255, 255, 0.8)",
        }}
      />
      <SparkleTrail />
      {/* <FloatingSparkle /> */}

      {/* Page transitions */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/galaxy" element={<Galaxy />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
