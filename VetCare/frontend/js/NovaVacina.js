document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const formVacina = document.getElementById("formVacina");

    if (!id) {
        alert("Animal não identificado!");
        window.location.href = "ListarAnimais.html";
        return;
    }

    // Carregar dados do animal para o cabeçalho/card
    try {
        const response = await fetch(`http://localhost:3000/animais/${id}`);
        const animal = await response.json();
        
        // Preenche TODOS os campos informativos conforme sua imagem
        if (document.getElementById("animalNome")) 
            document.getElementById("animalNome").textContent = animal.nome || "---";
        
        if (document.getElementById("animalEspecie")) 
            document.getElementById("animalEspecie").textContent = animal.especie || "---";
        
        if (document.getElementById("animalRaca")) 
            document.getElementById("animalRaca").textContent = animal.raca || "---";
            
        if (document.getElementById("animalTutor")) 
            document.getElementById("animalTutor").textContent = animal.tutor_nome || "---";
            
        if (document.getElementById("animalIdade")) {
            const idade = animal.idade;
            document.getElementById("animalIdade").textContent = idade ? (idade === 1 ? "1 ano" : `${idade} anos`) : "---";
        }

        if (document.getElementById("animalPeso")) {
            const peso = parseFloat(animal.peso);
            document.getElementById("animalPeso").textContent = !isNaN(peso) ? `${peso.toFixed(2)} kg` : "---";
        }

        if (document.getElementById("animalSexo")) 
            document.getElementById("animalSexo").textContent = animal.sexo || "---";

    } catch (err) { 
        console.error("Erro ao carregar dados do animal:", err); 
    }

    // Lógica do formulário de submissão
    formVacina.addEventListener("submit", async (e) => {
        e.preventDefault();

        const dadosVacina = {
            id_animal: id,
            nome_vacina: formVacina.nomeVacina.value,
            data_aplicacao: formVacina.dataAplicacao.value,
            data_revacinacao: formVacina.dataRevacinacao.value
        };

        try {
            const res = await fetch("http://localhost:3000/vacinas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosVacina)
            });

            const resultado = await res.json();

            if (res.ok && resultado.sucesso) {
                alert("✅ Vacina registrada!");
                window.location.href = `HistoricoVacina.html?id=${id}`;
            } else {
                alert("Erro: " + (resultado.erro || "Falha ao salvar"));
            }
        } catch (error) {
            alert("Servidor offline!");
        }
    });
});