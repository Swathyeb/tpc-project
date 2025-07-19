import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'; 

export const test = (req, res) => {
  res.json({ message: 'API is working' });
};

export const registerStudent = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    const { name, dob, email, phone, registerNumber, image, password, ...otherFields } = req.body;

    // Validate required fields
    if (!name || !dob || !email || !phone || !registerNumber || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Hash the password with a salt round of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new student record
    const newUser = new User({
      name,
      dob,
      email,
      phone,
      registerNumber,
      image,
      password: hashedPassword, // Save the hashed password
      ...otherFields,
    });

    await newUser.save();
    res.status(201).json({ message: "Student registered successfully!", user: newUser });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ message: "Error registering student", error: error.message });
  }
};


export const Login = async (req, res) => {
  const { name, password } = req.body;

  // Check if both fields are provided
  if (!name || !password || name.trim() === '' || password.trim() === '') {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Find user by name
    const validUser = await User.findOne({ name });
    if (!validUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid name or password' });
    }

    // Send response without password, but include user ID
    const { password: pass, ...rest } = validUser._doc; // Exclude password
    res.status(200).json({ _id: validUser._id, ...rest }); // Send user ID and other data
  } catch (err) {
    console.error('Login error:', err); // Log error details for debugging
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the request parameters
    const user = await User.findById(userId); // Find user by ID

    if (user) {
      res.json({
        name: user.name,
        image: user.image,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

export const userdetails = async (req, res) => {
  try {
    const { id } = req.params; // Get userId from request params
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      name: user.name,
      image: user.image,
      branch: user.branch,
      semester: user.semester,
      phone: user.phone,
      email: user.email,
      address: user.address,
      gender: user.gender,
      dob: user.dob,
      nationality: user.nationality,
      skills: user.skills,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

export const deleteUser=async(req,res,next)=> {
  try {
      const user = await User.findByIdAndDelete(req.params.userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }
      res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
      res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('access_token', {
        httpOnly: true,
        sameSite: 'lax', // Prevent CSRF attacks
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      })
      .status(200)
      .json({ message: 'User has been signed out' });
  } catch (error) {
    next(error);
  }
};


export const updateDetails = async (req, res) =>  {
  try {
    const user = await User.findOne({ name: req.params.name });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const edit = async (req, res) => {
  try {
    const { name } = req.params;
    const updatedUser = await User.findOneAndUpdate({ name }, req.body, { new: true, runValidators: true });

    if (!updatedUser) {
        return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send(updatedUser);
} catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send({ message: 'Server error' });
}
};

export const allUsers = async (req, res) =>{
  try {
    const users = await User.find().select('-password'); // Exclude passwords from the response
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
};

// Delete a user by ID
export const deleteusers = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error });
  }
};

export const updateuser = async (req, res) =>{
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};


export const createuser = async (req, res) =>{
  const {
    name,
    password,
    dob,
    nationality,
    gender,
    differentlyAbled,
    areaOfInterest,
    phone,
    email,
    year,
    semester,
    branch,
    cgpa,
    registerNumber,
  } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      password: hashedPassword,
      dob,
      nationality,
      gender,
      differentlyAbled,
      areaOfInterest,
      phone,
      email,
      year,
      semester,
      branch,
      cgpa,
      registerNumber,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully!', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};


export const filter = async (req, res) =>{
  try {
    const { name, semester, cgpa } = req.query;

    // Build dynamic filter object based on query params
    const filter = {};
    if (name) filter.name = new RegExp(name, 'i'); // Case-insensitive search
    if (semester) filter.semester = Number(semester);
    if (cgpa) filter.cgpa = cgpa;

    const users = await User.find(filter);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};


// user.controller.js
export const sendmessage = async (req, res) => {
  const { senderId, recipientId, content } = req.body;

  if (!senderId || !recipientId || !content) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newMessage = new Message({ sender: senderId, recipient: recipientId, content });
    await newMessage.save();
    res.status(201).json({ success: true, message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
