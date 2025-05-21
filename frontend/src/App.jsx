import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomePage from './pages/HomePage'
import { AuthProvider } from "./contexts/AuthContext";
import UserPage from "./pages/UserPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <HomePage />
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/usermanage" element={
            <ProtectedRoute requiredRole={"admin"}><UserPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider >
  );
}

export default App;
