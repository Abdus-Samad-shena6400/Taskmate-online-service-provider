import React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as ConsumersIcon,
  Business as ProvidersIcon,
  Healing as ServicesIcon,
  Assignment as ServiceRequestsIcon,
  AssignmentTurnedIn as AssignmentsIcon,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { text: "Dashboard Overview", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Consumers", icon: <ConsumersIcon />, path: "/admin/consumers" },
    { text: "Providers", icon: <ProvidersIcon />, path: "/admin/providers" },
    { text: "Services", icon: <ServicesIcon />, path: "/admin/services" },
    { text: "Service Requests", icon: <ServiceRequestsIcon />, path: "/admin/requests" },
    { text: "Assignments", icon: <AssignmentsIcon />, path: "/admin/assignments" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
          Service Admin
        </Typography>
      </Toolbar>
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
