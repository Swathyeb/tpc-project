
import React, { useState, useEffect } from 'react';

function FilterUsers() {
  const [filters, setFilters] = useState({ name: '', semester: '', cgpa: '' });
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', semester: '', cgpa: '' });

  // Fetch filtered users
  const fetchUsers = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`http://localhost:3000/api/user?${query}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchUsers(); // Refresh user list
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/user/update/${editUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setEditUser(null); // Clear edit form
        fetchUsers(); // Refresh user list
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Open edit form with selected user data
  const openEditForm = (user) => {
    setEditUser(user);
    setFormData({ name: user.name, semester: user.semester, cgpa: user.cgpa });
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Filter Users</h2>

      {/* Filter Form */}
      <div className="mb-6">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={filters.name}
          onChange={handleFilterChange}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          name="semester"
          placeholder="Semester"
          value={filters.semester}
          onChange={handleFilterChange}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          name="cgpa"
          placeholder="CGPA"
          value={filters.cgpa}
          onChange={handleFilterChange}
          className="border p-2"
        />
      </div>

      {/* User List */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Semester</th>
            <th className="p-2 text-left">CGPA</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.semester}</td>
              <td className="p-2">{user.cgpa}</td>
              <td className="p-2">
                <button
                  onClick={() => openEditForm(user)}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Form */}
      {editUser && (
        <form onSubmit={handleEditSubmit} className="mt-6 p-4 border">
          <h3 className="text-xl font-semibold mb-4">Edit User</h3>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="number"
            name="semester"
            placeholder="Semester"
            value={formData.semester}
            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            name="cgpa"
            placeholder="CGPA"
            value={formData.cgpa}
            onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2">Save</button>
          <button type="button" onClick={() => setEditUser(null)} className="ml-2 px-4 py-2 bg-gray-500 text-white">Cancel</button>
        </form>
      )}
    </div>
  );
}

export default FilterUsers;