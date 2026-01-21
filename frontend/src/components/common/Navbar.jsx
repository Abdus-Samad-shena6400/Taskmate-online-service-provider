import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'

const Navbar = ({ role }) => {

  const name = localStorage.getItem("userData") 


  return (
      <header className='flex justify-between items-center border-b min-h-4'>
        
        <Link className="title" to={`/${role}`} > TaskMate</Link>
        <nav>
          <ul className="nav-links">
            {role === 'consumer' && (
              <>
            
              <li><Link className='link' to="/create-project/step-2">Hire  </Link></li>
              <li><Link className='link' to="/consumer-notification">Notifications</Link></li>
              <li><Link className='link' to="/consumer-projects/approved-requests">Projects</Link></li>
              
              <li>
                <div className="dropdown">
                  <button className="dropdown-btn">{name}</button>
                  <div className="dropdown-content">
                    {/* <Link className='link' to="/consumer-me">Profile</Link> */}
                    <Link className='link' to="/settings/edit-profile">Setting</Link>
                    <Link className='link' to="/logout">Logout</Link>
                  </div>
                </div>
              </li>
            </>
            
            )}
            {role === "Admin" && (
              <>
                <li><Link className='link' to="/register-admin">Add Admin</Link></li>
                <li><Link className='link' to="/admin-chat">Messages</Link></li>
                <li><Link className='link' to="/logout">Logout</Link></li>

              </>
            )}
            {role === 'provider' && (
              <>
                <li><Link className='link' to="/available-requests">New Projects</Link></li>
                <li><Link className='link' to="/provider-projects">Projects</Link></li>
                <li><Link className='link' to="/provider-notifications">Notifications</Link></li>
                <li>
                <div className="dropdown">
                  <button className="dropdown-btn">{myName[0]}</button>
                  <div className="dropdown-content">
                    {/* <Link className='link' to="/provider-me">Profile</Link> */}
                    <Link className='link' to="/settings/edit-profile">Setting</Link>
                    <Link className='link' to="/logout">Logout</Link>
                  </div>
                </div>
              </li>
              </>
            )}
            {(role !== 'consumer' && role !== 'provider' && role !== 'admin') && (
              <>
                <li><Link className='link' to="/login">Login</Link></li>
                <li><Link className='link' to="/register">Sign Up</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>

  );
};

export default Navbar;
