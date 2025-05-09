import express, { json } from "express";
import cors from "cors";
import moviesRoutes from "./routes/movies.js";
import userRoutes from "./routes/users.js";
import scheduleRoutes from "./routes/schedule.js";

const app = express();
// const PORT = 5050;
const PORT = 5000;

app.use(cors());
app.use(json());

app.use("/api/movies", moviesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/schedule", scheduleRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
