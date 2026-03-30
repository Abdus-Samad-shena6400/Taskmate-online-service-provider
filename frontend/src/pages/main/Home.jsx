import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Star, 
  Award, 
  Shield, 
  ChevronRight,
  Play,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Globe
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import { useNavigate } from 'react-router-dom';



const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    service: null,
    State: null,
    location: '',
  });

  const navigate = useNavigate()

  const points = [
    {
      title: 'Easy Access',
      description: 'Quickly post a request and connect with reliable service providers in your area.',
      icon: Users,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Verified Providers',
      description: 'Work with experienced and verified professionals for your home service needs.',
      icon: Shield,
      gradient: 'from-green-500 to-blue-500'
    },
    {
      title: 'Timely Service',
      description: 'Get your requests addressed promptly with minimal wait times.',
      icon: Clock,
      gradient: 'from-orange-500 to-red-500'
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    alert('Form Submitted Successfully!');
  };

  const slides = [
    {
      id: 1,
      src: "/images/services/a.JPG",
      alt: "Image 1",
      title: "AC Install and Repair",
      description: "Professional AC installation and repair services",
    },
    {
      id: 2,
      src: "/images/services/b.JPG",
      alt: "Image 2",
      title: "Bathroom Cleaning",
      description: "Complete bathroom cleaning and sanitization",
    },
    {
      id: 3,
      src: "/images/services/c.JPG",
      alt: "Image 3",
      title: "Bathroom Plumbing Installation and Repair",
      description: "Expert plumbing solutions for your bathroom",
    },
    {
      id: 4,
      src: "/images/services/d.JPG",
      alt: "Image 4",
      title: "Carpet Cleaning",
      description: "Deep carpet cleaning and stain removal",
    },
    {
      id: 5,
      src: "/images/services/e.JPG",
      alt: "Image 5",
      title: "Commercial Cleaning",
      description: "Professional commercial cleaning services",
    },
    {
      id: 6,
      src: "/images/services/f.JPG",
      alt: "Image 6",
      title: "Washing Machine Install and Repair",
      description: "Installation and repair of washing machines",
    },
    {
      id: 7,
      src: "/images/services/g.JPG",
      alt: "Image 7",
      title: "Electrician Service",
      description: "Professional electrical services and repairs",
    },
    {
      id: 8,
      src: "/images/services/h.JPG",
      alt: "Image 8",
      title: "Fan Install and Repair",
      description: "Ceiling fan installation and maintenance",
    },
    {
      id: 9,
      src: "/images/services/i.JPG",
      alt: "Image 9",
      title: "Kitchen Plumbing Installation and Repair",
      description: "Kitchen plumbing solutions and repairs",
    },
    {
      id: 10,
      src: "/images/services/j.JPG",
      alt: "Image 10",
      title: "Plumbing Service",
      description: "Complete plumbing services for your home",
    },
    {
      id: 11,
      src: "/images/services/k.JPG",
      alt: "Image 11",
      title: "Refrigerator and Deep Freezer",
      description: "Appliance repair and maintenance services",
    },
    {
      id: 12,
      src: "/images/services/l.JPG",
      alt: "Image 12",
      title: "Cleaning Service",
      description: "Professional home cleaning services",
    },
  ];

  const teamMembers = [
    {
      name: "Abdus Samad",
      image: "/images/team/samad.jpeg",
      description: "Full-stack developer specializing in React and Node.js. I build responsive, accessible user interfaces and scalable backend APIs, and I focus on writing clean, maintainable code. Passionate about mentorship, performance, and delivering user-centered solutions.",
      role: "Full-Stack Developer"
    },
    {
      name: "Mohammad Haris",
      image: "/images/team/haris.jpg",
      description: "Frontend Developer focused on building pixel-perfect, accessible interfaces using React and Tailwind CSS. Skilled in UI/UX, responsive design, and performance optimization to create smooth user experiences.",
      role: "Frontend Developer"
    },
    {
      name: "Iqrar Ali",
      image: "/images/team/iqrar.jpg",
      description: "Frontend Developer experienced in building interactive web applications with React. Strong in component architecture, state management, and collaborating closely with designers to bring interfaces to life.",
      role: "Frontend Developer"
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(slides.length / 4));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(slides.length / 4)) % Math.ceil(slides.length / 4));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Modern Navbar */}

      <Navbar role="" />
      {/* <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ServiceConnect
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="/services" className="text-gray-700 hover:text-blue-600 transition-colors">Services</a>
              <a href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/login" 
                className="px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all"
              >
                Login
              </a>
              <a 
                href="/register" 
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Your Service Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connect with verified professionals for all your service needs. From home repairs to installations, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/register')} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center">
                <Play className="mr-2 h-5 w-5" />
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Carousel */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">Our Services</h2>
            <p className="text-lg text-gray-600">Professional services for your every need</p>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(slides.length / 4) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="min-w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                      {slides.slice(slideIndex * 4, (slideIndex + 1) * 4).map((slide) => (
                        <div 
                          key={slide.id} 
                          className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={slide.src}
                              alt={slide.alt}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-6">
                            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {slide.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {slide.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all"
            >
              <ChevronRight className="h-6 w-6 rotate-180" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(slides.length / 4) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === index 
                      ? 'bg-blue-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">Why Choose Us</h2>
            <p className="text-lg text-gray-600">Experience the difference with our premium service platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {points.map((point, index) => {
              const IconComponent = point.icon;
              return (
                <div 
                  key={index}
                  className={`bg-gradient-to-br ${point.gradient} rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                >
                  <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm w-fit mb-6">
                    <IconComponent size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{point.title}</h3>
                  <p className="text-white/90 leading-relaxed">{point.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
              Our Vision
            </h2>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <p className="text-lg text-gray-700 leading-relaxed">
                The project aims to improve the experience of Internet services. Consumers will be able to put in a request related to field services, online shopping, transportation, food orders, education, and IT services. The goal is to improve quality and accessibility. Our project objective is to develop a reliable and efficient connection between service providers and consumers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600">The passionate individuals behind our success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-60 object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of satisfied customers who trust us with their service needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/register')} className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-all font-semibold">
                Request Service Now
              </button>
          
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">TaskMate</span>
              </div>
              <p className="text-gray-400">
                Connecting you with the best service providers in your area.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Home Repair</li>
                <li>Cleaning</li>
                <li>Plumbing</li>
                <li>Electrical</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3" />
                  <span>+92 3131512640</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3" />
                  <span>abdussamad124556@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>123 Service St, City, State</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TaskMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;