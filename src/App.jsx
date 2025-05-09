import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import BookDetails from "./pages/BookDetails";
import Likes from "./components/Likes";
import Cart from "./components/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/book/:id" 
          element={
            <PrivateRoute>
              <BookDetails />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/likes" 
          element={
            <PrivateRoute>
              <Likes />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;