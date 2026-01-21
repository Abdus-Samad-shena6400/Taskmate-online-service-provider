import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Tooltip,
  Button
} from '@mui/material'
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material'
import { useAllConsumersQuery } from '../../api/services/adminApi'

const ConsumersTable = () => {
  const { data, isLoading, error } = useAllConsumersQuery()
  const [searchTerm, setSearchTerm] = useState('')

  const handleDelete = (consumerId, consumerName) => {
    console.log(`Deleting consumer: ${consumerName} with ID: ${consumerId}`)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (index) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ]
    return colors[index % colors.length]
  }

  const filteredConsumers = data?.consumers?.filter(consumer =>
    consumer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consumer.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 2 
        }}
      >
        <CircularProgress size={40} sx={{ color: 'white' }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert 
          severity="error" 
          sx={{ 
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            color: 'white',
            '& .MuiAlert-icon': { color: 'white' }
          }}
        >
          Failed to load consumers data. Please try again later.
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          sx={{ 
            mb: 2, 
            fontWeight: 700,
            color: 'black',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          🎨 Consumers
        </Typography>
        <Typography variant="h6" sx={{ color: 'black', mb: 3 }}>
          Manage your amazing community of users
        </Typography>
      
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <TextField
          variant="outlined"
          placeholder="🔍 Search consumers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#667eea' }} />
              </InputAdornment>
            ),
          }}
          sx={{ 
            maxWidth: 500,
            width: '100%',
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              },
              '&.Mui-focused': {
                boxShadow: '0 6px 25px rgba(102, 126, 234, 0.3)',
              }
            }
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(135deg, #667eea 0%, #5563c1 100%)' }}>
              <TableCell sx={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>👤 Consumer</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>📧 Email</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>🏷️ Role</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>📅 Join Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>🗑️ Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredConsumers.map((consumer, index) => (
              <TableRow key={consumer._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: getAvatarColor(index), width: 50, height: 50 }}>
                      {getInitials(consumer.name)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{consumer.name}</Typography>
                      <Typography variant="caption">ID: {consumer._id.slice(-8)}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 18, color: '#4ECDC4' }} />
                    <Typography>{consumer.email}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={consumer.role} sx={{ background: 'linear-gradient(45deg, #4ECDC4 30%, #44A08D 90%)', color: 'white' }} />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon sx={{ fontSize: 18, color: '#FFEAA7' }} />
                    <Typography>{formatDate(consumer.createdAt)}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Delete Consumer">
                    <IconButton onClick={() => handleDelete(consumer._id, consumer.name)} sx={{ background: 'linear-gradient(45deg, #ff6b6b 30%, #ee5a24 90%)', color: 'white' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filteredConsumers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography variant="h5">🔍 No consumers found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ConsumersTable
