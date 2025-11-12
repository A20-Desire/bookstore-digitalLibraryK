import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ["admin", "moderator", "user"],
        default: "user",
        index: true,
    },
    preferredLanguage: {
        type: String,
        default: "en",
    },
    avatarUrl: {
        type: String,
    },
    lastLoginAt: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
});

userSchema.index({ username: "text", email: "text" });
const User = mongoose.model("User", userSchema);
export default User;
