import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreatePlacePage from "./pages/CreatePlacePage";
import PlacesPage from "./pages/PlacesPage";
import WeatherChartComponent from "./pages/WeatherChartComponent";

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
