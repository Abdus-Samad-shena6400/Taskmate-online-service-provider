import React from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/main/Home";
import Login from "./pages/main/auth/Login";
import Register from "./pages/main/auth/Registration";
import { Toaster } from "react-hot-toast";
import PublicRoutes from "./routes/PublicRoutes";
import ErrorPage from "./routes/ErrorPage";
import ConsumerDashboard from "./pages/main/consumer/ConsumerDashboard"
import ProviderDashboard from "./pages/main/provider/ProviderDashboard"
import ProtectedRoutes from "./routes/ProtectedRoutes";
import AddService from "./pages/main/consumer/AddService";
import Profile from "./pages/main/Profile";
import MyOrders from "./pages/main/consumer/MyServices";
import ServiceDetials from "./pages/main/consumer/ServiceDetails";
import MyServices from "./pages/main/consumer/MyServices";
import AdminRoutes from "./routes/AdminRoutes";
import AdminDashboard from "./pages/main/admin/AdminDashboard";
import ConsumersTable from "./components/admin/ConsumersTable";
import ProvidersTable from "./components/admin/ProvidersTable";
import ServiceDashboad from "./components/admin/services/ServiceDashboad";
import UnAssignedServices from "./components/admin/services/UnAssignedServices";
import AssignedServices from "./components/admin/services/AssignedServices";
import CompletedServices from "./components/admin/services/CompletedServices";
import ProviderServices from "./pages/main/provider/ProviderServices";
import MyReviews from "./pages/main/consumer/MyReviews";
import AddAdmin from "./components/admin/AddAdmin";
import ForgotPassword from "./pages/main/auth/ForgotPassword";
import ResetPassword from "./pages/main/auth/ResetPassword";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#4791db',
      dark: '#115293',
      contrastText: '#fff',
    },
    secondary: {
      main: '#dc004e',
      light: '#e33371',
      dark: '#9a0036',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#E5E9F0',
      grayish: "#F3F3F3"
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
      letterSpacing: 0.5,
    },
    button: {
      textTransform: 'none', // Prevents all-caps buttons
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '6px 16px',
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },
  },
});

function App() {


  const router = createBrowserRouter([
    {
      element: <PublicRoutes />,
      children: [
        {
          path: "/",
          element: <Home />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/register",
          element: <Register />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/login",
          element: <Login />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/password/reset/:token",
          element: <ResetPassword />,
          errorElement: <ErrorPage />,
        },

        // {
        //   path: "/reset-password/:token",
        //   element: <ResetPassword />,
        //   errorElement: <ErrorPage />,
        // },
        // {
        //   path: "/verify-email/:token",
        //   element: <VerifyEmail />,
        //   errorElement: <ErrorPage />,
        // },
        // {
        //   path: "/registration-success",
        //   element: <AfterRegistration />,
        //   errorElement: <ErrorPage />,
        // },
      ],
      // errorElement: <ErrorPage/>
    },


    {
      element: <ProtectedRoutes />,
      children: [
        {
          path: "/consumer-dashboard",
          element: <ConsumerDashboard />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/provider-dashboard",
          element: <ProviderDashboard />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/add-service",
          element: <AddService />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/profile",
          element: <Profile />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/my-services",
          element: <MyServices />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/services/:serviceId",
          element: <ServiceDetials />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/admin-dashboard",
          element: <AdminDashboard />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/admin/consumers",
          element: <ConsumersTable />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/admin/providers",
          element: <ProvidersTable />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/admin/services-dashboard",
          element: <ServiceDashboad />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/services/unassigned",
          element: <UnAssignedServices />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/services/assigned",
          element: <AssignedServices />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/services/completed",
          element: <CompletedServices />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/provider/services",
          element: <ProviderServices />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/consumer/review",
          element: <MyReviews />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/admin/add-admin",
          element: <AddAdmin />,
          errorElement: <ErrorPage />,
        },
      ],
    },

  ]);


  return (
    <>
      <ThemeProvider theme={theme}>
        <Toaster />
        <RouterProvider router={router} />
      </ThemeProvider>


      {/* <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        </Routes>
      </Router> */}
    </>

  );
}

export default App;
