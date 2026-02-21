require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Importação das rotas
const authRoutes = require("./src/routes/auth_routes");
const tutorRoutes = require("./src/routes/tutor_routes");
const animalRoutes = require("./src/routes/animal_routes");
const vacinaRoutes = require("./src/routes/vacina_routes");
const dashboardRoutes = require("./src/routes/dashboard_routes");
const relatoriosRoutes = require("./src/routes/relatorios_routes");

// 1. Defina a porta antes de usar!
const PORT = 3000;

// 2. Rotas específicas primeiro
app.use("/tutores", tutorRoutes);
app.use("/animais", animalRoutes);
app.use("/vacinas", vacinaRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/relatorios", relatoriosRoutes);

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
    console.log("🚀 Rotas integradas com o Frontend!");
});
