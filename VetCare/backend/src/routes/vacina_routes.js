const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 1. CADASTRAR NOVA VACINA (POST)
router.post("/", async (req, res) => {
    try {
        const { id_animal, nome_vacina, data_aplicacao, data_revacinacao } = req.body;
        
        // SQL AJUSTADO: Usando a coluna 'nome' que vimos no seu DESCRIBE
        const sql = "INSERT INTO vacina (id_animal, nome, data_aplicacao, data_revacinacao) VALUES (?, ?, ?, ?)";
        const valores = [id_animal, nome_vacina, data_aplicacao, data_revacinacao];

        await db.query(sql, valores);
        
        res.json({ sucesso: true });
    } catch (error) {
        console.error("Erro no MySQL:", error.message);
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

// 2. BUSCAR HISTÓRICO (GET)
router.get("/animal/:id", async (req, res) => {
    try {
        // Pegamos 'nome' do banco e fingimos que é 'nome_vacina' para o histórico funcionar
        const [rows] = await db.query(
            "SELECT id_vacina, nome AS nome_vacina, data_aplicacao, data_revacinacao FROM vacina WHERE id_animal = ? ORDER BY data_aplicacao DESC",
            [req.params.id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar histórico" });
    }
});

module.exports = router;