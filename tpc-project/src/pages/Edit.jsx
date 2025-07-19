
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserByEmail, updateUser } from '../redux/user/userEditSlice.js';

const Edit = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.userEdit);
  const [skills, setSkills] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    semester: '',
    phone: '',
    email: '',
    gender: '',
    dob: '',
    nationality: '',
    skills: [],
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    dispatch(fetchUserByEmail('test@example.com'));
  }, [dispatch]);

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);
// Add this function within your Edit component
const handleResumeFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setIsUploading(true); // Show upload indicator

    // Your Firebase upload logic here
    const storageRef = app.storage().ref(); // Assuming `app` is your Firebase instance
    const resumeRef = storageRef.child(`resumes/${user._id}_${file.name}`);
    const uploadTask = resumeRef.put(file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress); // Update progress state
      },
      (error) => {
        console.error("Upload failed:", error);
        setIsUploading(false);
      },
      async () => {
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
        setFormData((prevData) => ({ ...prevData, resumeUrl: downloadURL })); // Save resume URL
        setIsUploading(false);
      }
    );
  }
};

const handleDocumentFilesChange = (event) => {
  const files = event.target.files;
  const storage = getStorage(); // Firebase storage instance
  const [uploadProgress, setUploadProgress] = useState([]);
  const [uploadedFileUrls, setUploadedFileUrls] = useState([]);

  Array.from(files).forEach((file, index) => {
      // Create a reference for each file in Firebase Storage
      const storageRef = ref(storage, `documents/${file.name}`);
      
      // Start the file upload
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
          "state_changed",
          (snapshot) => {
              // Calculate upload progress for each file
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done for file: ${file.name}`);
              
              // Update the upload progress state
              setUploadProgress((prevProgress) => {
                  const updatedProgress = [...prevProgress];
                  updatedProgress[index] = progress;
                  return updatedProgress;
              });
          },
          (error) => {
              console.error("Upload failed:", error);
          },
          async () => {
              // Get the download URL after upload is complete
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("File available at:", downloadURL);
              
              // Add the URL to the uploaded files state
              setUploadedFileUrls((prevUrls) => [...prevUrls, downloadURL]);
          }
      );
  });
};
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    const input = e.target.value;
    const skillsArray = input.split(',').map(skill => skill.trim()); // Split and trim each skill
    setFormData({ ...formData, skills: skillsArray });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      await dispatch(updateUser({ userId: user._id, ...formData }));
      alert("Profile updated successfully!");
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please check the console for more details.');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center p-5 bg-gray-100">
      <form className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md mt-5" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        <div className="mb-4">
          
          <label className="block text-sm font-medium mb-1">Name:</label>
        <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border rounded-lg w-full p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Branch:</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            required
            className="border rounded-lg w-full p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Semester:</label>
          <input
            type="text"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
            className="border rounded-lg w-full p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="border rounded-lg w-full p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border rounded-lg w-full p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="border rounded-lg w-full p-2"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className="border rounded-lg w-full p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nationality:</label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
            className="border rounded-lg w-full p-2"
          />
        </div>

        <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Skills (comma-separated):</label>
      <input
        type="text"
        name="skills"
        value={formData.skills.join(', ')} // Display as comma-separated string
        onChange={handleSkillsChange}
        required
        className="border rounded-lg w-full p-2"
      />
    </div>
    <div className="mb-4">
  <label className="block text-sm font-medium mb-1">Upload Resume:</label>
  <input
    type="file"
    onChange={handleResumeFileChange}
    className="border rounded-lg w-full p-2"
  />
  {isUploading && <p>Upload Progress: {uploadProgress}%</p>}
</div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Document Uploads:</label>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleDocumentFilesChange}
            className="border rounded-lg w-full p-2"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg w-full">
          {isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Update Profile'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Edit;
