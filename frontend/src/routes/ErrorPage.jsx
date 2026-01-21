import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      bgcolor="#f7f7f7"
      p={3}
    >
      <ErrorOutlineIcon style={{ fontSize: '6rem', color: '#d32f2f' }} />
      
      <Typography variant="h4" color="error" gutterBottom>
        Oops! Page Not Found
      </Typography>

      <Typography variant="body1" color="textSecondary" mb={3}>
        The page you’re looking for doesn’t exist or has been moved.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
        sx={{ mt: 2, backgroundColor: "text.black" }}
      >
        Go Back to Home
      </Button>
    </Box>
  );
};

export default ErrorPage;
