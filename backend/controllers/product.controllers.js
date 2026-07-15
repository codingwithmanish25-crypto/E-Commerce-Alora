
import SimpleProduct from "../models/product.models.js"
import fs, { unlink } from 'fs';
import path from "path";



// 1. CREATE (Naya Product Add Karna)
    export const addnewproduct = async (req, res) => {
    try {
        
        const { name, description, batchNumber, rating, totalReviews, isAvailable } = req.body;
        
      
        let variants = [];
        if (req.body.variants) {
            variants = JSON.parse(req.body.variants);
        }

       
        const addproduct = {
            name,
            description,
            batchNumber,
            rating,
            totalReviews,
            isAvailable,
            variants 
        };

      
        if (req.file) {
            addproduct.imagepath = `/uploads/${req.file.filename}`;
        }

      
        const newProduct = new SimpleProduct(addproduct);
        const savedProduct = await newProduct.save();
        

        res.status(201).json(savedProduct);

    } catch (err) {
        console.error("Controller Error:", err);
        res.status(500).json({ error: err.message });
    }
};


// 2. READ (Saare Products Get Karna - Frontend par dikhane ke liye)
export const readproduct = async (req, res) => {
    try {
        const products = await SimpleProduct.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 3. UPDATE (Product ki Details Badadna - Jaise Price change karna)
export const updateproduct = async (req, res) => {
    try {
        const { id } = req.params;
        let updateProductData = { ...req.body };

        // FIX 1: JSON format strings ko Javascript object arrays me parse karna padding layer ke liye
        if (req.body.variants) {
            try {
                updateProductData.variants = JSON.parse(req.body.variants);
            } catch (e) {
                // Agar variants pehle se object array hai toh parse skip karein
            }
        }

        // Image validation check execution
        if (req.file) {
            updateProductData.imagepath = `/uploads/${req.file.filename}`;
        } else {
            updateProductData.imagepath = req.body.oldProfile;
        }

        delete updateProductData.oldProfile;

        // Mongoose document updation workflow step
        const updatedProduct = await SimpleProduct.findByIdAndUpdate(
            id,
            updateProductData, 
            { new: true, runValidators: true } 
        );

        if (!updatedProduct) {
            // FIX 2: Dynamic validation descriptive statement error update response
            return res.status(404).json({ message: "Product database me nahi mila ya update fail hua" });
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 4. DELETE (Product Hata Dena)
export const deleteproduct =  async (req, res) => {
    try {
        const {id} = req.params;
        const deleteProduct  = await SimpleProduct.findByIdAndDelete(id);
        if(!deleteProduct){
            return res.status(404).json({message: "Product nahi mila"})
        }

        if(deleteProduct.imagepath){
            const image = path.join(process.cwd(), deleteProduct.imagepath)
            fs.access(image, fs.constants.F_OK, (err)=>{
                if(!err){
                    fs.unlink(image, (unlinkErr)=>{
                        if(unlinkErr) console.error("Image file delete karna me eroor :", unlinkErr)
                        else console.log("Image folder se bhi ekdum saaf!")
                    })
                }else {
                    console.log("Image file folder me mili hi nahi, shaayad pehle hi delete ho gayi thi.");
                }
            })
        }
        res.status(200).json({ message: "Product successfully deleted!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 5. GET SINGLE PRODUCT (Edit page ke liye zaroori)
export const getproductbyid = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await SimpleProduct.findById(id);

        if (!product) {
            return res.status(404).json({ error: "Product nahi mila" });
        }

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}