import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser" // <-- NEW: Cookie parse karne ke liye
import db from "./config/db.js"
import productRouter from "./routes/product.routes.js"
import authRoutes from "./routes/auth.routes.js"
import queryRoutes from "./routes/query.routes.js"
import leadRoutes from "./routes/lead.routes.js"
import paymentRoutes from "./routes/payment.routes.js"
import dotenv from "dotenv"
import dns from "dns"
import path from "path"
import { fileURLToPath } from "url"

import User from "./models/UserAuth.models.js" 

dns.setServers(["1.1.1.1","8.8.8.8"])
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

// Middleware setup
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:5000', 'http://127.0.0.1:5000'],
  credentials: true // <-- ZAROORI: Taaki cookies incoming/outgoing access ho sakein
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser()); // <-- NEW: Cookie Parser registration

// Static files handler (Bina login wale public assets ke liye)
app.use('/uploads', express.static('uploads'));

// ==========================================
// VIEWS ROUTING (Frontend Pages from Backend)
// ==========================================
// Note: Frontend folders ko backend se serve karne ke liye use karein static block ya custom paths.
app.use('/api/product', productRouter)
app.use('/', authRoutes); // Auth routes matching view pages directly
app.use('/api/queries', queryRoutes);
app.use('/api/lead', leadRoutes);
app.use("/api/payments", paymentRoutes);

// Database connection & Server Boot
const Port = process.env.PORT || 5000;
db().then(() => {
  app.listen(Port,()=>{
      console.log(`Server is running on Port ${Port}`)
  })
});