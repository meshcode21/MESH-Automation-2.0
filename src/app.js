import express from "express"
import fileRoute from "./Routes/fileRoute.js";

const port = 5000;
const app = express();

app.use(express.json());
app.use("/api/file",fileRoute);

app.get("/",(req,res)=>{
    res.send("server running...");
})

app.listen(port,()=>console.log(`Server running: http://localhost:${port}`))