
import React from "react";

import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser, signInFailure } from '../redux/user/userSlice.js'; // Import hooks from Redux// Import useSelector from React Redux

function Header() {
  // Access the current user from the Redux store
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
        credentials: 'include', // Ensure cookies are included
      });

      if (res.ok) {
        dispatch(setCurrentUser(null)); // Clear the Redux user state
        navigate('/login'); // Navigate to home page
      } else {
        const data = await res.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error signing out:', error);
      dispatch(signInFailure(error.message)); // Handle error state
    }
  };
  return (
    <header
      className="flex flex-col justify-end text-black"
      style={{
        backgroundImage: 'url("../collegeimage.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "200px",
        position: "relative",
      }}
    >
      <nav className="flex items-center justify-between bg-transparent p-4">
        <div className="text-3xl font-bold">
          <Link to="/" className="text-white">CEC</Link>
        </div>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="text-white hover:underline">
              Home
            </Link>
          </li>
        
          <li>
            <Link to="/about" className="text-white hover:underline">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-white hover:underline">
              Contacts
            </Link>
          </li>
          <li>
            <Link to="/calender" className="text-white hover:underline">
              Graph
            </Link>
          </li>
          {currentUser ? (
            <>
             {currentUser.isAdmin && (
              <>
                <li>
                  <Link to="/admin" className="text-white hover:underline">Admin</Link>
                </li>
                <li>
                <Link to="/filter" className="text-white hover:underline">Filter</Link>
              </li>
              </>
              )}
              {currentUser && !currentUser.isAdmin && (
    <li>
      <Link to="/dashboard" className="text-white hover:underline">
        Dashboard
      </Link>
    </li>
)}
              <li>
              <button
                onClick={handleSignOut}
                className="text-white hover:underline"
              >
                Logout
              </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="text-white hover:underline">
                Log In
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
