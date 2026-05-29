import express from "express";
import userRouter from "./routes/user.js";
import transactionRouter from "./routes/transaction.js";
const app = express();
import cors from "cors";
import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://deeksha:deeksha1234@deeksha.l1epqsn.mongodb.net/expense-tracker?appName=deeksha";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/transactions", transactionRouter);
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("hello world");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}`);
});
