import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

// context
import { AuthContext } from "./context/AuthContext";

// pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import NewService from "./pages/NewService";
import AdvancedSearch from "./pages/AdvancedSearch";
import Settings from "./pages/Settings";

// components
import Nav from "./components/Nav";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn ? children : <Navigate to="/" />;
};

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/home" /> : <Login />}
        />

        <Route element={<Nav />}>
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/novo-servico"
            element={
              <PrivateRoute>
                <NewService />
              </PrivateRoute>
            }
          />
          <Route
            path="/busca"
            element={
              <PrivateRoute>
                <AdvancedSearch />
              </PrivateRoute>
            }
          />
          <Route
            path="/configuracoes"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
