
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCurrentUser } from '../redux/user/userSlice.js';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase.js';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    skills: [],
    resume: '',
    documents: [],
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        branch: currentUser.branch,
        semester: currentUser.semester,
        phone: currentUser.phone,
        gender: currentUser.gender || '',
        skills: currentUser.skills || [],
        resume: currentUser.resume || '',
        documents: currentUser.documents || [],
      });
      setLoading(false);
    } else {
      setError('No user data available.');
      setLoading(false);
    }
  }, [currentUser]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options).replace(/\//g, '-');
  };

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSkillChange = (e) => {
    const { value } = e.target;
    const skillsArray = value.split(',').map((skill) => skill.trim());
    setFormData((prevData) => ({ ...prevData, skills: skillsArray }));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `resumes/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setIsUploading(true);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Error uploading resume:', error);
        setIsUploading(false);
      },
      async () => {
        const url = await getDownloadURL(storageRef);
        setFormData((prevData) => ({ ...prevData, resume: url }));
        setUploadProgress(0);
        setIsUploading(false);
      }
    );
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    const documentURLs = [];

    setIsUploading(true);
    files.forEach((file) => {
      const documentRef = ref(storage, `documents/${file.name}`);
      const uploadTask = uploadBytesResumable(documentRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Error uploading document:', error);
          setIsUploading(false);
        },
        async () => {
          const url = await getDownloadURL(documentRef);
          documentURLs.push(url);

          if (documentURLs.length === files.length) {
            setFormData((prevData) => ({ ...prevData, documents: [...prevData.documents, ...documentURLs] }));
            setUploadProgress(0);
            setIsUploading(false);
          }
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...currentUser,
      ...formData,
      gender: formData.gender.toLowerCase(),
    };

    try {
      const response = await fetch(`http://localhost:3000/api/user/users/${currentUser.name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      dispatch(setCurrentUser(data));
      console.log('User updated successfully:', data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user data:', error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }


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
    <div className="flex flex-col h-screen p-5 bg-gray-100">
      <nav className="w-full flex justify-between bg-blue-500 p-4 text-white">
        <a href="/dashboard" className="font-bold">Back to Dashboard</a>
        {/* <a href="/logout" className="font-bold">Logout</a> */}
        <button
                onClick={handleSignOut}
                className="text-white hover:underline"
              >
                Logout
              </button>
      </nav>

      <div className="flex-grow flex justify-center items-center mt-5">
        <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Student Profile</h1>

          <form onSubmit={handleSubmit}>
            <div className="flex items-center mb-4">
              <img
                id="student-photo"
                src={currentUser?.image || 'default-avatar.png'}
                alt="Student"
                className="w-32 h-32 rounded-full border-4 border-blue-500 mr-4"
              />
              <div className="profile-info flex-grow">
                <h2 id="student-name" className="text-xl font-semibold">{currentUser?.name || 'Loading...'}</h2>
                <p><strong>Branch:</strong> {isEditing ? (
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch || ''}
                    onChange={handleChange}
                    className="border p-2 rounded mb-2 w-full"
                  />
                ) : (
                  currentUser?.branch || 'N/A'
                )}</p>
                <p><strong>Semester:</strong> {isEditing ? (
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester || ''}
                    onChange={handleChange}
                    className="border p-2 rounded mb-2 w-full"
                  />
                ) : (
                  currentUser?.semester || 'N/A'
                )}</p>
                <p><strong>Phone:</strong> {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="border p-2 rounded mb-2 w-full"
                  />
                ) : (
                  currentUser?.phone || 'N/A'
                )}</p>
                <p><strong>Email:</strong> {currentUser?.email || 'N/A'}</p>
                <p><strong>Gender:</strong> {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleChange}
                    className="border p-2 rounded mb-2 w-full"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  currentUser?.gender || 'N/A'
                )}</p>
                <p><strong>Date of Birth:</strong> {currentUser?.dob ? formatDate(currentUser.dob) : 'N/A'}</p>
                <p><strong>Nationality:</strong> {currentUser?.nationality || 'N/A'}</p>

                <p><strong>Skills:</strong> {isEditing ? (
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills.join(', ') || ''}
                    onChange={handleSkillChange}
                    placeholder="Enter skills, separated by commas"
                    className="border p-2 rounded mb-2 w-full"
                  />
                ) : (
                  currentUser?.skills.join(', ') || 'N/A'
                )}</p>

                <label className="block text-gray-700 font-semibold mt-2">Resume:</label>
                {isEditing ? (
                  <div className="mb-2">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="border p-2 rounded"
                    />
                    {isUploading && (
                      <p className="text-blue-500 mt-2">Uploading: {uploadProgress}%</p>
                    )}
                  </div>
                ) : (
                  formData.resume && (
                    <a
                      href={formData.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Resume
                    </a>
                  )
                )}

                <label className="block text-gray-700 font-semibold mt-2">Documents:</label>
                {isEditing ? (
                  <div className="mb-2">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      multiple
                      onChange={handleDocumentUpload}
                      className="border p-2 rounded"
                    />
                    {isUploading && (
                      <p className="text-blue-500 mt-2">Uploading: {uploadProgress}%</p>
                    )}
                  </div>
                ) : (
                  formData.documents.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {formData.documents.map((doc, index) => (
                        <li key={index}>
                          <a
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            View Document {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No documents uploaded.</p>
                  )
                )}

                <div className="flex mt-4">
                  <button
                    type="button"
                    onClick={handleEditProfile}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                  {isEditing && (
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
