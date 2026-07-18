import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    category: { type: String },
    tags: [{ type: String }],
    keywords: [{ type: String }],
    coverImageUrl: { type: String },
    ogImageUrl: { type: String },
    schemaMarkup: { type: String }, // Stores raw JSON string
    content: { type: String, required: true }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;