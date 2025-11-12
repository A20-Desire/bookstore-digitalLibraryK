import Book from "../model/book.model.js";
import { mapUploadedFilePaths } from "../middleware/upload.middleware.js";

export const getBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.status(200).json({ books });
    } catch (error) {
        console.error("Get books error", error);
        res.status(500).json({ message: "Failed to load books" });
    }
};

export const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate("uploadedBy", "username role");
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        book.viewCount += 1;
        await book.save();
        res.json({ book });
    } catch (error) {
        console.error("Get book error", error);
        res.status(500).json({ message: "Failed to load book" });
    }
};

export const createBook = async (req, res) => {
    try {
        const { title, author, description, category, tags, language, publicationYear, accessLevel, isFeatured } = req.body;
        if (!title || !author) {
            return res.status(400).json({ message: "Title and author are required" });
        }

        const fileMetadata = mapUploadedFilePaths(req.files || {});
        if (!fileMetadata.fileUrl) {
            return res.status(400).json({ message: "Book file is required" });
        }

        const parsedTags = Array.isArray(tags)
            ? tags
            : typeof tags === "string"
                ? tags.split(",").map((tag) => tag.trim()).filter(Boolean)
                : [];

        const book = await Book.create({
            title,
            author,
            description,
            category,
            language,
            tags: parsedTags,
            publicationYear,
            accessLevel,
            isFeatured,
            uploadedBy: req.user._id,
            ...fileMetadata,
        });

        res.status(201).json({ message: "Book uploaded successfully", book });
    } catch (error) {
        console.error("Create book error", error);
        res.status(500).json({ message: "Failed to upload book" });
    }
};

export const updateBook = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (updates.tags && typeof updates.tags === "string") {
            updates.tags = updates.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
        }

        const fileMetadata = mapUploadedFilePaths(req.files || {});
        Object.assign(updates, fileMetadata);

        const book = await Book.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json({ message: "Book updated", book });
    } catch (error) {
        console.error("Update book error", error);
        res.status(500).json({ message: "Failed to update book" });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json({ message: "Book removed" });
    } catch (error) {
        console.error("Delete book error", error);
        res.status(500).json({ message: "Failed to delete book" });
    }
};

export const searchBooks = async (req, res) => {
    try {
        const { query, author, category, language, tags } = req.query;
        const filter = {};

        if (query) {
            filter.$text = { $search: query };
        }
        if (author) filter.author = new RegExp(author, "i");
        if (category) filter.category = category;
        if (language) filter.language = language;
        if (tags) {
            const tagList = tags.split(",").map((tag) => tag.trim()).filter(Boolean);
            if (tagList.length) filter.tags = { $in: tagList };
        }

        const books = await Book.find(filter).sort({ score: { $meta: "textScore" }, createdAt: -1 }).limit(100);
        res.json({ books });
    } catch (error) {
        console.error("Search books error", error);
        res.status(500).json({ message: "Failed to search books" });
    }
};

export const trackDownload = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        book.downloadCount += 1;
        await book.save();
        res.json({ message: "Download tracked" });
    } catch (error) {
        console.error("Track download error", error);
        res.status(500).json({ message: "Failed to track download" });
    }
};

export const getFeaturedBooks = async (req, res) => {
    try {
        const books = await Book.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(10);
        res.json({ books });
    } catch (error) {
        console.error("Featured books error", error);
        res.status(500).json({ message: "Failed to load featured books" });
    }
};
