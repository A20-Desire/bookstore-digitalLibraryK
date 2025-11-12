import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_ROOT = path.join(__dirname, "..", "uploads");

const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const subFolder = file.fieldname === "coverImage" ? "covers" : "books";
        const destinationPath = path.join(UPLOAD_ROOT, subFolder);
        ensureDir(destinationPath);
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        const safeName = file.originalname.replace(/[^a-zA-Z0-9-_\.]/g, "_");
        cb(null, `${timestamp}-${safeName}${extension}`);
    }
});

const FILE_LIMIT_MB = parseInt(process.env.UPLOAD_SIZE_MB || "20", 10);

const fileFilter = (req, file, cb) => {
    if (file.fieldname === "coverImage") {
        return cb(null, /^image\/(png|jpeg|jpg|webp)$/i.test(file.mimetype));
    }
    if (file.fieldname === "bookFile") {
        return cb(null, /application\/(pdf|epub\+zip)$/i.test(file.mimetype) || file.mimetype === "application/epub+zip");
    }
    cb(null, false);
};

export const uploadBookAssets = multer({
    storage,
    limits: { fileSize: FILE_LIMIT_MB * 1024 * 1024 },
    fileFilter,
}).fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
]);

export const mapUploadedFilePaths = (files) => {
    const normalized = {};
    if (files?.coverImage?.[0]) {
        normalized.coverImageUrl = `/uploads/covers/${path.basename(files.coverImage[0].path)}`;
    }
    if (files?.bookFile?.[0]) {
        normalized.fileUrl = `/uploads/books/${path.basename(files.bookFile[0].path)}`;
        normalized.fileType = files.bookFile[0].mimetype.includes("pdf") ? "pdf" : "epub";
        normalized.fileSizeKb = Math.round(files.bookFile[0].size / 1024);
    }
    return normalized;
};
