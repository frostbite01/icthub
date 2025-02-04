// src/home.js
import React from 'react';
import './home.css';
import BarChart from "./component/charts/Barcharts";

const Home = ({ isSidebarVisible }) => {
  return (
    <div className="home-container">
      <h1>ICT Hub beta</h1>
      <div className="chart-container">
      <BarChart isSidebarVisible={isSidebarVisible} />
</div>

      <p>
        ICT Centre beta
      </p>
      <div className="cta-section">
        <h2>Version 1.5</h2>
        <p>
          on progress. . . . . . 
        </p>
      </div>
    </div>
  );
}

export default Home;
