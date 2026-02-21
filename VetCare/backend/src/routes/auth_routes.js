const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/login", async (req, res) => {
    try {
        const { usuaria, senha } = req.body;

        // Query simples para validar login
        const [rows] = await db.query(
            "SELECT id_usuario, nome FROM usuario WHERE usuaria = ? AND senha = ?",
            [usuaria, senha]
        );

        if (rows.length === 1) {
            return res.json({
                sucesso: true,
                nome: rows[0].nome,
                id: rows[0].id_usuario
            });
        } else {
            return res.status(401).json({ 
                sucesso: false, 
                mensagem: "Usuária ou senha incorretos." 
            });
        }
    } catch (error) {
        console.error("Erro no MySQL:", error);
        return res.status(500).json({ 
            sucesso: false, 
            mensagem: "Erro interno no banco de dados." 
        });
    }
});

module.exports = router;