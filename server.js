import "dotenv/config";
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PDF_DIR = path.join(__dirname, "public", "pdfs");
const PORT = process.env.PDF_SERVER_PORT || 3001;

if (!fs.existsSync(PDF_DIR)) {
  fs.mkdirSync(PDF_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, PDF_DIR),
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${(file.originalname || "report").replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    cb(null, safeName);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const app = express();
app.use(express.json());

app.use((_req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/pdfs", express.static(PDF_DIR));

app.post("/api/upload-pdf", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No PDF file uploaded" });
  }
  const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
  const url = `${baseUrl}/pdfs/${req.file.filename}`;
  res.json({ url });
});

app.listen(PORT, () => {
  console.log(`PDF server: http://localhost:${PORT}`);
});
