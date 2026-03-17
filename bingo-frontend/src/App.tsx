import type { ReactElement } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Scan from './pages/Scan';
import ScanResult from './pages/ScanResult';
import MapView from './pages/Map';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import { hasSession } from './lib/session';

function ProtectedRoute() {
  if (!hasSession()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function PublicAuthRoute({ children }: { children: ReactElement }) {
  if (hasSession()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicAuthRoute>
              <Login />
            </PublicAuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicAuthRoute>
              <Signup />
            </PublicAuthRoute>
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="scan" element={<Scan />} />
            <Route path="scan/result" element={<ScanResult />} />
            <Route path="map" element={<MapView />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
