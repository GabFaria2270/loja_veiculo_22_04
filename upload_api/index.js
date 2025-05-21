import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json()); // Para ler JSON no body

app.use("/uploads", express.static("uploads"));

// Configuração de armazenamento do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tipo = req.query.tipo || "geral";
    const uploadPath = `uploads/${tipo}`;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Usa timestamp para evitar conflitos
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// Rota para upload de arquivos
app.post("/upload", upload.single("file"), (req, res) => {
  const tipo = req.query.tipo || "geral";
  const fileUrl = `http://localhost:${port}/uploads/${tipo}/${req.file.filename}`;
  res.json({ url: fileUrl });
});

const port = 3037;
app.listen(port, () => {
  console.log("Servidor de upload rodando em http://localhost:" + port);
});
