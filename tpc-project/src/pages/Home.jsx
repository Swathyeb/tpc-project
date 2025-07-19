

// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";

// function Home() {
//   const currentUser = useSelector((state) => state.user.currentUser);
//   const [users, setUsers] = useState([]);
//   const [userCount, setUserCount] = useState(0);

//   useEffect(() => {
//     if (currentUser?.isAdmin) {
//       fetchUsers();
//     }
//   }, [currentUser]);

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/api/user/all', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch users');
//       }

//       const data = await response.json();
//       setUsers(data);
//       setUserCount(data.length);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     try {
//       const response = await fetch(`http://localhost:3000/api/user/delete/${userId}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         alert('User deleted successfully!');
//         setUsers(users.filter((user) => user._id !== userId));
//       } else {
//         alert('Failed to delete user.');
//       }
//     } catch (error) {
//       console.error('Error deleting user:', error);
//     }
//   };

//   return (
//     <div className="p-6">
//       <section className="mb-8">
//         <h1 className="text-4xl font-bold text-center">
//           {currentUser?.isAdmin ? "Welcome to the Admin Dashboard" : "Welcome to TPC Home"}
//         </h1>
//         <p className="mt-4 text-lg text-center">
//           {currentUser?.isAdmin
//             ? "Manage users, view statistics, and control the admin panel."
//             : "This is the home page of the Training and Placement Cell."}
//         </p>
//       </section>

//       {/* User Count for Admin */}
//       {currentUser?.isAdmin && (
//         <section className="mb-8">
//           <h2 className="text-3xl font-bold text-center">Total Users: {userCount}</h2>
//           <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
//             {users.map((user) => (
//               <li key={user._id} className="p-4 border rounded-lg shadow-lg flex justify-between items-center">
//                 <div>
//                   <h3 className="text-xl font-semibold">{user.username}</h3>
//                   <p className="text-sm text-gray-600">{user.email}</p>
//                 </div>
//                 <button
//                   onClick={() => handleDeleteUser(user._id)}
//                   className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200"
//                 >
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </section>
//       )}

//       {/* Other Sections... */}
//     </div>
//   );
// }

// export default Home;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Home() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);

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
      } else {
        alert('Failed to delete user.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="p-6">
      <section className="mb-8">
        <h1 className="text-4xl font-bold text-center">
          {currentUser?.isAdmin ? "Welcome to the Admin Dashboard" : "Welcome to TPC Home"}
        </h1>
        <p className="mt-4 text-lg text-center">
          {currentUser?.isAdmin
            ? "Manage users, view statistics, and control the admin panel."
            : "This is the home page of the Training and Placement Cell."}
        </p>
      </section>

      {/* User Count for Admin */}
      {currentUser?.isAdmin && (
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-center">Total Users: {userCount}</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {users.map((user) => (
              <li key={user._id} className="p-4 border rounded-lg shadow-lg">
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-600">Email: {user.email}</p>
                  <p className="text-sm text-gray-600">Phone: {user.phone}</p>
                  <p className="text-sm text-gray-600">DOB: {new Date(user.dob).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Nationality: {user.nationality}</p>
                  <p className="text-sm text-gray-600">Gender: {user.gender}</p>
                  <p className="text-sm text-gray-600">Differently Abled: {user.differentlyAbled}</p>
                  <p className="text-sm text-gray-600">Area of Interest: {user.areaOfInterest}</p>
                  <p className="text-sm text-gray-600">Year: {user.year}</p>
                  <p className="text-sm text-gray-600">Semester: {user.semester}</p>
                  <p className="text-sm text-gray-600">Branch: {user.branch}</p>
                  <p className="text-sm text-gray-600">Register Number: {user.registerNumber}</p>
                  <p className="text-sm text-gray-600">Skills: {user.skills.join(', ')}</p>
                </div>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200 mt-4"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Other Sections... */}
    </div>
  );
}

export default Home;

