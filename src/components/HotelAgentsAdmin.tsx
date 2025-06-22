import React, { useEffect } from "react";
import { getCurrentUser } from "../services/auth.service";
import { NavigateFunction, useNavigate } from "react-router-dom";
import SearchUser from "./userSearch";

const HotelAgentsAdmin: React.FC = () => {
  const currentUser = getCurrentUser();
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== "admin") {
    return null; // Prevent rendering if not an admin (handled by useEffect)
  }

  return (
    <div style={{ marginLeft: "15px", marginBottom: "15px" }}>
      <SearchUser authbasic={`${localStorage.getItem("aToken")}`} />
    </div>
  );
};

export default HotelAgentsAdmin;
