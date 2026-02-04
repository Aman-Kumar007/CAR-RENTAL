import React from 'react'
import { Routes, Route } from 'react-router-dom';
//import Home from './pages/Home/Home';
import AddCar from './pages/AddCar/AddCar';
import ManageCar from './pages/ManageCar/ManageCar';
import Booking from './pages/Booking/Booking';

const App = () => {
  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<AddCar />} />
        <Route path="/manage-cars" element={<ManageCar />} />
        <Route path="/bookings" element={<Booking />} />
        {/* Add more routes as needed */}
      </Routes>
    </>
  )
}

export default App
