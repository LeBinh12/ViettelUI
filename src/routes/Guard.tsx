import type { JSX } from "react";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("access_token");
  if (token) {
    // Nếu đã có token thì tự động chuyển hướng về home
    return <Navigate to="/" replace />;
  }
  return children;
}

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    // Nếu chưa login thì về trang login
    return <Navigate to="/login" replace />;
  }

  return children;
}

export { PublicRoute, PrivateRoute };
