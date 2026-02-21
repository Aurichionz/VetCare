const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", async (req, res) => {
    try {
        const { nome, cpf, telefone, rua, numero, bairro, cidade, estado } = req.body;

        // Concatenando para salvar em uma única coluna de endereço, 
        // ou você pode salvar em colunas separadas se seu banco tiver todas elas.
        const enderecoCompleto = `${rua}, ${numero} - ${bairro}, ${cidade}/${estado}`;

        const sql = `INSERT INTO tutor (nome, cpf, telefone, endereco) VALUES (?, ?, ?, ?)`;
        
        await db.query(sql, [nome, cpf, telefone, enderecoCompleto]);

        res.json({ sucesso: true });
    } catch (error) {
        console.error("Erro ao inserir tutor:", error);
        res.status(500).json({ sucesso: false, erro: "Erro ao salvar no banco de dados." });
    }
});

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM tutor ORDER BY nome");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar tutores" });
    }
});

module.exports = router;