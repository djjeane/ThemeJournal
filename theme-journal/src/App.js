import "./App.css";
import Header from "./components/Header/Header.jsx";
import { Route, Routes } from "react-router-dom";
import Landing from "./components/Landing/Landing.jsx";
import Journal from "./components/Journal/Journal.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

import About from "./components/About/About.jsx";
import React from "react";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Reset from "./components/Reset/Reset";

import Theme from "./components/Theme/Theme";
import Profile from "./components/Profile/Profile";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/about" element={<About />}></Route>

        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/reset" element={<Reset />}></Route>
        <Route path="/profile" element={<Profile />}></Route>

        <Route path="/theme" element={<Theme />}></Route>
        <Route path="/journal" element={<Journal />}></Route>
      </Routes>
    </>
  );
}

export default App;
