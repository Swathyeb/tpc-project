
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { signInStart, signInSuccess, signInFailure,setCurrentUser } from '../redux/user/userSlice'; // Import actions

const Login = () => {
  const [name, setName] = useState(''); // Use 'name' for username
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name || !password) {
      alert('Please fill out all fields');
      return;
    }

    dispatch(signInStart()); // Dispatch signInStart action

    try {
      const res = await fetch('http://localhost:3000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }), // Sending name instead of username
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(signInFailure(data.message)); // Dispatch signInFailure with error message
        alert(data.message); // Show error message from the server
      } else {

        dispatch(signInSuccess(data));
        // dispatch(signInSuccess({ 
        //   _id: data._id, 
        //   name: data.name,
        //   image: data.image,

        // }));
         // Show success message
        if (data.isAdmin) {
          alert('Admin Login Successful');
          navigate('/admin'); // Admin panel
        } else {
          alert('Student Login Successful');
          navigate('/dashboard'); // Regular user dashboard
        } // Navigate to the dashboard
      }
    } catch (err) {
      dispatch(signInFailure('Something went wrong, please try again.')); // Dispatch failure on catch
      alert('Something went wrong, please try again.');
      console.error('Error login:', err);
    }
  };

  const handleRegisterClick = () => {
    alert('Redirecting to registration page...');
    navigate('/register'); // Redirect to the registration page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0f8ff]">
      <div className="text-center bg-gradient-to-r from-teal-400 to-blue-400 p-10 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-white text-3xl mb-6">Training and Placement Cell</h1>
        <form className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg" onSubmit={handleLogin}>
          <h2 className="text-xl font-semibold mb-4">Login</h2>
          <input
            type="text"
            placeholder="Name" // Placeholder updated to 'Name'
            value={name} // Updated value to 'name'
            onChange={(e) => setName(e.target.value)} // Update handler to 'setName'
            className="w-full p-3 mb-4 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded"
            required
          />
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-500">
            Login
          </button>
          <p className="mt-4">
            Don't have an account?{' '}
            <a href="#" onClick={handleRegisterClick} className="text-blue-500 hover:underline">
              Register Here
            </a>
          </p>
     
        </form>
      </div>
    </div>
  );
};

export default Login;
