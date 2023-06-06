import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getFromLocal } from "../Services/storage";

export default function RoleBasedComponent() {
  const auth = getFromLocal("user");

  const { roleid } = auth;
  return auth && roleid === 2 ? <Outlet /> : <Navigate to="/" />;
}
