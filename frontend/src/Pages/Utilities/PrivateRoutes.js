import React from "react";
import { Outlet, Navigate } from "react-router-dom";

function PrivateRoutes({ token }) {
  let auth = { token: token };

  return auth.token ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoutes;
