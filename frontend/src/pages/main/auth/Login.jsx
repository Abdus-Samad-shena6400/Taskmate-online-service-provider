import React, { useState } from 'react';

import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import Navbar from '../../../components/common/Navbar';
import AnimatedButton from '../../../components/common/AnimatedButton';
import { useLoginUserMutation } from '../../../api/services/authApi';
import toast from 'react-hot-toast';

const Login = () => {

    const [loginUser, { isLoading, error, data }] = useLoginUserMutation();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [forgetMsg, setForgetMsg] = useState("");



    const navigate = useNavigate();


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await loginUser(formData).unwrap();
            if (res.success && res?.user?.email) {
                localStorage.setItem("userData", JSON.stringify({
                    user: res?.user,
                    token: res?.token
                }));
                toast.success("Login Successful", {
                    position: "top-right",
                });
                console.log("res", res?.user?.role);

                switch (res?.user?.role) {
                    case "Consumer":
                        setTimeout(() => {
                            navigate("/consumer-dashboard");
                        }, 100);
                        break;
                    case "Provider":
                        setTimeout(() => {
                            navigate("/provider-dashboard");
                        }, 100);
                        break;
                    case "Admin":
                        setTimeout(() => {
                            navigate("/admin-dashboard");
                        }, 100);
                        break;
                    default:
                        console.warn("Unknown role:", res?.user?.role);
                        setTimeout(() => {
                            navigate("/");
                        }, 100);
                        break;
                }
            }
        } catch (error) {
            toast.error(error.data.message, {
                position: "top-right",
            });
        }

        setFormData({
            email: "",
            password: ""
        });
    };

    return (
        <div>
            <Navbar role="" />

            <div className="flex justify-center items-center h-[89vh] bg-gray-300">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
                    <p className="text-center text-gray-600 mb-4">Please login using your registered email.</p>
                    <form className="space-y-4">
                        <input
                            className="w-full px-4 py-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="w-full px-4 py-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <AnimatedButton
                            isLoading={isLoading}
                            loadingText="logging Account..."
                            text="Login"
                            icon={true}
                            onClick={handleSubmit}
                        />

                    </form>
                    <p className="text-center text-gray-600 mt-4">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-500 hover:underline">
                            Register here
                        </Link>
                    </p>
                    <p className="text-center text-gray-600 mt-4">
                        Forgot your password?{' '}
                        <Link to="/forgot-password" className="text-blue-500 hover:underline">
                            Reset here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
