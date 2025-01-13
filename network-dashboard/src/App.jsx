import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Overview from "./pages/overview";
import AnomaliesPage from "./pages/anomalies";
import ClusterPage from "./pages/cluster";
import Hotspots from "./pages/hotspots";
import Protocols from "./pages/protocols";

const App = () => {
  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar className="w-1/5 bg-gray-800 text-white h-full" />

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 overflow-auto">
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/anomalies" element={<AnomaliesPage />} />
              <Route path="/clusters" element={<ClusterPage />} />
              <Route path="/hotspots" element={<Hotspots />} />
              <Route path="/protocols" element={<Protocols />} />

            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
