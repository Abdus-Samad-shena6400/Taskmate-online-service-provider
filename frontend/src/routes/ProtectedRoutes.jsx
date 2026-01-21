import { Box } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import NavbarComp from "../pages/main/NavbarComp";
// import Sidebar from "../components/SideBar";

const ProtectedRoutes = () => {
  // TODO: Use authentication token
    const localStorageToken = localStorage.getItem("userData");
    const userData = JSON.parse(localStorageToken);
    const role = userData?.user?.role


    console.log("role", role)

  return localStorageToken ? (
    <>
      {
        // userRole !== "admin" ? <Outlet /> :<Navigate to="/admin/dashboard" replace />
        <Box>
          <NavbarComp 
            role={role}
          />
 
          <Box
 
          >
            <Outlet />
          </Box>
        </Box>
      }
    </>
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoutes;
