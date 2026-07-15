import mongoose from "mongoose";

const ProductVariantSchema = new mongoose.Schema({
    volume: { 
        type: String,
        enum: ['100g', '50g','30ml','50ml', '100ml', '200ml'], 
        required: [true, 'Variant ka volume zaroori hai']
    },
    price: { 
        type: Number, 
        required: [true, 'Is variant ki offer price zaroori hai'], 
        min: 0 
    },
    comparePrice: { 
        type: Number, 
        min: 0 
    },
    stock: { 
        type: Number, 
        required: true, 
        default: 10 
    }
});

const SimpleProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name zaroori hai'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description zaroori hai'],
        trim: true
    },
    batchNumber: {
        type: String, 
        default: 'BATCH-GR-014'
    },
    imagepath: {
        type: String,
        required: [true, 'Product image path zaroori hai']
    },
    galleryImages: [{ 
        type: String
    }],
    
    // Yahan array hai, jisse admin ek product ke andar kai volumes (100ml, 200ml) daal sakega
    variants: {
        type: [ProductVariantSchema],
        validate: [v => v.length > 0, 'Kam se kam ek product variant (volume/price) hona zaroori hai']
    },

    isAvailable: { 
        type: Boolean, 
        default: true 
    },
    rating: {
        type: Number,
        default: 4.5,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const SimpleProduct = mongoose.model('SimpleProduct', SimpleProductSchema);

export default SimpleProduct;