import React from "react";
import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import WifiIcon from "@mui/icons-material/Wifi";
import PolicyIcon from "@mui/icons-material/Policy";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from "@mui/material";

const Sidebar = () => {
  const menuItems = [
    { name: "Overview", path: "/", icon: <DashboardIcon /> },
    { name: "Anomalies", path: "/anomalies", icon: <PolicyIcon /> },
    { name: "Clusters", path: "/clusters", icon: <BubbleChartIcon /> },
    { name: "Hotspots", path: "/hotspots", icon: <WifiIcon /> },
    { name: "Protocols", path: "/protocols", icon: <PolicyIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#1e293b", // Tailwind-like gray-800
          color: "#ffffff", // White text
        },
      }}
    >
      {/* Sidebar Header */}
      <Box
        sx={{
          textAlign: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
          padding: "16px 0",
          borderBottom: "1px solid #3b475b",
        }}
      >
        Netano - Network Analysis AI
      </Box>

      {/* Menu Items */}
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.name}
            component={NavLink}
            to={item.path}
            sx={{
              "&.active": {
                backgroundColor: "#334155", // Tailwind-like gray-700
              },
              "&:hover": {
                backgroundColor: "#475569", // Tailwind-like gray-600
              },
            }}
          >
            <ListItemIcon sx={{ color: "#ffffff" }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{ style: { color: "#ffffff" } }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
