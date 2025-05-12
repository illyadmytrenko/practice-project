import { Router } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

// eslint-disable-next-line no-undef
const MONOBANK_TOKEN = process.env.VITE_MONOBANK_TOKEN;

const usersPath = path.join(__dirname, "..", "users.json");
const schedulePath = path.join(__dirname, "..", "schedule.json");
const tempOrdersPath = path.join(__dirname, "..", "temp-orders.json");

const readJson = (path) =>
  JSON.parse(fs.existsSync(path) ? fs.readFileSync(path, "utf-8") : "[]");

const writeJson = (path, data) =>
  fs.writeFileSync(path, JSON.stringify(data, null, 2));

router.post("/", async (req, res) => {
  const {
    amount,
    redirectUrl,
    name,
    qty,
    sum,
    icon,
    userId,
    movieId,
    date,
    time,
    hall,
    seats,
  } = req.body;

  if (
    !amount ||
    !redirectUrl ||
    !name ||
    !qty ||
    !sum ||
    !icon ||
    !userId ||
    !movieId ||
    !date ||
    !time ||
    !hall ||
    !seats
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const payload = {
    amount: amount,
    ccy: 980,
    redirectUrl,
    webHookUrl: "https://ba25-188-163-80-16.ngrok-free.app/api/payment/confirm",
    validity: 3600,
    merchantPaymInfo: {
      destination: "Оплата квитків у кінотеатрі",
      basketOrder: [{ name, qty, sum: sum, total: sum, icon }],
    },
  };

  try {
    const response = await axios.post(
      "https://api.monobank.ua/api/merchant/invoice/create",
      payload,
      {
        headers: {
          "X-Token": MONOBANK_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      invoiceId: response.data.invoiceId,
      pageUrl: response.data.pageUrl,
    });

    setTimeout(() => {
      const tempOrders = readJson(tempOrdersPath);
      tempOrders.push({
        invoiceId: response.data.invoiceId,
        userId,
        movieId,
        date,
        time,
        hall,
        seats,
      });
      writeJson(tempOrdersPath, tempOrders);
    }, 5000);
  } catch (err) {
    console.error("Monobank error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create invoice" });
  }
});

router.post("/confirm", (req, res) => {
  const { invoiceId, status } = req.body;

  if (status !== "success")
    return res.status(400).json({ error: "Payment failed" });

  const tempOrders = readJson(tempOrdersPath);
  const order = tempOrders.find((o) => o.invoiceId === invoiceId);
  if (!order) return res.status(404).json({ error: "Order not found" });

  const users = readJson(usersPath);
  const schedule = readJson(schedulePath);

  const user = users.find((u) => u.id === order.userId);
  const hallSchedule = schedule.find((h) => h.hall === order.hall);

  if (!user || !hallSchedule)
    return res.status(404).json({ error: "User or hall not found" });

  const session = hallSchedule.schedule.find(
    (s) =>
      s.movieId === order.movieId &&
      s.time === order.time &&
      s.dates.includes(order.date)
  );

  if (!session) return res.status(404).json({ error: "Session not found" });

  const takenSeats = session.seats.filter(
    (s) =>
      s.date === order.date &&
      order.seats.some((seat) => seat.row === s.row && seat.seat === s.seat)
  );

  if (takenSeats.length > 0)
    return res.status(409).json({ error: "One or more seats already taken" });

  for (const seat of order.seats) {
    session.seats.push({
      date: order.date,
      row: seat.row,
      seat: seat.seat,
    });

    const ticket = {
      movieId: order.movieId,
      date: order.date,
      time: order.time,
      hall: order.hall,
      row: seat.row,
      seat: seat.seat,
      price: session.price,
    };

    if (!user.tickets) user.tickets = [];
    user.tickets.push(ticket);
  }

  writeJson(usersPath, users);
  writeJson(schedulePath, schedule);

  const updatedTempOrders = tempOrders.filter((o) => o.invoiceId !== invoiceId);
  writeJson(tempOrdersPath, updatedTempOrders);

  res.json({
    message: "Tickets purchased successfully",
    tickets: user.tickets.slice(-order.seats.length),
  });
});

export default router;
