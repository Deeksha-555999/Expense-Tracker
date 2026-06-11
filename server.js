import express from "express";
import userRouter from "./routes/user.js";
import transactionRouter from "./routes/transaction.js";
const app = express();
import cors from "cors";
import "./db.js";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH" ],
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
