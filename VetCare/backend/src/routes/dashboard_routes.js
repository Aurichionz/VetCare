const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
    try {
        // CARDS
        const [resTotal] = await db.query("SELECT COUNT(*) as total FROM animal");
        const [resEmDia] = await db.query(`
            SELECT COUNT(*) as total FROM vacina 
            WHERE data_revacinacao IS NOT NULL AND data_revacinacao > CURDATE()
        `);
        const [resProximas] = await db.query(`
            SELECT COUNT(*) as total FROM vacina 
            WHERE data_revacinacao BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        `);
        const [resPendentes] = await db.query(`
            SELECT COUNT(*) as total FROM vacina 
            WHERE data_revacinacao IS NOT NULL AND data_revacinacao < CURDATE()
        `);

        // GRÁFICO VACINAÇÕES (Note que usamos MONTH() e YEAR())
        const [vacinasMes] = await db.query(`
            SELECT MONTH(data_aplicacao) as mes, COUNT(*) as total
            FROM vacina
            WHERE YEAR(data_aplicacao) = YEAR(CURDATE())
            GROUP BY MONTH(data_aplicacao)
        `);

        // GRÁFICO DESEMPENHO (Cadastro de animais)
        const [desempenhoMes] = await db.query(`
            SELECT MONTH(data_cadastro) as mes, COUNT(*) as total
            FROM animal
            WHERE YEAR(data_cadastro) = YEAR(CURDATE())
            GROUP BY MONTH(data_cadastro)
        `);

        // TABELA ATENDIDOS
        const [tabelaAtendidos] = await db.query(`
            SELECT a.nome, a.especie, a.raca, v.data_aplicacao
            FROM vacina v
            JOIN animal a ON v.id_animal = a.id_animal
            WHERE MONTH(v.data_aplicacao) = MONTH(CURDATE())
            AND YEAR(v.data_aplicacao) = YEAR(CURDATE())
            ORDER BY v.data_aplicacao DESC
        `);

        res.json({
            totalAnimais: resTotal[0]?.total || 0,
            vacinasEmDia: resEmDia[0]?.total || 0,
            vacinasProximas: resProximas[0]?.total || 0,
            vacinasPendentes: resPendentes[0]?.total || 0,
            vacinasMes,
            desempenhoMes,
            tabelaAtendidos
        });

    } catch (error) {
        console.error("Erro no Dashboard:", error);
        res.status(500).json({ erro: "Erro ao carregar dados do dashboard" });
    }
});

module.exports = router;