import express from "express";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import { logger } from "./logger.js";
import { urls } from "./urls.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(logger);

//generate shortcode -> if not provided
function generateShortCode() {
  return uuidv4().slice(0, 6);
}

// create short url
app.post("/shorturls", (req, res) => {
  const { url, validity, shortcode } = req.body;
  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  // validate shortcode
  let code = shortcode || generateShortCode();
  if (urls.has(code)) {
    return res.status(400).json({ message: "Shortcode already exists" });
  }

  const createdAt = new Date();
  const expiry = new Date(createdAt.getTime() + (validity || 30) * 60000);

  urls.set(code, {
    originalUrl: url,
    createdAt,
    expiry,
    clicks: [],
  });

  return res.status(201).json({
    shortLink: `http://localhost:${PORT}/${code}`,
    expiry: expiry.toISOString(),
  });
});

// to -> original url
app.get("/:code", (req, res) => {
  const code = req.params.code;
  const data = urls.get(code);

  if (!data) {
    return res.status(404).json({ message: "Shortcode not found" });
  }

  const now = new Date();
  if (now > new Date(data.expiry)) {
    return res.status(410).json({ message: "Link expired" });
  }

  // track click
  data.clicks.push({
    timestamp: now.toISOString(),
    referrer: req.get("referer") || "direct",
    location: req.ip,
  });

  return res.redirect(data.originalUrl);
});

// get stats
app.get("/shorturls/:code", (req, res) => {
  const code = req.params.code;
  const data = urls.get(code);

  if (!data) {
    return res.status(404).json({ message: "Shortcode not found" });
  }

  res.json({
    originalUrl: data.originalUrl,
    createdAt: data.createdAt,
    expiry: data.expiry,
    clicks: data.clicks.length,
    clickData: data.clicks,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
