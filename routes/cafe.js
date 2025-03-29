import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import Cafe from "../models/Cafe.js"
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// ✅ Create folder for storing images (if not exists)
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer setup for storing images locally
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// ✅ Add café route
router.post("/", authenticateUser, upload.array("images", 5), async (req, res) => {
    try {
        const { name, location, description } = req.body;
        const imagePaths = req.files.map((file) => file.path);

        const newCafe = new Cafe({
            name,
            location,
            description,
            images: imagePaths,
            user: req.user.id,
        });

        await newCafe.save();
        res.status(201).json(newCafe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});


router.get("/", async (req, res) => {
    try {
        const cafes = await Cafe.find().populate("user", "name"); // Populate user data
        res.json(cafes);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
export default router;
