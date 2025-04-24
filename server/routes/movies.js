import { Router } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

const moviesPath = path.join(__dirname, "..", "movies.json");

router.get("/", (req, res) => {
  fs.readFile(moviesPath, "utf-8", (err, data) => {
    if (err)
      return res.status(500).json({ error: "Failed to read movies file" });

    const movies = JSON.parse(data);
    res.json(movies);
  });
});

router.get("/:id", (req, res) => {
  const movieId = req.params.id;

  fs.readFile(moviesPath, "utf-8", (err, data) => {
    if (err)
      return res.status(500).json({ error: "Failed to read movies file" });

    const movies = JSON.parse(data);
    const movie = movies.find((m) => m.id === movieId);

    if (!movie) return res.status(404).json({ error: "Movie not found" });

    res.json(movie);
  });
});

export default router;
