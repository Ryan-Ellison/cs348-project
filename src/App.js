import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import logo from './logo.svg';
import StoreData from "./components/StoreData.js"
import DisplayData from './components/DisplayData';
import Home from './components/Home';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          This is Ryan Ellison's (PUID:32488792) react hosted website.
        </p>
        <Router>    
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/displaydata" element={<DisplayData />} />
          </Routes>  
        </Router>
      </header>
    </div>
  );
}

export default App;
