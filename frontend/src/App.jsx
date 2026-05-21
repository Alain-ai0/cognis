import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// import all my page components down the main control route block.
import Dashboard from './pages/Dashboard';
import Activity from './pages/Activity';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Courses from './pages/Courses';
import Videos from './pages/Videos';
import Analytics from './pages/Analytics';
import Wallet from './pages/Wallet';
import Markets from './pages/Markets';
import Portfolio from './pages/Portfolio';
import Liquidity from './pages/Liquidity';
import Swap from './pages/Swap';
import Settings from './pages/Settings';
import Insights from './pages/Insights';

function App() {
  return (
    /*matching my layout wrapper tracking to my structural variables (`--bg-app`) to manage mode shifts globally */
    <div className="min-h-screen flex text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-app)]">
        <Header />

        {/* This main node processes my dynamic page context arrays while keeping layout files locked down */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Routes>
            {/* implement an automatic redirection pattern here to route empty URLs straight to the dashboard workspace */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* The 14 Declarative App Paths */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/home" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="/liquidity" element={<Liquidity />} />
            <Route path="/swap" element={<Swap />} />
            <Route path="/insights" element={<Insights />} />

            {/* Fallback pattern safeguarding broken links */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;