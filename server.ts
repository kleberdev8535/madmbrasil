import express from 'express';
import path from 'path';

// NOTE: Em produção, use HTTPS para proteger dados pessoais transmitidos (Requirement 7.3)
const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app;
