import mongoose from "mongoose";

const cafeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        location: { type: String, required: true },
        description: { type: String, required: true },
        images: [{ type: String, required: true }], // Store local file paths
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        reviews: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                rating: { type: Number, required: true, min: 1, max: 5 },
                comment: { type: String, required: true },
            },
        ],
    },
    { timestamps: true }
);

const Cafe = mongoose.model("Cafe", cafeSchema);
export default Cafe;
