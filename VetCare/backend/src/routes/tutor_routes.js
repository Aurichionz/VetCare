const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", async (req, res) => {
    try {
        const { nome, cpf, telefone, rua, numero, bairro, cidade, estado } = req.body;

        // Validar se dados essenciais chegaram
        if (!nome || !cpf) {
            return res.status(400).json({ sucesso: false, erro: "Nome e CPF são obrigatórios." });
        }

        // SQL ajustado para as suas colunas individuais
        const sql = `INSERT INTO tutor (nome, cpf, telefone, rua, numero, bairro, cidade, estado) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        await db.query(sql, [nome, cpf, telefone, rua, numero, bairro, cidade, estado]);

        res.json({ sucesso: true });
    } catch (error) {
        // Se der erro de coluna inexistente, aparecerá aqui no terminal
        console.error("❌ Erro no MySQL:", error.message);
        res.status(500).json({ sucesso: false, erro: "Erro ao salvar no banco. Verifique as colunas." });
    }
});

// LISTAR TUTORES COM CONTADOR DE ANIMAIS
router.get("/", async (req, res) => {
    try {
        const sql = `
            SELECT t.*, COUNT(a.id_animal) AS total_animais
            FROM tutor t
            LEFT JOIN animal a ON t.id_tutor = a.id_tutor
            GROUP BY t.id_tutor
            ORDER BY t.nome
        `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao listar tutores" });
    }
});

// BUSCAR UM TUTOR POR ID
router.get("/:id", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM tutor WHERE id_tutor = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ erro: "Tutor não encontrado" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar tutor" });
    }
});

// EDITAR TUTOR
router.put("/:id", async (req, res) => {
    try {
        const { nome, telefone, rua, numero, bairro, cidade, estado } = req.body;
        const sql = `UPDATE tutor SET nome=?, telefone=?, rua=?, numero=?, bairro=?, cidade=?, estado=? WHERE id_tutor=?`;
        await db.query(sql, [nome, telefone, rua, numero, bairro, cidade, estado, req.params.id]);
        res.json({ sucesso: true });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao atualizar" });
    }
});

// EXCLUIR TUTOR MANUALMENTE
router.delete("/:id", async (req, res) => {
    try {
        // Primeiro deletamos os animais do tutor para não dar erro de chave estrangeira
        await db.query("DELETE FROM animal WHERE id_tutor = ?", [req.params.id]);
        // Depois deletamos o tutor
        await db.query("DELETE FROM tutor WHERE id_tutor = ?", [req.params.id]);
        res.json({ sucesso: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao excluir tutor" });
    }
});

module.exports = router;