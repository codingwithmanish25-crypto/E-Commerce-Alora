import Post from '../models/Post.js';

export const createPost = async (req, res) => {
    try {
        const data = { ...req.body };

        // Process array inputs split by commas
        if (data.tags) data.tags = data.tags.split(',').map(t => t.trim());
        if (data.keywords) data.keywords = data.keywords.split(',').map(k => k.trim());

        // Handle File uploads if present
        if (req.files) {
            if (req.files.coverImageFile) {
                data.coverImageUrl = `/uploads/${req.files.coverImageFile[0].filename}`;
            }
            if (req.files.ogImageFile) {
                data.ogImageUrl = `/uploads/${req.files.ogImageFile[0].filename}`;
            }
        }

        const newPost = new Post(data);
        await newPost.save();

        res.status(201).json({ success: true, message: 'SEO Post published successfully!', post: newPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const uploadEditorImage = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        const url = `/uploads/${req.file.filename}`;
        res.status(200).json({ success: true, url });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};