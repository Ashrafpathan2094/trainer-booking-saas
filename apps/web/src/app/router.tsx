import { createBrowserRouter } from "react-router-dom";

import Home from "../modules/public/pages/Home";
import Login from "../modules/auth/pages/Login";
import Dashboard from "../modules/customer/pages/Dashboard";
import AdminDashboard from "../modules/admin/pages/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
]);
