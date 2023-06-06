import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getFromLocal } from "../Services/storage";

export default function PrivateComponent() {
  const auth = getFromLocal("user");
  return auth ? <Outlet /> : <Navigate to="/register" />;
}
