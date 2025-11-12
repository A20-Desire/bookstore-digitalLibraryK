import express from "express";
import {
	createBook,
	deleteBook,
	getBookById,
	getBooks,
	getFeaturedBooks,
	searchBooks,
	trackDownload,
	updateBook,
} from "../controller/book.controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware.js";
import { uploadBookAssets } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", authenticate, getBooks);
router.get("/featured", authenticate, getFeaturedBooks);
router.get("/search", authenticate, searchBooks);
router.get("/:id", authenticate, getBookById);

router.post(
	"/",
	authenticate,
	authorizeRoles("admin", "moderator"),
	uploadBookAssets,
	createBook
);

router.patch(
	"/:id",
	authenticate,
	authorizeRoles("admin", "moderator"),
	uploadBookAssets,
	updateBook
);

router.delete(
	"/:id",
	authenticate,
	authorizeRoles("admin"),
	deleteBook
);

router.post("/:id/track-download", authenticate, trackDownload);

export default router;
