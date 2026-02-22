const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/pendentes", async (req, res) => {
    try {
        const sql = `
            SELECT 
                v.id_vacina, 
                v.nome AS nome_vacina, 
                v.data_revacinacao, 
                a.nome AS animal_nome, 
                t.nome AS tutor_nome,
                a.id_animal
            FROM vacina v
            JOIN animal a ON v.id_animal = a.id_animal
            JOIN tutor t ON a.id_tutor = t.id_tutor
            WHERE v.data_revacinacao <= DATE_ADD(CURDATE(), INTERVAL 15 DAY)
            ORDER BY v.data_revacinacao ASC
        `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (error) {
        console.error("Erro ao buscar vacinas críticas:", error.message);
        res.status(500).json({ erro: error.message });
    }
});

// 2. CADASTRAR VACINA
router.post("/", async (req, res) => {
    try {
        const { id_animal, nome_vacina, data_aplicacao, data_revacinacao } = req.body;
        // Se sua coluna no banco chama 'nome', o SQL abaixo está correto:
        const sql = "INSERT INTO vacina (id_animal, nome, data_aplicacao, data_revacinacao) VALUES (?, ?, ?, ?)";
        await db.query(sql, [id_animal, nome_vacina, data_aplicacao, data_revacinacao]);
        res.json({ sucesso: true });
    } catch (error) {
        console.error("❌ Erro ao salvar vacina:", error.message);
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

// 3. HISTÓRICO POR ANIMAL
router.get("/animal/:id", async (req, res) => {
    try {
        const sql = "SELECT id_vacina, nome AS nome_vacina, data_aplicacao, data_revacinacao FROM vacina WHERE id_animal = ? ORDER BY data_aplicacao DESC";
        const [rows] = await db.query(sql, [req.params.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// ATUALIZAR VACINA (DAR BAIXA)
router.put("/aplicar/:id", async (req, res) => {
    try {
        const id_vacina = req.params.id;
        
        // SQL que define aplicação hoje e revacinação +1 ano
        const sql = `
            UPDATE vacina 
            SET data_aplicacao = CURDATE(), 
                data_revacinacao = DATE_ADD(CURDATE(), INTERVAL 1 YEAR) 
            WHERE id_vacina = ?`;
            
        await db.query(sql, [id_vacina]);
        res.json({ sucesso: true });
    } catch (error) {
        console.error("Erro ao atualizar vacina:", error.message);
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id_vacina = req.params.id;
        const sql = "DELETE FROM vacina WHERE id_vacina = ?";
        
        await db.query(sql, [id_vacina]);
        res.json({ sucesso: true });
    } catch (error) {
        console.error("Erro ao excluir vacina:", error.message);
        res.status(500).json({ sucesso: false, erro: error.message });
    }
});
module.exports = router;