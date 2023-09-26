import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "./Hooks/useAuthContext";
import Navbar from "./Components/Navbar/index";
import Login from "./Pages/Login/index";
import Signup from "./Pages/Signup/index";
import Home from "./Pages/Home/index";
import "./App.css";
import MovieDetailsPage from "./Pages/Details";
import Search from "./Pages/Search/Search";
import Favourites from "./Pages/Favourites";
import React from "react";

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/search"
              element={user ? <Search /> : <Navigate to="/login" />}
            />
            <Route path="/detail/:id" element={<MovieDetailsPage />} />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
            <Route
              path="/favourites"
              element={user ? <Favourites /> : <Navigate to="/signup" />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
