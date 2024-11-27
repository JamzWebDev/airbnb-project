import React, { useState } from "react";
import HostNavbar from "./HostNavbar";
import ViewReservations from "./ViewReservations";
import ViewListings from "./ViewListings";
import CreateListing from "./CreateListing";
import "../components/HostDashboard.css";

const HostDashboard = ({ username }) => {
  const [activePage, setActivePage] = useState("viewListings");

  return (
    <div>
      <HostNavbar username={username} />

      <div className="dashboard-tabs">
        <button onClick={() => setActivePage("viewReservations")}>
          View Reservations
        </button>
        <button onClick={() => setActivePage("viewListings")}>
          View Listings
        </button>
        <button onClick={() => setActivePage("createListing")}>
          Create Listing
        </button>
      </div>

      <div className="dashboard-content">
        {activePage === "viewReservations" && <ViewReservations />}
        {activePage === "viewListings" && <ViewListings />}
        {activePage === "createListing" && <CreateListing />}
      </div>
    </div>
  );
};

export default HostDashboard;
