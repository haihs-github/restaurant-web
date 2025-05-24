import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomePage from './pages/HomePage'
import { AuthProvider } from "./contexts/AuthContext";
import UserPage from "./pages/UserPage";
import DishesPage from "./pages/DishesPage";
import TablesPage from "./pages/TablesPage/TablesPage";
import OrdersPage from "./pages/OrdersPage";
import ClientOrder from "./pages/ClientOrder/ClientOrder";
import StatisticsPage from "./pages/StatisticsPage/StatisticsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <HomePage />
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/clientOrder" element={<ClientOrder />} />
          <Route path="/users" element={
            <ProtectedRoute requiredRole={"admin"}><UserPage /></ProtectedRoute>} />
          <Route path="/dishes" element={
            <ProtectedRoute requiredRole={"admin"}><DishesPage /></ProtectedRoute>} />
          <Route path="/tables" element={
            <ProtectedRoute requiredRole={"admin"}><TablesPage /></ProtectedRoute>} />
          <Route path="/orders" element={
            <ProtectedRoute ><OrdersPage /></ProtectedRoute>} />
          <Route path="/statictis" element={
            <ProtectedRoute requiredRole={"admin"}><StatisticsPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider >
  );
}

export default App;
