import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import AdminDashboard from "./pages/AdminDashboard"
import Login from "./pages/Login"
import MedicalChatbot from "./pages/MedicalChatbot"
import Unauthorized from "./pages/Unauthorized.tsx"

// Auth protection (unused but kept for future use)
// function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const token = localStorage.getItem("token")
//   return token ? <>{children}</> : <Navigate to="/login" />
// }

// Role protection
function RoleProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode
  allowedRoles: string[]
}) {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const roles: string[] = user?.roles || []

  if (!token) return <Navigate to="/login" />

  const hasRole = roles.some((role) => allowedRoles.includes(role))

  return hasRole ? <>{children}</> : <Navigate to="/unauthorized" />
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/chatbot" element={<MedicalChatbot />} />

          <Route
            path="/dashboard"
            element={
              <RoleProtectedRoute allowedRoles={["ROLE_MEDECIN"]}>
                <Dashboard />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <RoleProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                <AdminDashboard />
              </RoleProtectedRoute>
            }
          />

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<Navigate to="/chatbot" />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
