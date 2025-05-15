import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PlacesPage from "./pages/PlacesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PlacesPage />} />
        <Route path="/places" element={<PlacesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
