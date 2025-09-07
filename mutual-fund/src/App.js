import React from "react"; 
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
// ----------------------------- added Navigate ^^^^^^^^^^^^^^^

import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Portfolio from "./components/Portfolio/Portfolio";
import NewInvestment from "./components/Investments/Investments";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route → redirect to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/investments/new" element={<NewInvestment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
