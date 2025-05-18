import express, { json } from "express";
import cors from "cors";
import moviesRoutes from "./routes/movies.js";
import userRoutes from "./routes/users.js";
import scheduleRoutes from "./routes/schedule.js";
import paymentRoutes from "./routes/payment.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());

app.use("/api/movies", moviesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
