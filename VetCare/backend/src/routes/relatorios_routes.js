const express = require("express");
const router = express.Router();
const db = require("../config/db");

// RELATÓRIO DE ANIMAIS
router.get("/animais", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT a.*, t.nome AS tutor
            FROM animal a
            JOIN tutor t ON a.id_tutor = t.id_tutor
            ORDER BY a.nome
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao gerar relatório de animais" });
    }
});

// RELATÓRIO DE VACINAS - BUSCA HISTÓRICO COMPLETO
router.get("/vacinas", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                v.nome AS nome_vacina, 
                v.data_aplicacao, 
                v.data_revacinacao, 
                a.nome AS animal, 
                t.nome AS tutor
            FROM vacina v
            JOIN animal a ON v.id_animal = a.id_animal
            JOIN tutor t ON a.id_tutor = t.id_tutor
            ORDER BY v.data_revacinacao DESC -- Garante que as mais recentes apareçam no topo
        `);
        res.json(rows);
    } catch (error) {
        console.error("Erro no relatório de vacinas:", error);
        res.status(500).json({ erro: "Erro ao gerar relatório de vacinas" });
    }
});

module.exports = router;