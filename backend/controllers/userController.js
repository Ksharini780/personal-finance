import User from "../models/UserSchema.js";
import bcrypt from "bcrypt";

// ✅ Register User
export const registerControllers = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please enter all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({ success: true, message: "User created successfully", userId: newUser._id });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Login User
export const loginControllers = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter all fields" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect email or password" });
    }

    return res.status(200).json({ success: true, message: `Welcome back, ${user.name}`, userId: user._id });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Set Avatar
export const setAvatarController = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isAvatarImageSet: true, avatarImage: image },
      { new: true, select: "isAvatarImageSet avatarImage" }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, isSet: updatedUser.isAvatarImageSet, image: updatedUser.avatarImage });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Fetch All Users Except Current User
export const allUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select(["email", "name", "avatarImage", "_id"]);

    return res.status(200).json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
