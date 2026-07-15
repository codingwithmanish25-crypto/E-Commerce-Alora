import express from "express"
import cors from "cors"
import db from "./config/db.js"
import productRouter from "./routes/product.routes.js"
import authRoutes from "./routes/auth.routes.js"
import queryRoutes from "./routes/query.routes.js"
import dotenv from "dotenv"
import dns from "dns"

dns.setServers(["1.1.1.1","8.8.8.8"])
dotenv.config()



const app = express()
db()
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'], // Match front-end local servers
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/uploads', express.static('uploads'));
app.use("/api/product", productRouter)
app.use('/api/auth', authRoutes);
app.use('/api/queries', queryRoutes);

app.use((err, req, res, next) => {
  // 1. Force log the actual underlying problem to your terminal
  console.log("--- ACTUAL RUNTIME ERROR ---");
  console.error(err);
  console.log("----------------------------");

  if (res.headersSent) {
    return next(err);
  }

  // 2. Safely parse the message so it doesn't just regurgitate a broken function string
  const errorMessage = err instanceof Error ? err.message : String(err);

  res.status(500).json({ 
    message: 'Database or validation error occurred', 
    error: errorMessage === "next is not a function" ? "Check server terminal logs for real error" : errorMessage
  });
});

const Port = process.env.PORT  
app.listen(Port,()=>{
    console.log(`Server is running on Port ${Port}`)
})
