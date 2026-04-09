// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

// Pages
import Home from "@/pages/Home";
const Login = () => (
  <div className="p-8 text-2xl">🔐 Login Page (Coming Soon)</div>
);

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/series/:id"
          element={
            <div className="p-8 pt-24">📖 Series Detail (Coming Soon)</div>
          }
        />
        <Route
          path="/watch/:episodeId"
          element={<div className="p-8 pt-24">🎬 Watch Page (Coming Soon)</div>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
