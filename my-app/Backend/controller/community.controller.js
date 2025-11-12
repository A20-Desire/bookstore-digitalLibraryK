import Comment from "../model/comment.model.js";

export const getBookDiscussion = async (req, res) => {
    try {
        const comments = await Comment.find({ book: req.params.bookId, parentComment: null })
            .populate("author", "username role avatarUrl")
            .populate({
                path: "replies",
                populate: { path: "author", select: "username role avatarUrl" },
            })
            .sort({ createdAt: -1 });
        res.json({ comments });
    } catch (error) {
        console.error("Get discussion error", error);
        res.status(500).json({ message: "Failed to load discussion" });
    }
};

export const createComment = async (req, res) => {
    try {
        const { content, translatedVariants } = req.body;
        if (!content?.trim()) {
            return res.status(400).json({ message: "Comment content is required" });
        }

        const comment = await Comment.create({
            book: req.params.bookId,
            author: req.user._id,
            content: content.trim(),
            translatedVariants,
        });

        const populated = await comment.populate("author", "username role avatarUrl");
        res.status(201).json({ message: "Comment added", comment: populated });
    } catch (error) {
        console.error("Create comment error", error);
        res.status(500).json({ message: "Failed to add comment" });
    }
};

export const replyToComment = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content?.trim()) {
            return res.status(400).json({ message: "Reply content is required" });
        }

        const parentComment = await Comment.findById(req.params.commentId);
        if (!parentComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const reply = await Comment.create({
            book: parentComment.book,
            author: req.user._id,
            content: content.trim(),
            parentComment: parentComment._id,
        });

        parentComment.replies.push(reply._id);
        await parentComment.save();

        const populated = await reply.populate("author", "username role avatarUrl");
        res.status(201).json({ message: "Reply added", comment: populated });
    } catch (error) {
        console.error("Reply comment error", error);
        res.status(500).json({ message: "Failed to add reply" });
    }
};

export const toggleCommentFlag = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        comment.isFlagged = !comment.isFlagged;
        comment.flaggedReason = req.body.flaggedReason || comment.flaggedReason;
        await comment.save();
        res.json({ message: "Flag status updated", comment });
    } catch (error) {
        console.error("Toggle flag error", error);
        res.status(500).json({ message: "Failed to update flag" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (String(comment.author) !== String(req.user._id) && !["admin", "moderator"].includes(req.user.role)) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        await Comment.deleteMany({ parentComment: comment._id });
        await comment.deleteOne();

        res.json({ message: "Comment deleted" });
    } catch (error) {
        console.error("Delete comment error", error);
        res.status(500).json({ message: "Failed to delete comment" });
    }
};

export const toggleReaction = async (req, res) => {
    try {
        const { reaction } = req.body;
        if (!["like", "insightful"].includes(reaction)) {
            return res.status(400).json({ message: "Unsupported reaction" });
        }

        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        comment.reactions[reaction] += 1;
        await comment.save();
        res.json({ message: "Reaction recorded", comment });
    } catch (error) {
        console.error("Toggle reaction error", error);
        res.status(500).json({ message: "Failed to record reaction" });
    }
};
