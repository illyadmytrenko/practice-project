import { Router } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

const schedulePath = path.join(__dirname, "..", "schedule.json");

router.get("/", (_, res) => {
  const data = JSON.parse(fs.readFileSync(schedulePath, "utf-8"));
  let changed = false;
  data.forEach(hallObj => {
      hallObj.schedule.forEach(item => {
          if (!item.id) {
              item.id = nanoid();
              changed = true;
            }
        });
    });
    if (changed) fs.writeFileSync(schedulePath, JSON.stringify(data, null, 2));
  res.json(data);
});

// CREATE
router.post("/", (req, res) => {
    const { hall, movieId, time, price, dates } = req.body;
    const data = JSON.parse(fs.readFileSync(schedulePath, "utf-8"));
    const hallObj = data.find(h => String(h.hall) === String(hall));
    if (!hallObj) return res.status(404).json({ error: "Hall not found" });
    const newItem = { id: nanoid(), movieId, time, price, dates, seats: [] };
    hallObj.schedule.push(newItem);
    fs.writeFileSync(schedulePath, JSON.stringify(data, null, 2));
    res.status(201).json(newItem);
});

// UPDATE
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const data = JSON.parse(fs.readFileSync(schedulePath, "utf-8"));
    let updated = null;
    data.forEach(hallObj => {
        const idx = hallObj.schedule.findIndex(s => s.id === id);
        if (idx !== -1) {
            hallObj.schedule[idx] = { ...hallObj.schedule[idx], ...req.body };
            updated = hallObj.schedule[idx];
          }
      });
    if (!updated) return res.status(404).json({ error: "Item not found" });
    fs.writeFileSync(schedulePath, JSON.stringify(data, null, 2));
    res.json(updated);
});

// DELETE
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    const data = JSON.parse(fs.readFileSync(schedulePath, "utf-8"));
    let found = false;
    data.forEach(hallObj => {
        const before = hallObj.schedule.length;
        hallObj.schedule = hallObj.schedule.filter(s => s.id !== id);
        if (hallObj.schedule.length !== before) found = true;
      });
    if (!found) return res.status(404).json({ error: "Item not found" });
    fs.writeFileSync(schedulePath, JSON.stringify(data, null, 2));
    res.status(204).end();
});

export default router;
