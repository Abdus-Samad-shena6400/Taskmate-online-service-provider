import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Autocomplete,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import {
    Person as PersonIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Build as BuildIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';
import { useAddServiceMutation } from '../../../api/services/serviceApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const services = [
    { label: 'Ac install and repair', value: 'Ac install and repair' },
    { label: 'Bathroom cleaning', value: 'Bathroom cleaning' },
    { label: 'Bathroom plumbing installation and repair', value: 'Bathroom plumbing installation and repair' },
    { label: 'Carpet cleaning', value: 'Carpet cleaning' },
    { label: 'Commerical cleaning', value: 'Commerical cleaning' },
    { label: 'Curtain cleaning', value: 'Curtain cleaning' },
    { label: 'Deep cleaning service', value: 'Deep cleaning service' },
    { label: 'Dishwasher repair and maintenance', value: 'Dishwasher repair and maintenance' },
    { label: 'Electrician service', value: 'Electrician service' },
    { label: 'Fan install and repair', value: 'Fan install and repair' },
    { label: 'Floor cleaning', value: 'Floor cleaning' },
    { label: 'Geyser install or repair', value: 'Geyser install or repair' },
    { label: 'Glass cleaning', value: 'Glass cleaning' },
    { label: 'Kitchen cleaning', value: 'Kitchen cleaning' },
    { label: 'Kitchen plumbing installation and repair', value: 'Kitchen plumbing installation and repair' },
    { label: 'Matress cleaning', value: 'Matress cleaning' },
    { label: 'Microwave repair', value: 'Microwave repair' },
    { label: 'Pest control services', value: 'Pest control services' },
    { label: 'Plumbing service', value: 'Plumbing service' },
    // { label: 'Refrigerator and deep freezer', value: 'Refrigerator and deep freezer' },
];

const AddService = () => {
    const [formData, setFormData] = useState({
        category: null,
        location: '',
        description: '',
    });

    const [addService, { isLoading }] = useAddServiceMutation();

    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem("userData"));

    console.log("user", user?.user?.phoneNumber);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ( !formData.category || !formData.location || !formData.description) {
            toast.error('Please fill in all required fields', { position: "top-right" });
            return;
        }


        try {
            await addService({  
                fullName: user?.user?.name,
                phoneNumber: user?.user?.phoneNumber,
                category: formData.category.value,
                location: formData.location,
                description: formData.description,
            }).unwrap();
            toast.success('Service booked successfully!', { position: "top-right" });
            setFormData({ category: null, location: '', description: "" });
            setTimeout(() => {

                navigate("/consumer-dashboard")
            }, 1000);
        } catch (err) {
            toast.error('Failed to book service. Please try again.', { position: "top-right" });
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 4
        }}>
            <Container maxWidth="md">
                <Card
                    elevation={12}
                    sx={{
                        borderRadius: 3,
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}
                >
                    <CardContent sx={{ p: 5 }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            align="center"
                            gutterBottom
                            sx={{
                                mb: 4,
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 700,
                                letterSpacing: '-0.5px'
                            }}
                        >
                            Book a Service
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} noValidate>

                            <Autocomplete
                                fullWidth
                                options={services}
                                value={formData.category}
                                onChange={(_, newValue) => setFormData({ ...formData, category: newValue })}
                                sx={{
                                    mt: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(76, 175, 80, 0.04)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(76, 175, 80, 0.08)',
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: 'rgba(76, 175, 80, 0.08)',
                                            '& fieldset': {
                                                borderColor: '#4CAF50',
                                                borderWidth: 2,
                                            }
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#4CAF50',
                                        fontWeight: 600,
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Service"
                                        required
                                        margin="normal"
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <BuildIcon sx={{ color: '#4CAF50' }} />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                )}
                            />

                            <TextField
                                fullWidth
                                required
                                label="Description"
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                margin="normal"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(255, 152, 0, 0.04)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 152, 0, 0.08)',
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: 'rgba(255, 152, 0, 0.08)',
                                            '& fieldset': {
                                                borderColor: '#FF9800',
                                                borderWidth: 2,
                                            }
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#FF9800',
                                        fontWeight: 600,
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DescriptionIcon sx={{ color: '#FF9800' }} />
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <TextField
                                fullWidth
                                required
                                label="Location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                margin="normal"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(156, 39, 176, 0.04)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(156, 39, 176, 0.08)',
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: 'rgba(156, 39, 176, 0.08)',
                                            '& fieldset': {
                                                borderColor: '#9C27B0',
                                                borderWidth: 2,
                                            }
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#9C27B0',
                                        fontWeight: 600,
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationIcon sx={{ color: '#9C27B0' }} />
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={isLoading}
                                sx={{
                                    mt: 4,
                                    mb: 2,
                                    py: 2,
                                    borderRadius: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                    boxShadow: '0 8px 20px rgba(33, 150, 243, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #1976D2 30%, #1BA3D1 90%)',
                                        boxShadow: '0 12px 25px rgba(33, 150, 243, 0.4)',
                                        transform: 'translateY(-2px)',
                                    },
                                    '&:disabled': {
                                        background: 'linear-gradient(45deg, #B0BEC5 30%, #CFD8DC 90%)',
                                        boxShadow: 'none',
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Book Service'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default AddService;