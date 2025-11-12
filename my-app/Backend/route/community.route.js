import express from "express";
import {
    createComment,
    deleteComment,
    getBookDiscussion,
    replyToComment,
    toggleCommentFlag,
    toggleReaction,
} from "../controller/community.controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.get("/:bookId", authenticate, getBookDiscussion);
router.post("/:bookId", authenticate, createComment);
router.post("/:bookId/:commentId/reply", authenticate, replyToComment);
router.post("/:bookId/:commentId/react", authenticate, toggleReaction);
router.patch(
    "/:bookId/:commentId/flag",
    authenticate,
    authorizeRoles("admin", "moderator"),
    toggleCommentFlag
);
router.delete(
    "/:bookId/:commentId",
    authenticate,
    deleteComment
);

export default router;
