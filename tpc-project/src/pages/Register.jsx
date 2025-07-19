
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";
import { app, storage } from "../firebase.js"; // Ensure this imports 'storage' correctly
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "female", 
    differentlyAbled: "yes", 
    email: "",
    phone: "",
    registerNumber: "",
    areaOfInterest: "",
    branch: "",
    year: "2022",
    semester: "1",
    image: null,
    password: "", // Add password field
  });
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
  
    if (selectedImage) {
      // If there's an image, upload it first
      setIsUploading(true); // Disable submit button
      await uploadImage(selectedImage);
    } else {
      // If no image, proceed directly to register the student
      await registerStudent(formData);
    }
  };
  
  const uploadImage = async (file) => {
    const storage = getStorage(app);
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress); // Show upload progress
      },
      (error) => {
        console.error("Error uploading image:", error);
        alert("Image upload failed. Please try again.");
        setIsUploading(false); // Re-enable submit button
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("Image uploaded successfully:", downloadURL);
        setFormData((prevData) => ({ ...prevData, image: downloadURL }));
        setIsUploading(false); // Re-enable submit button
  
        // Now proceed to register the student with the image URL
        await registerStudent({ ...formData, image: downloadURL });
      }
    );
  };
  const registerStudent = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/api/user/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      if (response.ok) {
        // Dispatch userId and other user data to Redux
        dispatch(signInSuccess({ ...result.user, userId: result.user._id })); // Make sure to include userId
        alert("Registration successful!");
        navigate("/dashboard");
      } else {
        alert(`Error: ${result.message}`);
        dispatch(signInFailure(result.message));
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Something went wrong. Please try again.");
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-full w-full h-full flex flex-col justify-center">
        <h1 className="text-2xl font-semibold text-center mb-6">Student Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField id="name" label="Name:" value={formData.name} onChange={handleInputChange} />
          <InputField id="dob" type="date" label="Date of Birth:" value={formData.dob} onChange={handleInputChange} />
          <InputField id="nationality" label="Nationality:" value={formData.nationality} onChange={handleInputChange} />
          <InputField id="cgpa" label="Cgpa:" value={formData.cgpa} onChange={handleInputChange} />
          <SelectField
            id="gender"
            label="Gender:"
            value={formData.gender}
            onChange={handleInputChange}
            options={["Female", "Male", "Other"]}
          />
          <SelectField
            id="differentlyAbled"
            label="Differently Abled:"
            value={formData.differentlyAbled}
            onChange={handleInputChange}
            options={["Yes", "No"]}
          />
          <InputField id="areaOfInterest" label="Area of Interest:" value={formData.areaOfInterest} onChange={handleInputChange} />
          <InputField id="phone" type="tel" label="Phone Number:" value={formData.phone} onChange={handleInputChange} />
          <InputField id="email" type="email" label="Email ID:" value={formData.email} onChange={handleInputChange} />
          <InputField id="year" label="Year:" value={formData.year} onChange={handleInputChange} />
          <InputField id="semester" label="Semester:" value={formData.semester} onChange={handleInputChange} />
          <InputField id="branch" label="Branch:" value={formData.branch} onChange={handleInputChange} />
          <InputField id="registerNumber" label="Register Number:" value={formData.registerNumber} onChange={handleInputChange} />
          <InputField id="password" type="password" label="Password:" value={formData.password} onChange={handleInputChange} /> {/* New Password Field */}
          
          <h2 className="text-2xl font-bold mb-4">Upload Your Photo</h2>
          <div className="border-2 border-dashed border-gray-300 w-40 h-40 flex items-center justify-center mb-4 relative">
            {selectedImage ? (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
            ) : (
              <label className="flex items-center justify-center cursor-pointer h-full w-full">
                <span className="text-4xl text-gray-400">+</span>
                <input
                  type="file"
                  className="opacity-0 absolute inset-0 h-full w-full cursor-pointer"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md shadow-md ${
              isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"
            } text-white`}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ id, label, type = "text", value, onChange }) => (
  <label className="block">
    <span className="text-gray-700">{label}</span>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      required
    />
  </label>
);

const SelectField = ({ id, label, value, onChange, options }) => (
  <label className="block">
    <span className="text-gray-700">{label}</span>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      required
    >
      {options.map((option) => (
        <option key={option} value={option.toLowerCase()}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

export default Register;
``
