import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "development-secret";

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.sub);

        if (!user || !user.isActive) {
            return res.status(401).json({ message: "Invalid authentication" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error", error);
        res.status(401).json({ message: "Authentication failed" });
    }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
};
