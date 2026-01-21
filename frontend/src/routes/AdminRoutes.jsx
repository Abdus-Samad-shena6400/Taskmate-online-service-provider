import { Box } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";

const AdminRoutes = () => {
  const localStorageToken = localStorage.getItem("userData");
  const userData = JSON.parse(localStorageToken);
  const role = userData?.user?.role;

  if (!localStorageToken || role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar /> 
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet /> {/* This renders AdminDashboard or other admin pages */}
      </Box>
    </Box>
  );
};

export default AdminRoutes;
