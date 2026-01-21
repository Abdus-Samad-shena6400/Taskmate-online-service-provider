const mongoose = require('mongoose');

// Predefined service categories
const serviceCategories = [
    'Ac install and repair',
    'Bathroom cleaning',
    'Bathroom plumbing installation and repair',
    'Carpet cleaning',
    'Commerical cleaning',
    'Curtain cleaning',
    'Deep cleaning service',
    'Dishwasher repair and maintenance',
    'Electrician service',
    'Fan install and repair',
    'Floor cleaning',
    'Geyser install or repair',
    'Glass cleaning',
    'Kitchen cleaning',
    'Kitchen plumbing installation and repair',
    'Matress cleaning',
    'Microwave repair',
    'Pest control services',
    'Plumbing service',
    'Refrigerator and deep freezer',
];

// Service Schema
const ServiceSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [3, "Name should have more than 3 characters"], // Minor fix in the message
    },
    category: {
        type: String,
        enum: serviceCategories, // Restrict to predefined categories
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "InProgress", "Completed"],
        default: "Pending"
    },
    consumerID: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    providerID: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    taskStatus: {
        type: String,
        enum: ["Assigned", "UnAssigned"],
        default: "UnAssigned"

    },
    location: {
        type: String,
        required: true,
    },
    reviews: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
        },

    }
}, {
    timestamps: true,
});

// Create Service Model
const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;
