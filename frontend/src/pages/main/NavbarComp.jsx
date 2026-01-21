import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Avatar,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  ShoppingBag,
  Person,
  Settings,
  Assessment,
  AdminPanelSettings,
  Group,
  Logout,
  AccountCircle,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useGetUserQuery } from '../../api/services/authApi';
import { useDispatch } from 'react-redux';
import api from '../../api/api';
import { Link, useNavigate } from 'react-router-dom';

const NavbarComp = ({ role }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [avatarAnchorEl, setAvatarAnchorEl] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetUserQuery();

  const localStorageToken = localStorage.getItem("userData");
  const userData = JSON.parse(localStorageToken);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAvatarClick = (event) => {
    setAvatarAnchorEl(event.currentTarget);
  };

  const handleAvatarMenuClose = () => {
    setAvatarAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    localStorage.clear();
    dispatch(api.util.resetApiState());
    setTimeout(() => {
      navigate("/login");
    }, 100);
    handleAvatarMenuClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getInitials = (name) => {
    if (!name) return "NA";
    const names = name.split(" ");
    return names.length > 1
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const menuItems = {
    Consumer: [
      { text: 'Service history', icon: <ShoppingBag />, path: '/my-services' },
    ],
    Provider: [
      { text: 'Dashboard', icon: <Dashboard />, path: '/provider-dashboard' },

    ],
    Admin: [
      { text: 'Add Admin', icon: <Dashboard />, path: '/admin/add-admin' },
    ]
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
          {getInitials(data?.user?.name)}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {data?.user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {role}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        {menuItems[role]?.map((item) => (
          <ListItem disablePadding key={item.text}>
            <ListItemButton
              component="a"
              href={item.path}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: theme.palette.background.paper,
          color: theme.palette.text.primary
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  background: `-webkit-linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  cursor: 'pointer'
                }}
              >
                TaskMate
              </Typography>
            </Link>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!isMobile && menuItems[role]?.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                href={item.path}
                startIcon={item.icon}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                  }
                }}
              >
                {item.text}
              </Button>
            ))}

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handleAvatarClick}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    }
                  }}
                >
                  {getInitials(data?.user?.name)}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={avatarAnchorEl}
                open={Boolean(avatarAnchorEl)}
                onClose={handleAvatarMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    '& .MuiMenuItem-root': {
                      gap: 1,
                      py: 1
                    }
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {data?.user?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data?.user?.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem component="a" href="/profile">
                  <AccountCircle fontSize="small" /> Profile
                </MenuItem>
                <MenuItem component="a" href="/settings">
                  <SettingsIcon fontSize="small" /> Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <Logout fontSize="small" /> Logout
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true
        }}
        PaperProps={{
          sx: {
            boxShadow: theme.shadows[5]
          }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default NavbarComp;
