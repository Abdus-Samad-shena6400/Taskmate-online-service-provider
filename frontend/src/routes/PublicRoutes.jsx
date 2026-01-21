import { Navigate, Outlet } from "react-router-dom";

function PublicRoutes() {
  const localStorageToken = localStorage.getItem("userData");
  let parsedToken;




  try {
    parsedToken = localStorageToken ? JSON.parse(localStorageToken) : null;

    console.log("Parsed Token:", parsedToken);

  } catch (error) {
    console.error("Failed to parse token:", error.message);
  }

  if (!localStorageToken) {
    return <Outlet />;
  }

  // Use a switch statement for role-based navigation
  switch (parsedToken?.user?.role) {
    case "Provider":
      return <Navigate to="/provider-dashboard" replace />;
    case "Consumer":
      return <Navigate to="/consumer-dashboard" replace />;
    case "Admin":
      return <Navigate to="/admin-dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}

export default PublicRoutes;
