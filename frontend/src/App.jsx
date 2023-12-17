import { useState } from 'react'
import Home from './Home.jsx'
import Display from './Display.jsx'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/display" element={<Display />} />
        {/* Add other routes here */}
    </Routes>
  )
}

export default App
