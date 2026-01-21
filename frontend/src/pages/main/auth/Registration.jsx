import React, { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../../components/common/Navbar";
import { useRegisterUserMutation } from "../../../api/services/authApi";
import toast, { Toaster } from "react-hot-toast";
import DashboardButton from "../../../components/common/DashboardButton";
import AnimatedButton from "../../../components/common/AnimatedButton";

const Register = () => {
  const [error, setError] = useState("");

  const [registerUser, { isLoading, error: registerError, data }] = useRegisterUserMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phoneNumber: "",  // added phoneNumber here
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number using same regex as backend
    const phoneRegex = /^(\+?[0-9]{1,4}[-\s]?|0)?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError("Please enter a valid phone number.");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    if (formData.password.length < 8) {
      setError("Passwords must be greater than 7 characters long.");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    try {
      const data = await registerUser(formData).unwrap();

      toast.success(
        data.message || "Registration Successful, please check inbox",
        {
          position: "top-right",
        }
      );
      setTimeout(() => {
        navigate("/");
      }, 400);
    } catch (err) {
      toast.error(err.data.message, {
        position: "top-right",
        duration: 5000,
      });
    }
  };

  return (
    <>
      <Navbar role="" />
      <div className="flex flex-col items-center justify-center h-[89vh] bg-gray-300">
        <div className="w-full max-w-md bg-white p-8 shadow-lg rounded">
          {error && (
            <p className="text-center text-red-600 font-bold mb-4">{error}</p>
          )}
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Register
          </h2>
          <form className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Enter your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Enter your Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-10 px-1">
              <label className="block mb-2">
                <input
                  type="radio"
                  name="role"
                  value="Consumer"
                  onChange={handleChange}
                  className="mr-2"
                />
                Consumer
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="role"
                  value="Provider"
                  onChange={handleChange}
                  className="mr-2"
                />
                Provider
              </label>
            </div>

            <AnimatedButton
              isLoading={isLoading}
              loadingText="Creating Account..."
              text="Create Account"
              icon={true}
              onClick={handleSubmit}
            />
          </form>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
