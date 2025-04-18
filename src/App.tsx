import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Galaxy from "./pages/Galaxy";
import { AnimatePresence } from "framer-motion";

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/galaxy" element={<Galaxy />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
