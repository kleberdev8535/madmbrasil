"use strict";

const express = require("express");
const path = require("path");

const app = express();

// 🔥 porta do Render
const PORT = process.env.PORT || 3000;

// 🔥 servir arquivos da pasta public
app.use(express.static(path.join(__dirname, "public")));

// 🔥 rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔥 subir servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
});
