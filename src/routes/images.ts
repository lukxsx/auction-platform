import multer, { FileFilterCallback } from "multer";
import express from "express";
import itemService from "../services/items";
import path from "path";
import sharp from "sharp";

const router = express.Router();

router.use("/", express.static(path.join(__dirname, "../../uploads")));

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, "./uploads/");
    },
    filename: (req, file, callback) => {
        // Naming scheme: itemId-randomized-name
        const randomName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const itemId = req.params.itemId;
        const uploadedFilename =
            itemId + "-" + randomName + path.extname(file.originalname);
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
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(extension)) {
        callback(null, true);
    } else {
        callback(new Error("Only JPG, JPEG, and PNG files are allowed"));
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Image upload route
router.post("/:itemId", upload.single("file"), async (req, res) => {
    const itemId = req.params.itemId;
    try {
        // Check if item exists
        const item = await itemService.getItemByIdWithoutBids(
            parseInt(itemId, 10)
        );

        if (!item) {
            res.status(404).json({ error: "item not found" });
            return;
        }

        const uploadedFile = req.file;
        // Check if file is uploaded
        if (!uploadedFile) {
            res.status(400).json({ error: "upload failed" });
            return;
        }

        // Create thumbnail
        const thumbnailFilename = "small-" + uploadedFile.filename;
        const thumbnailPath = path.join("./uploads/", thumbnailFilename);
        // Resize and compress
        await sharp(uploadedFile.path)
            .resize({ width: 286, height: 180 })
            .jpeg({ quality: 80 })
            .toFile(thumbnailPath);

        // Add filename to the item row
        item.image_filename = uploadedFile.filename;
        await itemService.updateItem(item.id, item);

        console.log(
            "Image",
            uploadedFile.filename,
            "uploaded for item",
            item.id
        );

        res.json({ item_id: item.id, filename: uploadedFile.filename }).end();
    } catch (error: unknown) {
        let errorMessage = "Error adding image";
        if (error instanceof Error) {
            errorMessage += ": " + error.message;
        }
        res.status(400).send({ error: errorMessage });
    }
});

export default router;
