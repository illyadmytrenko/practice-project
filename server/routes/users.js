/* eslint-disable no-undef */
import { Router } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));
const usersPath = path.join(__dirname, "..", "users.json");

const secretKey = process.env.VITE_JWT_SECRET;

const readUsers = () => {
  const data = fs.existsSync(usersPath)
    ? fs.readFileSync(usersPath)
    : JSON.stringify([]);
  return JSON.parse(data);
};

const writeUsers = (users) => {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

router.get("/", (req, res) => {
  const users = readUsers();
  res.json(users);
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const users = readUsers();

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now(),
    name,
    email,
    password: hashedPassword,
    role: "user",
  };

  users.push(newUser);
  writeUsers(users);

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, secretKey, {
    expiresIn: "7d",
  });

  res.json({
    message: "Registration successful",
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const users = readUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ message: "No user found with such email." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Wrong password. Try again" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
    expiresIn: "7d",
  });

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
    },
  });
});

export default router;
