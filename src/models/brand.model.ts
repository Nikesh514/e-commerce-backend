import mongoose from "mongoose";
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Brand name is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    logo: {
        path: { type: String },
        public_id: { type: String },
    }
})

const Brand = mongoose.model("brand", brandSchema)
export default Brand