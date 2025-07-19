import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state
import Register from './pages/Register';
import Footer from './components/Footer';
import Login from './pages/Login';
import Calendar from './components/Calender';
import Contact from './components/Contact';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Edit from './pages/Edit';
import Header from './components/Header';
import Home from './pages/Home';
import TrainingAndPlacementCell from './pages/TrainingAndPlacementCell';
import Adminp from './pages/Adminp';
import FilterUsers from './pages/FilterUsers';
import About from './components/About';


export default function App() {
  const currentUser = useSelector((state) => state.user.currentUser); // Retrieve currentUser from Redux store

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<TrainingAndPlacementCell />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/calender" element={<Calendar />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editprofile" element={<Edit />} />
        <Route path="/admin" element={<Adminp />} />
        <Route path="/about" element={<About />} />
        <Route path="/filter" element={<FilterUsers />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
