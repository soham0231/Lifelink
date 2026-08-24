import express from "express";
import cors from "cors";

const port = 5000;
const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("lifelink Backend");
});

app.get("/test",(req,res)=>{
    res.json({
        message:"frontend and Backend is working fine" ,
    });
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});