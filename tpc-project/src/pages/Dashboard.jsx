import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser, signInFailure } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

// Sidebar Component
const Sidebar = ({ user, handleSignOut }) => {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-blue-800 text-white h-screen p-5">
      <h2 className="mb-5 text-center">Welcome</h2>
      <div className="user-info text-center mb-5">
        <img
          src={user?.image || 'default-avatar.png'}
          alt="User Photo"
          className="w-20 h-20 rounded-full mx-auto"
        />
        <h3 className="mt-2">{user?.name || 'Guest'}</h3>
      </div>
      <ul>
        <li className="my-3">
          <a href="/dashboard" className="hover:text-blue-300">Dashboard</a>
        </li>
        <li className="my-3">
          <a href="/profile" className="hover:text-blue-300">Profile</a>
        </li>
        <li className="my-3">
          <a href="/home" className="hover:text-blue-300">Go to Home</a>
        </li>
        <li className="my-3">
          <button
            onClick={handleSignOut}
            className="hover:text-blue-300 text-left"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

// Main Content Component
const MainContent = () => (
  <div className="flex-grow p-5 bg-gray-100">
    <h1 className="text-xl font-bold mb-4">Dashboard</h1>
    <p className="text-red-500 text-center">Click here for neat registration</p>
    <div className="mt-8">
      <h1 className="text-2xl font-semibold mb-4">Placement Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Jobs Applied', 'Interviews Completed', 'Applications Shortlisted', 'Interviews Selected'].map(
          (title, index) => (
            <div
              key={index}
              className="bg-blue-100 border border-gray-300 rounded-lg p-4 shadow-md"
            >
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-2xl">0</p>
            </div>
          )
        )}
      </div>
    </div>
  </div>
);

// Dashboard Component
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser); // Get the current user from Redux

  // Fetch user data when the component mounts

  const fetchUser = async () => {
    if (user && user.userId) { // Check if userId is available
      try {
        const response = await fetch(`http://localhost:3000/api/user/me/${user.userId}`); // Fetch user data using userId
        const data = await response.json();
        if (response.ok) {
          setUserData(data.user); // Assuming the response contains the user data in a `user` field
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    fetchUser(); // Call fetchUser on component mount
  }, [user]);
  // Handle user sign-out
  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
        credentials: 'include', // Ensure cookies are included
      });

      if (res.ok) {
        dispatch(setCurrentUser(null));
        navigate('/'); // Clear current user from Redux store
      } else {
        const data = await res.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error signing out:', error);
      dispatch(signInFailure(error.message)); // Handle error state
    }
  };

  // Return the Sidebar and MainContent components
  return (
    <div className="flex">
      <Sidebar user={user} handleSignOut={handleSignOut} />
      <MainContent />
    </div>
  );
};

export default Dashboard;
