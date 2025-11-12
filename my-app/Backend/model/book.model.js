import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        trim: true,
        index: true,
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true,
    }],
    language: {
        type: String,
        default: "en",
        index: true,
    },
    publicationYear: Number,
    coverImageUrl: String,
    fileUrl: String,
    fileType: {
        type: String,
        enum: ["pdf", "epub"],
        required: true,
    },
    fileSizeKb: Number,
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    accessLevel: {
        type: String,
        enum: ["public", "students", "staff", "restricted"],
        default: "public",
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    downloadCount: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

bookSchema.index({
    title: "text",
    author: "text",
    description: "text",
    tags: "text",
});
const Book = mongoose.model("Book", bookSchema);

export default Book;
