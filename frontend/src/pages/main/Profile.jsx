import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Container,
    Typography,
    Avatar,
    IconButton,
    Grid,
    Paper,
    Box,
    Tabs,
    Tab,
    Stack,
    CircularProgress
} from '@mui/material';
import {
    PhotoCamera,
    Person,
    Security,
    ArrowBack
} from '@mui/icons-material';
import { useGetUserQuery, useResetPasswordMutation, useUpdateUserMutation } from '../../api/services/authApi';
import toast from 'react-hot-toast';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const Profile = () => {
    const { data, isLoading, error } = useGetUserQuery();

    console.log("data", data)

    const navigate = useNavigate()

    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const [updatePassword, { isLoading: isUpdatingPassword }] = useResetPasswordMutation();

    const user = data?.user || {};

    const [tabValue, setTabValue] = useState(0);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (user) {
            setName(user?.name || '');
            setPhone(user?.phoneNumber || '');
            setProfileImage(user?.profileImage || null);
        }
    }, [user]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
        }
    };


    const handleUpdate = async () => {
        try {
            if (name === user.name && phone === (user.phoneNumber || '')) {
                toast.error("No changes detected!", { position: "top-right" });
                return;
            }

            // Ensure phoneNumber is not empty when updating it
            if (phone === "" && user.phoneNumber !== "") {
                toast.error("Phone number cannot be empty!", { position: "top-right" });
                return;
            }

            await updateUser({ name, phoneNumber: phone }).unwrap();
            toast.success("Profile Updated Successfully", { position: "top-right" });

        } catch (error) {
            toast.error("Failed to update profile", { position: "top-right" });
        }
    };



    const handlePasswordUpdate = async () => {
        try {
            if (!currentPassword.trim()) {
                toast.error('Old password cannot be empty', { position: "top-right" });
                return;
            }

            if (!newPassword.trim() || !confirmPassword.trim()) {
                toast.error('Please enter both new and confirm password', { position: "top-right" });
                return;
            }

            if (newPassword.length < 6) {
                toast.error('New password must be at least 6 characters long', { position: "top-right" });
                return;
            }

            if (newPassword !== confirmPassword) {
                toast.error('Passwords do not match', { position: "top-right" });
                return;
            }

            if (currentPassword === newPassword) {
                toast.error('New password cannot be the same as the old password', { position: "top-right" });
                return;
            }

            // Call mutation function to update the password
            const response = await updatePassword({
                currentPassword,
                newPassword
            }).unwrap();

            // Clear input fields after successful password update
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            toast.success(response?.message || 'Password updated successfully', { position: "top-right" });

        } catch (error) {
            console.error("Password update error:", error);

            // Display API error message if available
            const errorMessage = error?.data?.message || 'Failed to update password';
            toast.error(errorMessage, { position: "top-right" });
        }
    };



    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5">Account Settings</Typography>
                    <Button
                        variant="text"
                        color="inherit"
                        startIcon={<ArrowBack />}
                        size="small"
                        onClick={() => navigate(-1)} // Moves one step back
                    >
                        Go Back
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Box sx={{ width: '220px', bgcolor: 'background.grayish', borderRight: 1, borderColor: 'divider', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ position: 'relative', mb: 2 }}>
                            <Avatar src={profileImage || '/default-avatar.png'} sx={{ width: 120, height: 120, boxShadow: 2 }} />
                            <IconButton color="primary" component="label" sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'background.paper', boxShadow: 1 }} size="small">
                                <input hidden type="file" onChange={handleImageUpload} />
                                <PhotoCamera />
                            </IconButton>
                        </Box>
                        <Typography variant="h6" align="center" sx={{ mb: 0.5 }}>{user?.name || 'User Name'}</Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>{user?.email || 'email@example.com'}</Typography>
                        <Tabs orientation="vertical" value={tabValue} onChange={handleTabChange} sx={{ width: '100%', borderRight: 1, borderColor: 'divider' }}>
                            <Tab icon={<Person />} label="Profile" />
                            <Tab icon={<Security />} label="Security" />
                        </Tabs>
                    </Box>

                    <Box sx={{ flexGrow: 1, p: 3, bgcolor: "background.grayish" }}>
                        <TabPanel value={tabValue} index={0}>
                            <Typography variant="h6" sx={{ mb: 3 }}>Personal Information</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Full Name" value={name} onChange={(e) => setName(e.target.value)} variant="outlined" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth value={user?.email} disabled variant="outlined" InputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" onClick={handleUpdate} size="large" sx={{ mt: 1 }}>Save Changes</Button>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <Typography variant="h6" sx={{ mb: 3 }}>Password Settings</Typography>
                            <Stack spacing={3}>
                                <TextField fullWidth label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} variant="outlined" />
                                <TextField fullWidth label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} variant="outlined" />
                                <TextField fullWidth label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} variant="outlined" />
                                <Box>
                                    <Button variant="contained" color="primary" onClick={handlePasswordUpdate} size="large">Update Password</Button>
                                </Box>
                            </Stack>
                        </TabPanel>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Profile;
