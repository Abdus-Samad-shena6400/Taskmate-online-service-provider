import React, { useState } from 'react';
import {
    Container,
    Paper,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useGetAllServicesQuery, useDeleteServiceMutation, useGetConsumerServicesByIdQuery } from '../../../api/services/serviceApi';

const MyServices = () => {
    const navigate = useNavigate();
    // const { data, isLoading, error, refetch } = useGetAllServicesQuery();

    const user = JSON.parse(localStorage.getItem('userData'));

    const { data, error, isLoading, refetch } = useGetConsumerServicesByIdQuery(user?.user?._id);

    console.log("data", data?.service)

    const [deleteService] = useDeleteServiceMutation();
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteService(selectedId).unwrap();
            toast.success('Service deleted successfully');
            refetch();
        } catch (error) {
            toast.error('Failed to delete service');
        }
        setOpen(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5">My Orders</Typography>
                    <Button variant="text" color="inherit" startIcon={<ArrowBack />} size="small" onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                </Box>

                <TableContainer component={Paper} sx={{ mt: 2, bgcolor: "background.grayish" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Number</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Updated At</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.service?.length > 0 ? (

                                data?.service
                                    .slice()
                                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) // descending by date
                                    .map((order, index) => (
                                        <TableRow key={order?._id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{order?.fullName}</TableCell>
                                            <TableCell>{order?.phoneNumber}</TableCell>
                                            <TableCell>{order?.category}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={order.status}
                                                    sx={{
                                                        fontWeight: 500,
                                                        letterSpacing: "0.8px",
                                                        color: "white",
                                                        px: 1,
                                                        borderRadius: 2,
                                                        ...(function () {
                                                            switch (order.status) {
                                                                case 'Pending':
                                                                    return {
                                                                        bgcolor: '#FFA726',
                                                                        border: '1px solid '
                                                                    };
                                                                case 'In-Progress':
                                                                    return {
                                                                        bgcolor: '#2563EB  ',
                                                                        border: '1px solid'
                                                                    };
                                                                case 'Completed':
                                                                    return {
                                                                        bgcolor: '#00A859',
                                                                        border: '1px solid'
                                                                    };
                                                                case 'Delivered':
                                                                    return {
                                                                        bgcolor: '#4CAF50',
                                                                        border: '1px solid #66BB6A'
                                                                    };
                                                                default:
                                                                    return {
                                                                        bgcolor: '#BDBDBD',
                                                                        border: '1px solid #E0E0E0'
                                                                    };
                                                            }
                                                        })()
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>{formatDate(order?.updatedAt)}</TableCell>


                                            <TableCell>
                                                <Box display="flex" gap={1}>
                                                    <Button variant="contained" color="primary" size="small" onClick={() => navigate(`/services/${order._id}`)}>
                                                        View Details
                                                    </Button>
                                                    <Button variant="contained" color="error" size="small" onClick={() => handleDeleteClick(order._id)}>
                                                        Delete
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body1" color="text.secondary">No orders found.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this service? This action cannot be undone.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} variant="contained" color="primary">Cancel</Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MyServices;
