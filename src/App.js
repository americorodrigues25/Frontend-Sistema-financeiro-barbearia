// Routes
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import NewService from "./pages/NewService";
import AdvancedSearch from "./pages/AdvancedSearch";

// components
import Nav from "./components/Nav";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Nav />}>
          <Route path="/home" element={<Home />} />
          <Route path="/novo-servico" element={<NewService />} />
          <Route path="/busca" element={<AdvancedSearch />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
