import { Router } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

const schedulePath = path.join(__dirname, "..", "schedule.json");

router.get("/", (_, res) => {
  fs.readFile(schedulePath, "utf-8", (err, data) => {
    if (err)
      return res.status(500).json({ error: "Failed to read schedule file" });

    try {
      const schedule = JSON.parse(data);
      res.json(schedule);
    } catch (e) {
      res.status(500).json({ error: `Invalid JSON in schedule file. ${e}` });
    }
  });
});

export default router;
