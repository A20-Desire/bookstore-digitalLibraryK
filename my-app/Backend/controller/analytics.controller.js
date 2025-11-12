import Book from "../model/book.model.js";
import Comment from "../model/comment.model.js";
import User from "../model/user.model.js";

export const getDashboardMetrics = async (_req, res) => {
    try {
        const [bookCount, userCount, commentCount, topBooks] = await Promise.all([
            Book.countDocuments(),
            User.countDocuments(),
            Comment.countDocuments(),
            Book.find().sort({ downloadCount: -1 }).limit(5).select("title author downloadCount viewCount"),
        ]);

        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("username email role createdAt");

        res.json({
            stats: {
                books: bookCount,
                users: userCount,
                comments: commentCount,
            },
            topBooks,
            recentUsers,
        });
    } catch (error) {
        console.error("Analytics error", error);
        res.status(500).json({ message: "Failed to load analytics" });
    }
};
