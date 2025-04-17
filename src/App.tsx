import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Galaxy from "./pages/Galaxy";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/galaxy" element={<Galaxy />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
