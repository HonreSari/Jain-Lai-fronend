// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "@/stores/useAuthStore"

import Home from "@/pages/Home"
import AuthPage from "@/pages/AuthPage"
import SeriesDetail from "@/pages/SeriesDetail"
import WatchPage from "@/pages/WatchPage" // ✅ Import WatchPage

function App() {
  const token = useAuthStore((s) => s.token)
  const isAuthenticated = !!token

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" replace />} />
        <Route path="/series/:id" element={<SeriesDetail />} />
        <Route path="/watch/:episodeId" element={<WatchPage />} /> {/* ✅ Route added */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
