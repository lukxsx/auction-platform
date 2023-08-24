import multer, { FileFilterCallback } from "multer";
import express from "express";
import path from "path";
import sharp from "sharp";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, "./uploads/");
    },
    filename: (req, file, callback) => {
        const itemId = req.params.itemId;

        const uploadedFilename = `${itemId}-${file.originalname}`;

        callback(null, uploadedFilename);
    },
});

// Check if file is image by the extension
const fileFilter = (
    _req: express.Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    const fileExt = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(fileExt)) {
        callback(null, true);
    } else {
        callback(new Error("Only JPG, JPEG, and PNG files are allowed"));
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/:itemId", upload.single("file"), async (req, res) => {
    const uploadedFile = req.file;
    if (uploadedFile) {
        console.log(`Uploaded File: ${uploadedFile.originalname}`);
        console.log(uploadedFile.filename);
        const thumbnailFilename = "thumbnail-" + uploadedFile.filename;
        const thumbnailPath = path.join("./uploads/", thumbnailFilename);
        await sharp(uploadedFile.path)
            .resize({ width: 286, height: 180 })
            .jpeg({ quality: 80 })
            .toFile(thumbnailPath);
    }

    res.send("File uploaded");
});

export default router;
