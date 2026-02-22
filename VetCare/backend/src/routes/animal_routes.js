const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", async (req, res) => {
  try {
    const { nome, especie, raca, idade, peso, sexo, tutorId } = req.body;

    // Verificação simples para o terminal
    console.log("Tentando cadastrar animal:", { nome, tutorId });

    const sql = `INSERT INTO animal 
       (nome, especie, raca, idade, peso, sexo, id_tutor, data_cadastro)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())`;
    
    // Usamos query para maior compatibilidade com conversão automática de tipos
    await db.query(sql, [
      nome, 
      especie, 
      raca, 
      Number(idade), // Garante que é número
      Number(peso),  // Garante que é número
      sexo, 
      Number(tutorId) // Garante que o ID é número
    ]);

    res.json({ sucesso: true });
  } catch (error) {
    console.error("Erro detalhado no MySQL:", error);
    res.status(500).json({ sucesso: false, erro: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
        SELECT a.*, t.nome AS tutor_nome 
        FROM animal a
        JOIN tutor t ON a.id_tutor = t.id_tutor
        ORDER BY a.nome
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar animais" });
  }
});


// BUSCAR ANIMAL POR ID (Com nome do tutor)
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.*, t.nome AS tutor_nome 
       FROM animal a
       JOIN tutor t ON a.id_tutor = t.id_tutor
       WHERE a.id_animal = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ erro: "Animal não encontrado." });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar animal." });
  }
});

// ATUALIZAR ANIMAL (PUT)
router.put("/:id", async (req, res) => {
  try {
    const { nome, especie, raca, idade, peso, sexo, tutorId } = req.body;

    await db.query(
      `UPDATE animal SET 
        nome=?, especie=?, raca=?, idade=?, peso=?, sexo=?, id_tutor=?
       WHERE id_animal=?`,
      [nome, especie, raca, idade, peso, sexo, tutorId, req.params.id]
    );

    res.json({ sucesso: true, mensagem: "Animal atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar animal." });
  }
});

module.exports = router;

// ROTA DE EXCLUSÃO DE ANIMAL COM LÓGICA DE LIMPEZA DE TUTOR
router.delete("/:id", async (req, res) => {
    try {
        const idAnimal = req.params.id;

        // 1. Descobrir quem é o tutor desse animal antes de deletar o animal
        const [animal] = await db.query("SELECT id_tutor FROM animal WHERE id_animal = ?", [idAnimal]);
        
        if (animal.length === 0) return res.status(404).json({ erro: "Animal não encontrado" });
        const idTutor = animal[0].id_tutor;

        // 2. Deletar o animal
        await db.query("DELETE FROM animal WHERE id_animal = ?", [idAnimal]);

        // 3. Verificar se esse tutor ainda tem algum OUTRO animal
        const [outrosAnimais] = await db.query("SELECT id_animal FROM animal WHERE id_tutor = ?", [idTutor]);

        // 4. Se não sobrou nenhum animal, deleta o tutor automaticamente
        if (outrosAnimais.length === 0) {
            await db.query("DELETE FROM tutor WHERE id_tutor = ?", [idTutor]);
            return res.json({ mensagem: "Animal e Tutor (sem animais) excluídos com sucesso!" });
        }

        res.json({ mensagem: "Animal excluído com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao processar exclusão" });
    }
});
// ISSO É O MAIS IMPORTANTE:
module.exports = router;