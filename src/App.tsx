import React from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import TripPlanner from './components/trip/TripPlanner';
import './styles/global.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <Sidebar />
      <main className="content">
        <TripPlanner />
      </main>
    </div>
  );
}

export default App;
