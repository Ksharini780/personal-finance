import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Pages/Home/Home';
import SetAvatar from './Pages/Avatar/setAvatar';

const App = () => {
  return (
    <div className="App" style={{ backgroundColor: 'grey' }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />  {/* ✅ Redirect '/' to dashboard */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/setAvatar" element={<SetAvatar />} />
          <Route path="/dashboard" element={<Home />} />  {/* ✅ Dashboard route */}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
