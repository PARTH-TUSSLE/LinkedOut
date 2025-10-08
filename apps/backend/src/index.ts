import express from "express";
import cors from "cors"
import "dotenv/config";
import userRouter from "./routes/userRoute.js";

const app = express();
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json());
app.use("/api/v1", userRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})