import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';

// Placeholder Pages
import Home from './pages/Home';
import Scan from './pages/Scan';
import ScanResult from './pages/ScanResult';
import MapView from './pages/Map';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* App routes with bottom navigation */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="scan" element={<Scan />} />
          <Route path="scan/result" element={<ScanResult />} />
          <Route path="map" element={<MapView />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
