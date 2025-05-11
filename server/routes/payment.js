import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// eslint-disable-next-line no-undef
const MONOBANK_TOKEN = process.env.VITE_MONOBANK_TOKEN;

router.post("/", async (req, res) => {
  const { amount, comment, redirectUrl, reference } = req.body;

  if (!amount || !redirectUrl || !reference) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const payload = {
    amount,
    ccy: 980,
    redirectUrl,
    validity: 3600,
    merchantPaymInfo: {
      reference,
      destination: "Оплата квитків у кінотеатрі",
      comment: comment || "",
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
  } catch (err) {
    console.error("Monobank error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create invoice" });
  }
});

export default router;
