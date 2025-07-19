import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Adminp = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    password: '',
    dob: '',
    nationality: '',
    gender: '',
    differentlyAbled: '',
    areaOfInterest: '',
    phone: '',
    email: '',
    year: '',
    semester: '',
    branch: '',
    cgpa: '',
    registerNumber: '',
  });

  // Function to toggle the modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) { // If the modal is being opened
      setIsEditing(false); // Reset to adding mode
      setEditingUser(null); // Clear editing user
      setNewUser({ // Reset newUser state to default
        name: '',
        password: '',
        dob: '',
        nationality: '',
        gender: '',
        differentlyAbled: '',
        areaOfInterest: '',
        phone: '',
        email: '',
        year: '',
        semester: '',
        branch: '',
        cgpa: '',
        registerNumber: '',
      });
    }
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Function to submit the form data for creating a new user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        alert('User created successfully!');
        setIsModalOpen(false);
        fetchUsers(); // Refresh the list after adding a user
      } else {
        alert('Failed to create user.');
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchUsers();
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
      setUserCount(data.length);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/delete/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('User deleted successfully!');
        setUsers(users.filter((user) => user._id !== userId));
        setUserCount((prevCount) => prevCount - 1);
      } else {
        alert('Failed to delete user.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user); // Set the user to be edited
    setIsEditing(true); // Set editing mode to true
    setNewUser({ // Populate the newUser state with the user details for editing
      name: user.name,
      email: user.email,
      dob: user.dob.slice(0, 10), // Format date to YYYY-MM-DD
      nationality: user.nationality,
      gender: user.gender,
      differentlyAbled: user.differentlyAbled,
      areaOfInterest: user.areaOfInterest,
      phone: user.phone,
      year: user.year,
      semester: user.semester,
      branch: user.branch,
      registerNumber: user.registerNumber,
      cgpa: user.cgpa,
    });
    setIsModalOpen(true); // Open the modal for editing
  };

  // Function to save the updated user details
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/user/update/${editingUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert('User updated successfully!');
        setIsEditing(false);
        setIsModalOpen(false);
        setEditingUser(null);
        fetchUsers(); // Refresh the user list after saving
      } else {
        alert('Failed to update user.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        {currentUser?.isAdmin ? "Admin Dashboard" : "Welcome to TPC Home"}
      </h1>
      <div className="flex flex-col items-center">
  <h2 className="mt-6 text-xl font-semibold text-gray-800">Total Users: {userCount}</h2>
  <button
    className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
    onClick={toggleModal}
  >
    Add Student
  </button>
</div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-center text-blue-500">
              {isEditing ? "Edit User" : "Create New User"}
            </h2>
            <form onSubmit={isEditing ? handleUpdateUser : handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newUser.name}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={newUser.password}
                onChange={handleInputChange}
                required={!isEditing} // Require password only when creating a user
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
              <input
                type="date"
                name="dob"
                placeholder="Date of Birth"
                value={newUser.dob}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
              {/* <input
                type="text"
                name="nationality"
                placeholder="Nationality"
                value={newUser.nationality}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-2"
              /> */}
              <select
                name="gender"
                value={newUser.gender}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-2"
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <select
                name="differentlyAbled"
                value={newUser.differentlyAbled}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-2"
              >
                <option value="">Differently Abled</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={newUser.phone}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newUser.email}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
              <input
                type="text"
                name="year"
                placeholder="Year"
                value={newUser.year}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
              <input
                type="text"
                name="semester"
                placeholder="Semester"
                value={newUser.semester}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
              <input
                type="text"
                name="branch"
                placeholder="Branch"
                value={newUser.branch}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
              <input
                type="text"
                name="registerNumber"
                placeholder="Register Number"
                value={newUser.registerNumber}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
              <input
                type="text"
                name="cgpa"
                placeholder="CGPA"
                value={newUser.cgpa}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
              <button
                type="submit"
                className="mt-4 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {isEditing ? "Update User" : "Add User"}
              </button>
            </form>
            <button
              className="mt-2 w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={toggleModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
   
          
      <table className="mt-4 w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-200">
            {["Name", "Email", "Phone", "DOB", "Gender", "Differently Abled", "Year", "Semester", "Branch", "Register Number", "CGPA", "Actions"].map((header) => (
              <th key={header} className="border border-gray-300 p-2">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="border border-gray-300 p-2">{user.name}</td>
              <td className="border border-gray-300 p-2">{user.email}</td>
              <td className="border border-gray-300 p-2">{user.phone}</td>
              <td className="border border-gray-300 p-2">{new Date(user.dob).toLocaleDateString()}</td>

           
              <td className="border border-gray-300 p-2">{user.gender}</td>
              <td className="border border-gray-300 p-2">{user.differentlyAbled ? "Yes" : "No"}</td>
              <td className="border border-gray-300 p-2">{user.year}</td>
              <td className="border border-gray-300 p-2">{user.semester}</td>
              <td className="border border-gray-300 p-2">{user.branch}</td>
              <td className="border border-gray-300 p-2">{user.registerNumber}</td>
              <td className="border border-gray-300 p-2">{user.cgpa}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleEditUser(user)}
                  className="text-yellow-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="ml-2 text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


    </div>
  );
};

export default Adminp;
