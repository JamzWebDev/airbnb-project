import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./components/LoginPage";
import HostDashboard from "./components/HostDashboard";
import UpdateListing from "./components/UpdateListing";
import ViewListings from "./components/ViewListings";
import ListingsPage from "./components/ListingsPage";
import ListingDetailsPage from "./components/ListingDetailsPage";
import MyReservationsPage from "./components/MyReservationsPage";
import "./styles/GlobalStyle.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listings/:location" element={<ListingsPage />} />
        <Route path="/listing/:id" element={<ListingDetailsPage />} />
        <Route path="/user-login" element={<LoginPage />} />
        <Route path="/host-login" element={<LoginPage />} />
        <Route path="/host-dashboard" element={<HostDashboard />} />
        <Route path="/view-listings" element={<ViewListings />} />
        <Route path="/edit-listing/:id" element={<UpdateListing />} />
        <Route path="/my-reservations" element={<MyReservationsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
