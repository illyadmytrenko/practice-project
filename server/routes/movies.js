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

router.post("/", (req, res) => {
  fs.readFile(moviesPath, "utf-8", (readErr, raw) => {
    if (readErr) {
      console.error("Read error:", readErr);
      return res.status(500).json({ error: "Failed to read movies file" });
    }

    let movies;
    try {
      movies = JSON.parse(raw);
    } catch (parseErr) {
      console.error("Parse error:", parseErr);
      return res.status(500).json({ error: "Invalid JSON in movies file" });
    }
    const maxId = movies.reduce(
        (max, m) => Math.max(max, parseInt(m.id, 10)),
        0
    );
    const newId = String(maxId + 1);

    const newMovie = { id: newId, ...req.body };
    movies.push(newMovie);

    new Promise((resolve, reject) => {
      fs.writeFile(
          moviesPath,
          JSON.stringify(movies, null, 2),
          "utf-8",
          (writeErr) => (writeErr ? reject(writeErr) : resolve())
      );
    })
        .then(() => {
          res.status(201).json(newMovie);
        })
        .catch((writeErr) => {
          console.error("Write error:", writeErr);
          res.status(500).json({ error: "Failed to save new movie" });
        });
  });
});

router.put("/:id", (req, res) => {
  fs.readFile(moviesPath, "utf-8", (readErr, raw) => {
    if (readErr) return res.status(500).json({ error: "Failed to read file" });
    let movies;
    try {
      movies = JSON.parse(raw);
    } catch {
      return res.status(500).json({ error: "Invalid JSON" });
    }

    const idx = movies.findIndex((m) => m.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });

    const updated = { ...movies[idx], ...req.body, id: req.params.id };
    movies[idx] = updated;

    new Promise((resolve, reject) => {
      fs.writeFile(moviesPath, JSON.stringify(movies, null, 2), "utf-8", (err) =>
          err ? reject(err) : resolve()
      );
    })
        .then(() => res.json(updated))
        .catch(() => res.status(500).json({ error: "Failed to write file" }));
  });
});

router.delete("/:id", (req, res) => {
  fs.readFile(moviesPath, "utf-8", (readErr, raw) => {
    if (readErr) return res.status(500).json({ error: "Failed to read file" });
    let movies;
    try {
      movies = JSON.parse(raw);
    } catch {
      return res.status(500).json({ error: "Invalid JSON" });
    }

    const filtered = movies.filter((m) => m.id !== req.params.id);
    if (filtered.length === movies.length)
      return res.status(404).json({ error: "Not found" });

    new Promise((resolve, reject) => {
      fs.writeFile(moviesPath, JSON.stringify(filtered, null, 2), "utf-8", (err) =>
          err ? reject(err) : resolve()
      );
    })
        .then(() => res.status(204).end())
        .catch(() => res.status(500).json({ error: "Failed to write file" }));
  });
});

export default router;
