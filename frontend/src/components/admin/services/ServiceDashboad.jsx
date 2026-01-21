import React from "react";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import { Building2, ClipboardCheck, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ActionCard = ({ title, icon: Icon, description, color, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      background: color,
      color: "#fff",
      borderRadius: 3,
      boxShadow: 4,
      transition: "transform 0.3s, box-shadow 0.3s",
      "&:hover": {
        transform: "scale(1.03)",
        boxShadow: 8,
        cursor: "pointer",
      },
    }}
  >
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(4px)",
            width: 56,
            height: 56,
            mr: 2,
          }}
        >
          <Icon size={28} color="#fff" />
        </Avatar>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </Box>
      {description && (
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
          {description}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const ServiceDashboard = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "repeat(2, 1fr)" }}
      gap={3}
      mb={4}
      p={4}
    >
      {/* <ActionCard
        title="View All Services"
        icon={Users}
        color="linear-gradient(135deg, #06b6d4, #3b82f6)"
        description="See the list of all requested services."
        onClick={() => navigate("/services")}
      /> */}
      <ActionCard
        title="Unassigned Services"
        icon={Building2}
        color="linear-gradient(135deg, #10b981, #14b8a6)"
        description="Services waiting for providers."
        onClick={() => navigate("/services/unassigned")}
      />
      <ActionCard
        title="Assigned Services"
        icon={ClipboardCheck}
        color="linear-gradient(135deg, #6366f1, #8b5cf6)"
        description="Services currently assigned."
        onClick={() => navigate("/services/assigned")}
      />
      <ActionCard
        title="Completed Services"
        icon={Clock}
        color="linear-gradient(135deg, #f43f5e, #ef4444)"
        description="View services that have been completed."
        onClick={() => navigate("/services/completed")}
      />
    </Box>
  );
};

export default ServiceDashboard;
