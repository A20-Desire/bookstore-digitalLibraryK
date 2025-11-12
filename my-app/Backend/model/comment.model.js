import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
        index: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
    },
    translatedVariants: [{
        language: String,
        text: String,
    }],
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    },
    isFlagged: {
        type: Boolean,
        default: false,
    },
    flaggedReason: String,
    reactions: {
        like: {
            type: Number,
            default: 0,
        },
        insightful: {
            type: Number,
            default: 0,
        },
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }]
}, {
    timestamps: true,
});

commentSchema.index({ content: "text" });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
