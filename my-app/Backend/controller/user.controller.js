import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "development-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const ADMIN_INVITE_CODE = process.env.ADMIN_INVITE_CODE || null;

const sanitizeUser = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    preferredLanguage: user.preferredLanguage,
    avatarUrl: user.avatarUrl,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
});

const signToken = (user) =>
    jwt.sign(
        {
            sub: user._id,
            role: user.role,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

export const signup = async (req, res) => {
    try {
        const { username, email, password, preferredLanguage, role, inviteCode } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email, and password are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        let roleToAssign = "user";
        if (role === "admin") {
            const adminExists = await User.exists({ role: "admin" });
            if (!adminExists || (ADMIN_INVITE_CODE && inviteCode === ADMIN_INVITE_CODE)) {
                roleToAssign = "admin";
            }
        } else if (role === "moderator") {
            if (inviteCode && ADMIN_INVITE_CODE && inviteCode === ADMIN_INVITE_CODE) {
                roleToAssign = "moderator";
            }
        }

        const hashPassword = await bcryptjs.hash(password, 10);
        const createdUser = await User.create({
            username,
            email,
            password: hashPassword,
            preferredLanguage: preferredLanguage || "en",
            role: roleToAssign,
        });

        const token = signToken(createdUser);

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: sanitizeUser(createdUser),
        });
    } catch (error) {
        console.error("Signup error", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        user.lastLoginAt = new Date();
        await user.save();

        const token = signToken(user);

        res.status(200).json({
            message: "Login successful",
            token,
            user: sanitizeUser(user),
        });
    } catch (error) {
        console.error("Login error", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getProfile = async (req, res) => {
    res.json({ user: sanitizeUser(req.user) });
};

export const updateProfile = async (req, res) => {
    try {
        const updates = {};
        if (req.body.username) updates.username = req.body.username;
        if (req.body.preferredLanguage) updates.preferredLanguage = req.body.preferredLanguage;
        if (req.body.avatarUrl) updates.avatarUrl = req.body.avatarUrl;

        if (req.body.password) {
            updates.password = await bcryptjs.hash(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
        res.json({ message: "Profile updated", user: sanitizeUser(updatedUser) });
    } catch (error) {
        console.error("Profile update error", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const listUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json({ users: users.map(sanitizeUser) });
    } catch (error) {
        console.error("List users error", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!["admin", "moderator", "user"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Role updated", user: sanitizeUser(user) });
    } catch (error) {
        console.error("Update role error", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deactivateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deactivated", user: sanitizeUser(user) });
    } catch (error) {
        console.error("Deactivate user error", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
